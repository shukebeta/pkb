#!/usr/bin/env bats

# Unit tests for eed validator functions
# Direct testing of classify_ed_script and validate_ed_script

setup() {
    TEST_DIR="$(mktemp -d)"
    cd "$TEST_DIR"

    # Load validator functions
    source "/home/davidwei/Projects/pkb/bin/lib/eed_validator.sh"
    
    # Prevent logging during tests
    export EED_TESTING=1
}

teardown() {
    cd /
    rm -rf "$TEST_DIR"
}

# Test classify_ed_script function directly

@test "classifier: simple view commands" {
    run classify_ed_script "p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]

    run classify_ed_script ",p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]

    run classify_ed_script "1,5p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]
}

@test "classifier: search commands" {
    run classify_ed_script "/pattern/p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]

    run classify_ed_script "g/test/p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]

    run classify_ed_script "?backward?p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]
}

@test "classifier: address arithmetic" {
    run classify_ed_script "/pattern/-1,/pattern/+1p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]

    run classify_ed_script "/start/+2,/end/-1p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]
}

@test "classifier: current line commands" {
    run classify_ed_script ".c"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script ".p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]

    run classify_ed_script ".d"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier: insert/append commands" {
    run classify_ed_script "3i"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script "5a"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script "a"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier: delete commands" {
    run classify_ed_script "5d"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script "1,5d"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script ",d"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier: substitute commands" {
    run classify_ed_script "s/old/new/"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script "1,\$s/old/new/g"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script ".s/test/replacement/"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier: write commands" {
    run classify_ed_script "w"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script "w filename"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier: mixed scripts" {
    local mixed_script="$(cat <<'EOF'
/pattern/p
.c
new content
.
.p
w
q
EOF
)"
    run classify_ed_script "$mixed_script"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier: complex view-only script" {
    local view_script="$(cat <<'EOF'
,p
1,5n
/test/p
g/pattern/p
=
q
EOF
)"
    run classify_ed_script "$view_script"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]
}

@test "classifier: invalid commands" {
    run classify_ed_script "invalid_command"
    [ "$status" -eq 0 ]
    [ "$output" = "invalid_command" ]

    run classify_ed_script "xyz123"
    [ "$status" -eq 0 ]
    [ "$output" = "invalid_command" ]
}

@test "classifier: script with input mode parsing" {
    local script_with_input="$(cat <<'EOF'
3a
inserted line 1
inserted line 2
.
w
q
EOF
)"
    run classify_ed_script "$script_with_input"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier: empty script" {
    run classify_ed_script ""
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]
}

# Test validate_ed_script function directly

@test "validator: valid script with q terminator" {
    run validate_ed_script "5d
w
q"
    [ "$status" -eq 0 ]
}

@test "validator: valid script with Q terminator" {
    run validate_ed_script "5d
Q"
    [ "$status" -eq 0 ]
}

@test "validator: script without terminator shows warning" {
    run validate_ed_script "5d
w"
    [ "$status" -eq 0 ]
    [[ "$output" == *"Warning"* ]]
    [[ "$output" == *"does not end with 'q' or 'Q'"* ]]
}

@test "validator: empty script" {
    run validate_ed_script ""
    [ "$status" -eq 0 ]
    [[ "$output" == *"Warning: Empty ed script"* ]]
}

# Integration tests for edge cases

@test "classifier edge case: dollar sign in ranges" {
    run classify_ed_script "1,\$s/old/new/g"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]

    run classify_ed_script "5,\$p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]
}

@test "classifier edge case: number-only ranges" {
    run classify_ed_script "1,10p"
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]

    run classify_ed_script "5,20d"
    [ "$status" -eq 0 ]
    [ "$output" = "has_modifying" ]
}

@test "classifier robustness: whitespace and edge cases" {
    # Test with trailing spaces (shouldn't affect classification)
    run classify_ed_script "p "
    [ "$status" -eq 0 ]
    [ "$output" = "view_only" ]
}

@test "dot trap detection: normal ed commands not affected" {
    # Normal ed script with single dot should not trigger detection
    run detect_dot_trap "3c
new content
.
w
q"
    [ "$status" -eq 0 ]
}

@test "dot trap detection: simple script not flagged" {
    # Short script with normal ed operations should pass
    run detect_dot_trap "5d
w
q"
    [ "$status" -eq 0 ]
}

@test "dot trap detection: suspicious pattern detected" {
    # Complex script with multiple dots should trigger warning
    local script="3c
content line 1
.
5a
more content
.
7c
final content
.
w
q"
    run detect_dot_trap "$script"
    [ "$status" -ne 0 ]
    [[ "$output" == *"POTENTIAL_DOT_TRAP"* ]]
}

@test "dot trap guidance: provides helpful suggestions" {
    # Should provide clear guidance about heredoc usage
    local script="test script with multiple dots"
    run bash -c 'source /home/davidwei/Projects/pkb/bin/lib/eed_validator.sh && suggest_dot_fix "$1"' _ "$script"
    [ "$status" -eq 0 ]
    [[ "$output" == *"consider using heredoc syntax"* ]]
    [[ "$output" == *"[DOT] for content"* ]]
}

