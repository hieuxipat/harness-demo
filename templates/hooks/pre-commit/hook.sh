#!/bin/bash
set -e

echo "Running pre-commit checks..."
{{lint_command}}
echo "Pre-commit checks passed."
