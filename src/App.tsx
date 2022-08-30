import { useState } from 'react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import 'dayjs/locale/ja';

import { Container } from 'react-bootstrap';
import { CanteenModal } from './CanteenModal';
import { MenuItem, Menu } from './types';

import menuJson from './assets/menu.json';
import styles from './App.module.css';

dayjs.extend(customParseFormat);
dayjs.extend(isSameOrAfter);

export function App() {
  const now = dayjs();

  const menu = menuJson as unknown as Menu;
  const dates = Object.keys(menu)
    .filter((x) => dayjs(x, 'YYYY/M/D', 'ja').isSameOrAfter(now))
    .map((x) => ({ key: x, value: dayjs(x, 'YYYY/M/D', 'ja') }))
    .sort((a, b) => (a.value.isAfter(b.value) ? 1 : -1))
    .slice(0, 7);

  const [date, setDate] = useState(dates[0]?.key);

  const [modalShow, setModalShow] = useState(false);
  const [modalDetails, setModalDetails] = useState<MenuItem | null>(null);
  const openModal = (details: MenuItem) => {
    setModalDetails(details);
    setModalShow(true);
  };

  return (
    <Container className={styles.container}>
      {location.pathname !== '/inapp' ? (
        <h1>
          豊橋技術科学大学
          <br />
          食堂メニュー
        </h1>
      ) : (
        <></>
      )}

      <select className={`form-select ${styles.dropdown}`} value={date} onChange={(e) => setDate(e.target.value)}>
        {dates.map((x) => (
          <option value={x.key} key={x.key}>
            {x.value.format('YYYY年M月D日 (dd)')}
          </option>
        ))}
      </select>

      <main className={styles.menu}>
        <section className={styles.morning}>
          <h2>朝食</h2>
          <div className={styles.body}>
            {Object.entries(menu[date]?.['朝食'] ?? {})
              .sort()
              .map((x) => (
                <div className={styles.list} key={x[0]} onClick={() => openModal(x[1])}>
                  <div className={styles.left}>{x[0]}</div>
                  <div>{x[1].name}</div>
                </div>
              ))}
          </div>
        </section>

        <section className={styles.lunch}>
          <h2>昼食</h2>
          <div className={styles.body}>
            {Object.entries(menu[date]?.['昼食'] ?? {})
              .sort()
              .map((x) => (
                <div className={styles.list} key={x[0]} onClick={() => openModal(x[1])}>
                  <div className={styles.left}>{x[0]}</div>
                  <div>{x[1].name}</div>
                </div>
              ))}
          </div>
        </section>

        <section className={styles.dinner}>
          <h2>夕食</h2>
          <div className={styles.body}>
            {Object.entries(menu[date]?.['夕食'] ?? {})
              .sort()
              .map((x) => (
                <div className={styles.list} key={x[0]} onClick={() => openModal(x[1])}>
                  <div className={styles.left}>{x[0]}</div>
                  <div>{x[1].name}</div>
                </div>
              ))}
          </div>
        </section>
      </main>

      {modalDetails ? (
        <CanteenModal show={modalShow} details={modalDetails} onHide={() => setModalShow(false)}></CanteenModal>
      ) : (
        <></>
      )}
    </Container>
  );
}
