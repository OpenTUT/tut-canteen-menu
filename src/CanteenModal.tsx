import { Modal, Table } from 'react-bootstrap';
import styles from './CanteenModal.module.css';
import { MenuItem } from '../csv2json';

export function CanteenModal(props: {
  show: boolean;
  details: MenuItem;
  onHide: () => void;
}) {
  return (
    <Modal show={props.show} onHide={props.onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.details?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>栄養成分表</h5>
        <Table bordered className={styles.table}>
          <thead>
            <tr>
              {props.details?.nutrients.map((x) => (
                <th key={x[0]}>{x[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {props.details?.nutrients.map((x) => (
                <td key={x[0]}>{x[1]}</td>
              ))}
            </tr>
          </tbody>
        </Table>

        <h5>アレルギー</h5>
        <Table bordered className={styles.table}>
          <thead>
            <tr>
              {props.details?.allergens?.map((x) => (
                <th key={x[0]}>{x[0]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {props.details?.allergens?.map((x: any) => (
                <td key={x[0]}>{x[1] ? '●' : ''}</td>
              ))}
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
    </Modal>
  );
}
