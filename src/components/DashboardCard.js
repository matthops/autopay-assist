import React from 'react';
import './DashboardCard.scss';

export default function DashboardCard(props) {
  return (
    <div className="dashboard-card-container">
      <div className="dashboard-card-headline"> {props.headline}</div>
      <div className="dashboard-card-num">{props.cardNumber}</div>
    </div>
  );
}
