import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { CircularProgress } from "@material-ui/core";

export class Page extends Component {
  render() {
    const { tournament } = this.props;
    console.log("this.props.tournament", this.props.tournament);
    return (
      <div>
        {isLoaded(tournament) ? (
          <div>
            <h1>{`${tournament.name}, ${tournament.address}, ${tournament.date}`}</h1>
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const userId = state.firebase.auth.uid;
  const userName = state.firebase.profile.username;

  return {
    tournament: state.firestore.data.tournament,
    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId } = props.match.params;
    return [{ collection: "tournaments", doc: tournamentId, storeAs: "tournament" }];
  })
)(Page);
