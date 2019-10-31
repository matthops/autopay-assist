import React, { Component } from 'react';
import axios from 'axios';
import './Main.scss';
import Transactions from '../Transactions';
import Rules from '../Rules';

export default class Main extends Component {
  render() {
    const { user } = this.props;
    console.log('PROPSPROPSPROPS', user);
    return (
      <div>
        <header className="header-container">
          <div className="main-title">MoneyAware</div>
          <button
            className="logout-button"
            type="submit"
            onClick={() => this.props.updateUser({})}
          >
            Logout
          </button>
        </header>
        {/* <Rules /> */}
        <Transactions {...this.props} />
      </div>
    );
  }
}
