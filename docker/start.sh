#!/bin/bash

cd /theme && npm start &
cd /hugo && /usr/local/bin/hugo server --bind 0.0.0.0
