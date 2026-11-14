#!/usr/bin/env bash

#
# Build
#
# Installs dependencies, minifies the assets, and restores ownership

set -euo pipefail

# the project root
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/html"

# detect the owner from the project root before we touch anything
OWNER="$(stat -c '%u:%g' "${ROOT}")"

cd "${ROOT}"

# allow composer to run as root
export COMPOSER_ALLOW_SUPERUSER=1

# install the dependencies
composer install --no-interaction --optimize-autoloader

# minify the css and js
composer minify

# hand ownership back to the detected owner
chown -R "${OWNER}" "${ROOT}"
find ${ROOT} -type d -exec chmod 755 {} \;
find ${ROOT} -type f -exec chmod 644 {} \;
chmod +x build.sh

echo "Build complete"