import React, { Component } from "react";
import "./App.css";
import Header from "./components/header/Header";
import Container from "./components/container/Container";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: {}
    };
    this.updateUser = this.updateUser.bind(this);
  }

  componentDidMount() {
    axios
      .get("/auth/me")
      .then(user => {
        this.setState({
          user: user.data
        });
      })
      .then(console.log("hit", this.state.user));
  }

  updateUser(user) {
    this.setState({
      user
    });
  }

  render() {
    const { user } = this.state;
    console.log("render", user);
    return (
      <div className="App">
        <Header user={user} updateUser={this.updateUser} />
        <Container user={user} />
      </div>
    );
  }
}

export default App;
