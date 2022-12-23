import glob
import csv
import json
from typing import Iterable


def parse_csv(f: Iterable[str]):
    [header, *records] = csv.reader(f)
    for record in records:
        yield dict(map(lambda x: [x[1], record[x[0]]], enumerate(header)))


out = {}

for path in glob.glob("./csv/*.csv"):
    with open(path, "r", encoding="utf-8") as f:
        for record in parse_csv(f):
            if record["提供日"] not in out:
                out[record["提供日"]] = {}
            tmp = out[record["提供日"]]

            if record["営業区分"] not in tmp:
                tmp[record["営業区分"]] = {}
            tmp = tmp[record["営業区分"]]

            tmp[record["提供商品"]] = {
                "name": record["献立表料理名"],
                "nutrients": list(
                    map(
                        lambda x: [x, record[x]],
                        ["エネルギー(kcal)", "たんぱく質(g)", "脂質(g)", "炭水化物(g)", "食塩相当量(g)"],
                    )
                ),
                "allergens": list(
                    map(
                        lambda x: [x, record[x] == "○"],
                        ["えび", "かに", "小麦", "そば", "卵", "乳", "落花生"],
                    )
                ),
            }

with open("./src/assets/menu.json", "w", encoding="utf-8") as f:
    json.dump(out, f, separators=(",", ":"), ensure_ascii=False)
