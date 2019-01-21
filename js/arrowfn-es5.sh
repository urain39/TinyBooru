#!/bin/sh

. ../tools/lib/js/syntax.sh

sed -En "s/${LAMBDA_RE}/function \2 \\{/g;p" ijktpl.js
