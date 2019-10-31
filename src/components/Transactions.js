import React, { Component } from 'react';
// import PlaidLink from 'react-plaid-link';
import axios from 'axios';
import DashboardCard from './DashboardCard';
import TopThreeCategories from './TopThreeCategories';
import './Transactions.scss';

export default class Transactions extends Component {
  state = {
    transactionsArr: [],
    dataToTrack: [],
    frequencyToTrack: '',
    categoriesArr: []
  };

  componentDidMount() {
    axios.get('/plaid/get_item_info').then(results => {
      let catArr = [];
      results.data.transactions.forEach(transact => {
        catArr.push(transact.category);
      });
      this.setState({
        transactionsArr: results.data.transactions,
        categoriesArr: catArr
      });
    });

    // axios.get('/plaid/get_categories').then(results => {
    //   this.setState({
    //     categoriesArr: [...this.state.categoriesArr]
    //   });
    //   console.log('Categories', results.data);
    // });
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
    const { transactionsArr } = this.state;
    console.log(transactionsArr);

    const renderTransactions = transactionsArr.map((e, i) => (
      <div className="transaction-container" key={i}>
        <div className="transaction-date">{e.date} </div>
        <div className="transaction-name"> {e.name} </div>
        <div className="transaction-amount"> ${e.amount.toLocaleString()}</div>
      </div>
    ));

    const getSum = (total, num) => {
      return total + num;
    };
    const amountsArr = [];
    transactionsArr.forEach(e => amountsArr.push(e.amount));
    const amountSpent = amountsArr.reduce(getSum, 0);

    const categoryArr = category => {
      let countArr = [];
      transactionsArr.forEach(e => {
        e.category.forEach(x =>
          x.includes(category) ? countArr.push(e.amount) : null
        );
      });

      return countArr.reduce(getSum, 0);
    };

    return (
      <div className="transaction-page">
        {/* <PlaidLink
          clientName="Autopay Assist"
          env="development"
          product={['transactions']}
          publicKey="7e7ec821e167a738d081d1cd035c5c"
          // publicKey={process.env.REACT_APP_PLAID_PUBLIC_KEY}
          onExit={this.handleOnExit}
          onSuccess={this.handleOnSuccess}
        >
          Open Link and connect your bank!
        </PlaidLink> */}

        {/* <div>
          Choose to display:
          <select name="data">
            <option value="option1"> Total Amount </option>
            <option value="option2"> Total Transactions </option>
            <option value="option3"> Total Spent on Food</option>
          </select>
        </div> */}
        {/* <h1> This Week</h1> */}
        <TopThreeCategories categoryArr={this.state.categoriesArr} />
        <div className="transaction-top-container">
          <DashboardCard
            headline={'Amount spent this week'}
            cardNumber={`$${amountSpent.toLocaleString()}`}
          />
          <DashboardCard
            headline="Spent on food"
            cardNumber={`$${categoryArr('Food')}`}
          />
          <DashboardCard
            headline="Number of Transactions"
            cardNumber={transactionsArr.length}
          />
          {/* <DashboardCard
            headline="Spent in Restaurants"
            cardNumber={`$${categoryArr('Restaurants').toLocaleString()}`}
          /> */}
        </div>

        <div className="transaction-window">
          <div className="transaction-container headline">
            <div className="transaction-date">Date</div>
            <div className="transaction-name"> Name</div>
            <div className="transaction-amount">Amount</div>
          </div>

          {renderTransactions}
        </div>
      </div>
    );
  }
}
