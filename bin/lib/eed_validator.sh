#!/bin/bash
# eed_validator.sh - Ed script validation functions

# Source guard to prevent multiple inclusion
if [ "${EED_VALIDATOR_LOADED:-}" = "1" ]; then
    return 0
fi
EED_VALIDATOR_LOADED=1

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

        # Check for modifying commands
        if [[ "$line" =~ ^(\.|[0-9]+)?,?(\$|[0-9]+)?[aAcCiI]$ ]]; then
            parsing_stack+=("INPUT")
            echo "has_modifying"
            return 0
        fi

        if [[ "$line" =~ ^(\.|[0-9]+)?,?(\$|[0-9]+)?[dDmMtTjJsSuU] ]]; then
            echo "has_modifying"
            return 0
        fi

        # Substitute command: [range]s/pattern/replacement/[flags]
        if [[ "$line" =~ ^(\.|[0-9]+)?,?(\$|[0-9]+)?s/.*/.*/ ]]; then
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
           [[ "$line" =~ ^g/.*/[pPnNdDsS]?$ ]] || \
           [[ "$line" =~ ^/.*/([+-][0-9]+)?,/.*/([+-][0-9]+)?[pP]?$ ]] || \
           [[ "$line" =~ ^/.*/[pP]?$ ]] || \
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