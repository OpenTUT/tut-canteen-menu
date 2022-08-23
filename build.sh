#!/bin/sh
echo $PWD
python3 ./csv2json.py && npm run build
