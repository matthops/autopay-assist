import React, { Component } from "react";
import axios from "axios";

export default class Main extends Component {
  constructor(props) {
    super(props);
  }
  logout() {
    // axios GET to /auth/logout here
    console.log(this.props);
    axios
      .get("/auth/logout")
      .then(() => {
        this.props.updateUser({});
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    const { user } = this.props;
    console.log(this.props);
    return (
      <div>
        {user.username ? (
          <div className="welcomeMessage">
            <p>{user.username}, welcome to Autopay Assist</p>
            <button type="submit" onClick={this.logout}>
              Logout
            </button>
          </div>
        ) : (
          <h1> Main Component, yo</h1>
        )}
      </div>
    );
  }
}
