import React, { Component } from 'react';
import PlaidLink from 'react-plaid-link';
import axios from 'axios';
import Transactions from '../Transactions';

export default class Container extends Component {
  componendDidMount() {
    axios.get('/api/transactions').then(results => console.log(results));
  }

  handleOnExit = () => {
    console.log('exit');
  };

  handleOnSuccess = (public_token, metadata) => {
    axios.post('/plaid/get_access_token', {
      public_token: public_token,
      user_id: this.props.user.id
    });
    console.log('success', this.props);
  };

  render() {
    const { user } = this.props;
    return (
      <div>
        {user.username ? (
          // <div>
          //   <PlaidLink
          //     clientName="Autopay Assist"
          //     env="sandbox"
          //     product={['transactions']}
          //     // publicKey="7e7ec821e167a738d081d1cd035c5c"
          //     publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
          //     onExit={this.handleOnExit}
          //     onSuccess={this.handleOnSuccess}
          //   >
          //     Open Link and connect your bank!
          //   </PlaidLink>
          // </div>
          <Transactions {...this.props} />
        ) : (
          <div> please log in</div>
        )}
      </div>
    );
  }
}
