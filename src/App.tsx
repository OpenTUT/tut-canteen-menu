import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/ja';
import { Container } from 'react-bootstrap';
import { CanteenModal } from './CanteenModal';
import type { Menu } from '../csv2json';

import styles from './App.module.css';
import React from 'react';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

export function App() {
  const [menus, setMenus] = useState<Menu[]>();
  const [dates, setDates] = useState<dayjs.Dayjs[]>([]);
  const [date, setDate] = useState(0);
  const [modalShow, setModalShow] = useState('');

  const now = dayjs().startOf('date');

  useEffect(() => {
    fetch('/menus.json')
      .then((res) => res.json())
      .then((res) => {
        setMenus(res);
      });
  }, []);

  useEffect(() => {
    if (!menus) {
      return;
    }
    const dates = menus
      .map((x) => dayjs(x.date, 'YYYY-MM-DD', 'ja'))
      .filter((x) => x.isSameOrAfter(now))
      .slice(0, 7);
    setDates(dates);
  }, [menus]);

  return menus ? (
    <Container className={styles.container}>
      {location.pathname !== '/inapp' ? (
        <h1>
          豊橋技術科学大学
          <br />
          食堂メニュー
        </h1>
      ) : (
        <style>
          {`html, body {
            background-color: transparent !important;
          }`}
        </style>
      )}

      <select
        className={`form-select ${styles.dropdown}`}
        value={date}
        onChange={(e) => setDate(parseInt(e.target.value))}
      >
        {dates.map((x, i) => (
          <option value={i} key={i}>
            {x.format('YYYY年M月D日 (dd)')}
          </option>
        ))}
      </select>

      <main className={styles.menu}>
        <section className={styles.morning}>
          <h2>朝食</h2>
          <div className={styles.body}>
            {menus[date].morning.map((x, i) => (
              <React.Fragment key={i}>
                <div
                  className={styles.list}
                  onClick={() => setModalShow(`morning${i}`)}
                >
                  <div className={styles.left}>{x.category}</div>
                  <div>{x.name}</div>
                </div>
                <CanteenModal
                  show={modalShow === `morning${i}`}
                  details={x}
                  onHide={() => setModalShow('')}
                ></CanteenModal>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className={styles.lunch}>
          <h2>昼食</h2>
          <div className={styles.body}>
            {menus[date].lunch.map((x, i) => (
              <React.Fragment key={i}>
                <div
                  className={styles.list}
                  onClick={() => setModalShow(`lunch${i}`)}
                >
                  <div className={styles.left}>{x.category}</div>
                  <div>{x.name}</div>
                </div>
                <CanteenModal
                  show={modalShow === `lunch${i}`}
                  details={x}
                  onHide={() => setModalShow('')}
                ></CanteenModal>
              </React.Fragment>
            ))}
          </div>
        </section>

        <section className={styles.dinner}>
          <h2>夕食</h2>
          <div className={styles.body}>
            {menus[date].dinner.map((x, i) => (
              <React.Fragment key={i}>
                <div
                  className={styles.list}
                  onClick={() => setModalShow(`dinner${i}`)}
                >
                  <div className={styles.left}>{x.category}</div>
                  <div>{x.name}</div>
                </div>
                <CanteenModal
                  show={modalShow === `dinner${i}`}
                  details={x}
                  onHide={() => setModalShow('')}
                ></CanteenModal>
              </React.Fragment>
            ))}
          </div>
        </section>
      </main>
    </Container>
  ) : null;
}
