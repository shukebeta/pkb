#!/bin/bash
# eed_common.sh - Common utility functions for eed

# Source guard to prevent multiple inclusion
if [ "${EED_COMMON_LOADED:-}" = "1" ]; then
    return 0
fi
EED_COMMON_LOADED=1

# Show usage information
show_usage() {
    echo "Usage: eed [--debug] <file> <ed_script>"
    echo ""
    echo "Single-parameter mode with heredoc support for complex operations."
    echo ""
    echo "Options:"
    echo "  --debug    Enable debug mode (preserve temp files, verbose errors)"
    echo ""
    echo "Common ed commands:"
    echo "  Nd             - Delete line N"
    echo "  N,Md           - Delete lines N through M"
    echo "  Nc <text> .    - Replace line N with <text>"
    echo "  Na <text> .    - Insert <text> after line N"
    echo "  Ni <text> .    - Insert <text> before line N"
    echo "  ,p             - Print all lines (view file)"
    echo "  N,Mp           - Print lines N through M"
    echo "  /pattern/p     - Print lines matching pattern"
    echo "  s/old/new/g    - Replace all 'old' with 'new' on current line"
    echo "  1,\$s/old/new/g - Replace all 'old' with 'new' in entire file"
    echo ""
    echo "Examples:"
    echo '  eed file.txt "5d\nw\nq"                    # Delete line 5'
    echo '  eed file.txt ",p\nq"                       # View entire file'
    echo '  eed file.txt "$(cat <<'\''EOF'\''            # Complex operations'
    echo '  3c'
    echo '  new content'
    echo '  .'
    echo '  w'
    echo '  q'
    echo '  EOF'
    echo '  )"'
}