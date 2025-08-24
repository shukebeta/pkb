#!/bin/bash
# eed_validator.sh - Ed script validation functions

# Source guard to prevent multiple inclusion
if [ "${EED_VALIDATOR_LOADED:-}" = "1" ]; then
    return 0
fi
EED_VALIDATOR_LOADED=1
# Source the shared regex patterns
source "$(dirname "${BASH_SOURCE[0]}")/eed_regex_patterns.sh"


# Disable history expansion to prevent ! character escaping
set +H

# Validate ed script for basic requirements
validate_ed_script() {
    local script="$1"

    # Check for empty script - treat as no-op, not error
    if [ -z "$script" ] || [ "$script" = "" ]; then
        echo "Warning: Empty ed script provided - no operations to perform" >&2
        return 0  # Success but no operations
    fi

    # Check if script ends with 'q' or 'Q' command
    if ! echo "$script" | grep -q '[qQ]$'; then
        echo "Warning: Ed script does not end with 'q' or 'Q' command" >&2
        echo "This may cause ed to wait for input or hang" >&2
        echo "Consider adding 'q' (save and quit) or 'Q' (quit without save) at the end" >&2
        # Don't fail - just warn, as user might intentionally want this
    fi

    return 0
}

# TODO: Implement enhanced validator with parsing stack
# validate_ed_script_enhanced() {
#     # The enhanced validator from user's example will go here
# }

# Classify ed script and validate commands
classify_ed_script() {
    local script="$1"
    local line
    local -a parsing_stack=()

    while IFS= read -r line; do
        # Trim whitespace and skip empty lines
        line="${line#"${line%%[![:space:]]*}"}"  # ltrim
        line="${line%"${line##*[![:space:]]}"}"  # rtrim
        [ -z "$line" ] && continue

        # Get current context from parsing stack
        local current_context=""
        if [ ${#parsing_stack[@]} -gt 0 ]; then
            current_context="${parsing_stack[${#parsing_stack[@]}-1]}"
        fi

        if [ "$current_context" = "INPUT" ]; then
            # Inside input mode - only look for terminator
            if [[ "$line" == "." ]]; then
                unset 'parsing_stack[${#parsing_stack[@]}-1]' 2>/dev/null || true
            fi
            continue
        fi

        # Check for modifying commands (append, change, insert)
        if [[ "$line" =~ ^(\.|[0-9]+|\$)?,?(\.|[0-9]+|\$)?[aAcCiI]$ ]]; then
            parsing_stack+=("INPUT")
            echo "has_modifying"
            return 0
        fi

        # Other modifying commands (delete, move, etc)
        if [[ "$line" =~ ^(\.|[0-9]+|\$)?,?(\.|[0-9]+|\$)?[dDmMtTjJsSuU] ]]; then
            echo "has_modifying"
            return 0
        fi

        # Substitute command: [range]s/pattern/replacement/[flags]
        if [[ "$line" =~ ^(\.|[0-9]+|\$)?,?(\.|[0-9]+|\$)?s/.*/.*/ ]]; then
            echo "has_modifying"
            return 0
        fi

        if [[ "$line" =~ ^w ]]; then
            echo "has_modifying"
            return 0
        fi

        # Check for valid view commands
        if [[ "$line" =~ ^(\.|[0-9]+|\$)?,?(\.|[0-9]+|\$)?[pPnNlL=]$ ]] || \
           [[ "$line" =~ ^[qQ]$ ]] || \
           [[ "$line" =~ ^(\.|[0-9]+|\$)$ ]] || \
           [[ "$line" =~ ^g/.*/[pPnNdDsS]?$ ]] || \
           [[ "$line" =~ ^/[^/]*/[pPnNlL=]?$ ]] || \
           [[ "$line" =~ ^/.*/([+-][0-9]+)?,/.*/([+-][0-9]+)?[pP]?$ ]] || \
           [[ "$line" =~ ^\?.*\?[pP]?$ ]]; then
            continue  # Valid view command, keep checking
        else
            # Invalid command found
            echo "invalid_command"
            return 0
        fi

    done <<< "$script"

    # If we get here, all commands were valid view commands
    echo "view_only"
    return 0
}

# Detect potential dot trap in ed scripts
# This detects patterns that might indicate a user intended to use heredoc
# but the dots got interpreted as ed terminators instead
detect_dot_trap() {
    local script="$1"
    local line_count=0
    local dot_count=0
    local suspicious_pattern=false

    # Count lines and standalone dots
    while IFS= read -r line; do
        ((line_count++))
        if [[ "$line" = "." ]]; then
            ((dot_count++))
        fi

        # Look for patterns suggesting heredoc usage attempt
        if [[ "$line" =~ ^[0-9]*[aciACI]$ ]] || [[ "$line" =~ ^w$ ]] || [[ "$line" =~ ^q$ ]]; then
            suspicious_pattern=true
        fi
    done <<< "$script"

    # Heuristic: if we have multiple standalone dots and ed commands,
    # this might be a case where heredoc wasn't used properly
    if [ $dot_count -gt 1 ] && [ "$suspicious_pattern" = true ] && [ $line_count -gt 5 ]; then
        echo "POTENTIAL_DOT_TRAP:$line_count:$dot_count"
        return 1
    fi

    return 0
}

# Provide helpful guidance about dot usage
suggest_dot_fix() {
    local script="$1"

    echo "⚠️  Detected multiple standalone dots in ed script" >&2
    echo "   If you're using complex ed commands, consider using heredoc syntax:" >&2
    echo "   eed file.txt \"\$(cat <<'EOF'" >&2
    echo "   your ed commands here" >&2
    echo "   use [DOT] for content, actual . for ed commands" >&2
    echo "   EOF" >&2
    echo "   )\"" >&2
    echo "" >&2
    echo "   Proceeding with current script..." >&2

    return 0
}

# Detect complex patterns that are unsafe for automatic reordering
detect_complex_patterns() {
    local script="$1"
    local line
    local -a addresses=()
    local -a intervals=()
    local in_g_block=false

    while IFS= read -r line; do
        # Skip empty lines and comments
        [[ -z "$line" || "$line" =~ ^[[:space:]]*# ]] && continue

        # Detect g/v blocks with modifying commands
        if [[ "$line" =~ $EED_REGEX_GV_MODIFYING ]]; then
            echo "COMPLEX: g/v block with modifying command detected: $line" >&2
            return 1
        fi

        # Detect non-numeric addresses with modifying commands
        if [[ "$line" =~ $EED_REGEX_NON_NUMERIC_MODIFYING ]]; then
            echo "COMPLEX: Non-numeric address with modifying command detected: $line" >&2
            return 1
        fi

        # Detect offset addresses with modifying commands
        if [[ "$line" =~ $EED_REGEX_OFFSET_MODIFYING ]]; then
            echo "COMPLEX: Offset address with modifying command detected: $line" >&2
            return 1
        fi

        # Detect move/transfer/read commands
        if [[ "$line" =~ ^[[:space:]]*[0-9]*,?[0-9]*[mMtTrR] ]]; then
            echo "COMPLEX: Move/transfer/read command detected: $line" >&2
            return 1
        fi

        # Extract numeric addresses and check for overlaps
        if [[ "$line" =~ ^([0-9]+)(,([0-9]+|\$))?([dDcCbBiIaAsS]) ]]; then
            local start="${BASH_REMATCH[1]}"
            local end="${BASH_REMATCH[3]:-$start}"
            local cmd="${BASH_REMATCH[4]}"

            # Convert $ to a high number for comparison
            [[ "$end" == "\$" ]] && end="999999"

            # Check for interval overlaps with existing ranges
            for existing in "${intervals[@]}"; do
                local ex_start="${existing%%:*}"
                local ex_end="${existing##*:}"

                # Check if intervals overlap
                if (( start <= ex_end && end >= ex_start )); then
                    echo "COMPLEX: Overlapping intervals detected: $start-$end vs $ex_start-$ex_end" >&2
                    return 1
                fi
            done

            intervals+=("$start:$end")
            addresses+=("$start")
        fi
    done <<< "$script"

    # Check for same-address conflicts
    local -A addr_count
    for addr in "${addresses[@]}"; do
        ((addr_count[$addr]++))
        if (( addr_count[$addr] > 1 )); then
            echo "COMPLEX: Multiple operations on same address: $addr" >&2
            return 1
        fi
    done

    return 0  # No complex patterns detected
}

# Automatically reorder ed script commands to prevent line number conflicts
# Returns reordered script via stdout, shows user-friendly messages via stderr
reorder_script_if_needed() {
    local script="$1"
    local line
    local -a script_lines=()
    local -a modifying_commands=()
    local -a modifying_line_numbers=()
    local line_index=0

    # Step 0: Check for complex patterns first
    if ! detect_complex_patterns "$script"; then
        echo "⚠️ Complex patterns detected. Auto-reordering disabled for safety." >&2
        while IFS= read -r line; do
            script_lines+=("$line")
        done <<< "$script"
        printf '%s\n' "${script_lines[@]}"  # Output original script
        return 0
    fi


    # Step 1: Parse script and collect all lines and modifying commands
    while IFS= read -r line; do
        script_lines+=("$line")
        if [[ "$line" =~ ^([0-9]+)(,([0-9]+|\$))?([dDcCbBiIaAsS]) ]]; then
            modifying_commands+=("$line_index:${BASH_REMATCH[1]}:$line")
            modifying_line_numbers+=("${BASH_REMATCH[1]}")
        fi
        ((line_index++))
    done <<< "$script"

    # Step 2: Check if reordering is needed (same logic as before)
    if [ ${#modifying_line_numbers[@]} -lt 2 ]; then
        printf '%s\n' "${script_lines[@]}"  # Output original script
        return 0
    fi

    local original_sequence="${modifying_line_numbers[*]}"
    local sorted_line_numbers
    mapfile -t sorted_line_numbers < <(printf '%s\n' "${modifying_line_numbers[@]}" | sort -n)
    local sorted_sequence_str="${sorted_line_numbers[*]}"

    # Step 3: If no reordering needed, return original script
    if [ "$original_sequence" != "$sorted_sequence_str" ]; then
        printf '%s\n' "${script_lines[@]}"  # Output original script
        return 0
    fi

    # Check for unique line numbers to avoid false positives
    local unique_count
    unique_count=$(printf '%s\n' "${modifying_line_numbers[@]}" | uniq | wc -l)
    if [ "$unique_count" -le 1 ]; then
        printf '%s\n' "${script_lines[@]}"  # Output original script
        return 0
    fi

    # Step 4: Perform automatic reordering
    echo "✓ Auto-reordering script to prevent line numbering conflicts:" >&2
    local original_formatted="($(IFS=, ; echo "${modifying_line_numbers[*]}"))"

    # Sort modifying commands by line number in descending order
    local -a sorted_modifying_commands
    mapfile -t sorted_modifying_commands < <(printf '%s\n' "${modifying_commands[@]}" | sort -s -t: -k2,2nr -k1,1n)

    local reverse_sorted_line_numbers
    mapfile -t reverse_sorted_line_numbers < <(printf '%s\n' "${modifying_line_numbers[@]}" | sort -nr)
    local suggested_formatted="($(IFS=, ; echo "${reverse_sorted_line_numbers[*]}"))"

    echo "   Original: ${original_formatted} → Reordered: ${suggested_formatted}" >&2
    echo "" >&2

    # Step 5: Build reordered script - handle input mode commands as atomic units
    local -a reordered_script=()
    local -a processed_indices=()

    # Add modifying commands in new order with their associated data
    for cmd_info in "${sorted_modifying_commands[@]}"; do
        local old_index="${cmd_info%%:*}"
        local cmd_line="${cmd_info##*:}"

        reordered_script+=("$cmd_line")
        processed_indices+=("$old_index")

        # If this is an input mode command (a, c, i), include following content until "."
        if [[ "$cmd_line" =~ [aAcCiI]$ ]]; then
            local content_idx=$((old_index + 1))
            while [ "$content_idx" -lt "${#script_lines[@]}" ]; do
                local content_line="${script_lines[$content_idx]}"
                reordered_script+=("$content_line")
                processed_indices+=("$content_idx")
                if [ "$content_line" = "." ]; then
                    break
                fi
                ((content_idx++))
            done
        fi
    done

    # Add remaining non-processed commands in original order
    for i in "${!script_lines[@]}"; do
        local is_processed=false
        for proc_idx in "${processed_indices[@]}"; do
            if [ "$i" = "$proc_idx" ]; then
                is_processed=true
                break
            fi
        done
        if [ "$is_processed" = false ]; then
            reordered_script+=("${script_lines[$i]}")
        fi
    done

    # Output reordered script
    printf '%s\n' "${reordered_script[@]}"
    return 1 # Signal that reordering was performed
}

# Legacy function for backward compatibility with existing tests
# Detects line order issues but doesn't reorder (just warns)
detect_line_order_issue() {
    local script="$1"
    local line
    local -a modifying_line_numbers=()

    # Parse script to extract line numbers from modifying commands
    while IFS= read -r line; do
        if [[ "$line" =~ ^([0-9]+)(,([0-9]+|\$))?([dDcCbBiIaAsS]) ]]; then
            modifying_line_numbers+=("${BASH_REMATCH[1]}")
        fi
    done <<< "$script"

    if [ ${#modifying_line_numbers[@]} -lt 2 ]; then
        return 0
    fi

    local original_sequence="${modifying_line_numbers[*]}"
    local sorted_line_numbers
    mapfile -t sorted_line_numbers < <(printf '%s\n' "${modifying_line_numbers[@]}" | sort -n)
    local sorted_sequence_str="${sorted_line_numbers[*]}"

    if [ "$original_sequence" = "$sorted_sequence_str" ]; then
        local unique_count
        unique_count=$(printf '%s\n' "${modifying_line_numbers[@]}" | uniq | wc -l)

        if [ "$unique_count" -gt 1 ]; then
            local reverse_sorted_line_numbers
            mapfile -t reverse_sorted_line_numbers < <(printf '%s\n' "${modifying_line_numbers[@]}" | sort -nr)

            local original_formatted="($(IFS=, ; echo "${modifying_line_numbers[*]}"))"
            local suggested_formatted="($(IFS=, ; echo "${reverse_sorted_line_numbers[*]}"))"

            echo "⚠️  Detected operations on ascending line numbers ${original_formatted}" >&2
            echo "💡 Consider reordering: start from line ${suggested_formatted}" >&2
            echo "   Reason: Earlier deletions shift line numbers, affecting later operations" >&2
            echo "" >&2
            return 1
        fi
    fi

    return 0
}
