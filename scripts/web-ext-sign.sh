#!/bin/sh

# We need the secrets in `.secret.sign-keys.txt`
# Find the keys in:
# https://addons.mozilla.org/en-US/developers/addon/api/key/

if [[ -z ${FIREFOX_API_USER+x} ]] || [[ -z ${FIREFOX_API_SECRET+x} ]];
then
    echo "Missing secrets: \$FIREFOX_API_USER and \$FIREFOX_API_SECRET must be set"
    exit 1
fi

npx web-ext sign --api-key $FIREFOX_API_USER --api-secret $FIREFOX_API_SECRET -s dist/firefox
