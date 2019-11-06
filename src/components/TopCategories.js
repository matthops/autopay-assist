import React, { Component } from 'react';

export default class TopCategories extends Component {
  render() {
    const dataArr = this.props.categoryArr;
    let newArr = [];

    dataArr.forEach(arr => {
      arr.forEach(category => {
        newArr.push(category);
      });
    });
    let counts = {};
    let compare = 0;
    let topCatArr = [];
    let mostFrequent;

    const hashFunc = arr => {
      if (topCatArr.length >= 6) {
        return topCatArr;
      }

      if (topCatArr.length < 6) {
        for (var i = 0, len = arr.length; i < len; i++) {
          let word = arr[i];
          if (counts[word] === undefined) {
            counts[word] = 1;
          } else {
            counts[word] = counts[word] + 1;
          }
          if (counts[word] > compare) {
            compare = counts[word];
            mostFrequent = arr[i];
          }
        }
        topCatArr.push(mostFrequent);

        const filterFrequent = element => {
          compare = 0;
          return element !== mostFrequent;
        };
        let recursiveArr = arr.filter(filterFrequent);
        return hashFunc(recursiveArr);
      }
    };

    const topThreeCategories = hashFunc(newArr);

    return (
      <div>
        {topThreeCategories.map((e, i) => {
          return <div key={i}>{e}</div>;
        })}
      </div>
    );
  }
}
