#!/bin/bash
set -e -o pipefail
export PATH=$PATH:/usr/local/go/bin

echo "Starting services..."
cd /theme
yarn install
npm start &

# If the path to ocw-to-hugo is not set, use local content
# Otherwise, download course content and use that instead
if [[ -z "${OCW_TO_HUGO_PATH}" ]]; then
  cd /theme
  npm start &
  cd /theme/docker/hugo
  /usr/local/bin/hugo server --bind 0.0.0.0
else
  cd /ocw-to-hugo
  yarn install
  rm -rf /ocw-data/*
  mkdir /ocw-data/input /ocw-data/output
  echo "{\"courses\":[\"${OCW_TEST_COURSE}\"]}" | tee /ocw-data/courses.json
  cd /ocw-to-hugo
  node . -i ${OCW_TO_HUGO_INPUT:-/ocw-data/input} \
    -o /ocw-data/output -c /ocw-data/courses.json --download ${OCW_TO_HUGO_DOWNLOAD:-true}
  rm -rf /ocw-to-hugo-output/*
  cp /theme/docker/hugo/go.mod /ocw-to-hugo-output/go.mod
  cp /theme/docker/hugo/config.toml /ocw-to-hugo-output/config.toml
  cp -R /ocw-data/output/${OCW_TEST_COURSE}/* /ocw-to-hugo-output/

  cd /ocw-to-hugo-output
  /usr/local/bin/hugo server --bind 0.0.0.0
fi
