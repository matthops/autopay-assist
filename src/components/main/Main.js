import React, { Component } from 'react';
import axios from 'axios';
import PlaidLink from 'react-plaid-link';

import './Main.scss';
import Transactions from '../Transactions';

export default class Main extends Component {
  state = {
    transactionLength: null
  };
  componentDidMount() {
    // axios.get('/plaid/get_item_info').then(results => {
    //   let catArr = [];
    //   results.data.transactions.forEach(transact => {
    //     catArr.push(transact.category);
    //   });
    //   this.setState({
    //     transactionsArr: results.data.transactions,
    //     categoriesArr: catArr
    //   });
    // });
    axios.get('/plaid/get_item_info').then(results => {
      this.setState({
        transactionLength: results.data.transactions.length
      });
    });
  }

  handleOnSuccess = (public_token, metadata) => {
    console.log('publictoken', public_token);
    axios.post('/plaid/get_access_token', {
      public_token: public_token,
      user_id: this.props.user.id
    });

    console.log('success', this.props);
  };

  handleOnExit = () => {
    console.log('exit');
  };

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
        {this.state.transactionLength > 0 ? (
          <Transactions {...this.props} />
        ) : (
          <PlaidLink
            clientName="Autopay Assist"
            env="sandbox"
            product={['transactions']}
            publicKey="7e7ec821e167a738d081d1cd035c5c"
            onExit={this.handleOnExit}
            onSuccess={this.handleOnSuccess}
          >
            Open Link and connect your bank!
          </PlaidLink>
        )}
      </div>
    );
  }
}
