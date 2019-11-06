import React, { Component } from 'react';
import axios from 'axios';
import DashboardCard from './DashboardCard';
import './Transactions.scss';

export default class Transactions extends Component {
  state = {
    transactionsArr: [],
    dataToTrack: [],
    frequencyToTrack: '',
    categoriesArr: [],
    rulesArr: [],
    filterWord: null
  };

  componentDidMount() {
    axios.get('/api/get_rules').then(results => {
      this.setState({
        rulesArr: results.data[0].category.weekly
      });
    });

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

  handleAddCard = () => {
    console.log('ADDCARD');
    this.setState({
      rulesArr: [...this.state.rulesArr, null]
    });
  };

  handleSetCategory = words => {
    axios.post('/api/update_rules', { userRules: words }).then(response => {
      this.setState({
        rulesArr: response.data[0].category.weekly
      });
    });
  };

  handleFilterWordChange = word => {
    this.setState({
      filterWord: word
    });
  };

  render() {
    const { transactionsArr, rulesArr, filterWord } = this.state;
    console.log('filterword', filterWord);

    const filterFunc = data => {
      console.log(data.category);
      if (filterWord === null) {
        return true;
      }
      return data.category.includes(filterWord);
    };

    const filteredTransactions = transactionsArr.filter(filterFunc);

    console.log('FilteredTransactions', filteredTransactions);

    const renderTransactions = filteredTransactions.map((e, i) => (
      <div className="transaction-container" key={i}>
        {/* {console.log(e, i)} */}
        <div className="transaction-date">{e.date} </div>
        <div className="transaction-name"> {e.name} </div>
        <div className="category-container">
          {e.category.map((cat, ind) => {
            return (
              <div
                key={ind}
                onClick={() => this.handleSetCategory(cat)}
                className="category-box"
              >
                {cat}
              </div>
            );
          })}
        </div>
        <div className="transaction-amount">
          $
          {e.amount.toLocaleString(undefined, {
            minimumFractionDigits: 2
          })}
        </div>
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
        e.category.forEach(x => {
          if (x.includes(category)) {
            countArr.push(e.amount);
          }
        });
      });
      return countArr.reduce(getSum, 0);
    };

    const renderRules = rulesArr.map((x, index) => {
      if (x === null) {
        return (
          <DashboardCard
            key={index}
            headline={`What category would you like to track? `}
            isNull={true}
            setCategory={this.handleSetCategory}
          />
        );
      }
      return (
        <DashboardCard
          handleClick={this.handleFilterWordChange}
          name={x}
          key={index}
          headline={`Total spent this week on ${x}`}
          cardNumber={`$${categoryArr(x).toLocaleString(undefined, {
            minimumFractionDigits: 2
          })}`}
        />
      );
    });

    return (
      <div className="transaction-page">
        <div className="transaction-top-container">
          <DashboardCard
            handleClick={this.handleFilterWordChange}
            name={null}
            headline={'Amount spent this week'}
            cardNumber={`$${amountSpent.toLocaleString(undefined, {
              minimumFractionDigits: 2
            })}`}
          />
          {renderRules}
          <DashboardCard isAddCategory={true} addCard={this.handleAddCard} />
        </div>

        <div className="transaction-window">
          <div className="transaction-container headline">
            <div className="transaction-date">Date</div>
            <div className="transaction-name"> Name</div>
            <div className="transaction-category"> Categories</div>
            <div className="transaction-amount">Amount</div>
          </div>

          {renderTransactions}
        </div>
      </div>
    );
  }
}
