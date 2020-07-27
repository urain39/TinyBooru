cat > offline.appcache <<EOF
CACHE MANIFEST
# `date +"%Y-%m-%d %H:%M"`

CACHE:
index.html
favicon.ico
`find js/ -type f`
`find css/ -type f`
`find fonts/ -type f`
EOF
