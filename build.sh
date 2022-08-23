#!/bin/sh
ls
ls ./src/assets
python3 ./csv2json.py && npm run build
