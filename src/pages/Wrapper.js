import React, { Component } from "react";
import { firebaseAuth } from "../helpers/firebase";
import Loading from "../components/Loading";
export default WrapperComponent => {
  return class Me extends Component {
    state = {
      loading: true
    };

    componentDidMount() {
      firebaseAuth().onAuthStateChanged(user => {
        this.setState({ loading: false });
      });
    }

    render() {
      if (this.state.loading) return <Loading />;
      return <WrapperComponent />;
    }
  };
};
