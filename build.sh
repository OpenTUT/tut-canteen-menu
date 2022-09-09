#!/bin/sh
ls -al csv
python3 ./csv2json.py && npm run build
