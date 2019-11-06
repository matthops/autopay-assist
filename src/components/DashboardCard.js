import React from 'react';
import './DashboardCard.scss';

export default function DashboardCard(props) {
  return (
    <div
      className="dashboard-card-container"
      onClick={() => props.handleClick(props.name)}
    >
      {props.isAddCategory ? (
        <div className="add-sign" onClick={props.addCard}>
          +
        </div>
      ) : props.isNull ? (
        <div>
          <div className="dashboard-card-headline">{props.headline}</div>
          <input />{' '}
          <button onClick={() => props.setCategory('words')}>
            set category
          </button>
        </div>
      ) : (
        <div>
          <div className="dashboard-card-headline">{props.headline}</div>
          <div className="dashboard-card-num">{props.cardNumber}</div>
        </div>
      )}
    </div>
  );
}
