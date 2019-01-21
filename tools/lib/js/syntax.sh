#!/bin/sh

# Operator
OP_RE='(\+|\-|\*|\/)'

# Base Value
VAL_RE='[0-9]+|".*"'
VAL_RE="(${VAL_RE}|'.*')"

# Base Variable
VAR_RE='[a-zA-Z_$][0-9a-zA-Z_$]*'
# Add Member Variable
VAR_RE="(${VAR_RE}|(${VAR_RE}\\.)+${VAR_RE})"

# Simple Expression
EXPR_RE="${VAL_RE}|${VAR_RE}"
# Expression with Operator
EXPR_RE="(${EXPR_RE}|(${EXPR_RE} *${OP_RE} *)+${EXPR_RE})"

# Function Arguments
ARGS_RE="(\\(${EXPR_RE}\\)|\\((${EXPR_RE} *, *)+${EXPR_RE}\\))"

# Line Comment
LINE_COMME="^ *\/\/.+$"

# About Block
BLK_BEG_RE='\{'
BLK_END_RE='\}'

# Function Call
FN_CALL_RE="(${VAR_RE} *${ARGS_RE};?)"

# Arrow Function
LAMBDA_RE="((${ARGS_RE}|${VAR_RE}) *=> * (${EXPR_RE}|${BLK_BEG_RE}))"
