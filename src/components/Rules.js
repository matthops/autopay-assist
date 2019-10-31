import React, { Component } from 'react';
import './Rules.scss';
import axios from 'axios';

export default class Rules extends Component {
  state = {
    rulesArr: []
  };

  componentDidMount() {
    axios.get('/api/get_rules').then(results => {
      this.setState({
        rulesArr: results.data
      });
    });
  }

  render() {
    const renderRules = this.state.rulesArr.map((e, i) => {
      return (
        <div className="rules-container__inner" key={i}>
          Total spent on {e.category} {e.frequency}
        </div>
      );
    });

    return (
      <div className="rules-container">
        <div className="rules-container__headline big"> My Rules </div>

        {renderRules}
      </div>
    );
  }
}
