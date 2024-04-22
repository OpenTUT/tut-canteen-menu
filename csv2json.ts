import { parse } from 'csv-parse';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { glob } from 'glob';
import fs from 'node:fs';

export interface Menu {
  date: string;
  morning: MenuItem[];
  lunch: MenuItem[];
  dinner: MenuItem[];
}

export interface MenuItem {
  category: string;
  name: string;
  nutrients: [string, string][];
  allergens: [string, boolean][];
}

dayjs.extend(customParseFormat);

const menus = new Map<string, Menu>();

for (const path of await glob('./csv/*.csv')) {
  const parser = fs
    .createReadStream(path, { encoding: 'utf8' })
    .pipe(parse({ columns: true }));
  for await (const record of parser) {
    const date = dayjs(record['提供日'], 'YYYY/M/D').format('YYYY-MM-DD');
    const time = {
      朝食: 'morning',
      昼食: 'lunch',
      夕食: 'dinner',
    }[record['営業区分'] as string] as 'morning' | 'lunch' | 'dinner';

    const menu =
      menus.get(date) ??
      (() => {
        const menu: Menu = {
          date,
          morning: [],
          lunch: [],
          dinner: [],
        };
        menus.set(date, menu);
        return menu;
      })();

    menu[time].push({
      category: record['提供商品'],
      name: record['献立表料理名'],
      nutrients: [
        'エネルギー(kcal)',
        'たんぱく質(g)',
        '脂質(g)',
        '炭水化物(g)',
        '食塩相当量(g)',
      ].map((x) => [x, record[x]]),
      allergens: ['えび', 'かに', '小麦', 'そば', '卵', '乳', '落花生'].map(
        (x) => [x, record[x] === '○']
      ),
    });
  }
}

const output: Menu[] = [...menus.values()].sort().map((x) => ({
  date: x.date,
  morning: x.morning.sort((a, b) => a.category.localeCompare(b.category, 'ja')),
  lunch: x.lunch.sort((a, b) => a.category.localeCompare(b.category, 'ja')),
  dinner: x.dinner.sort((a, b) => a.category.localeCompare(b.category, 'ja')),
}));

await fs.promises.mkdir('./public', { recursive: true });
await fs.promises.writeFile('./public/menus.json', JSON.stringify(output));
