import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { CircularProgress } from "@material-ui/core";
import groupBy from "lodash/groupBy";
import CategoriesTable from "../table/Table";
import { athletName, categoryName, trainerName, tournamentName } from "../../config/functions";

const columns = [
  { id: "name", numeric: false, disablePadding: false, label: "Категория" },
  { id: "participantsCount", numeric: false, disablePadding: false, label: "Участников" }
];

/**
 * Returns count of participans of each category
 */
function participantsGroupedByCategories(applications) {
  let participants = {};
  applications.forEach(app => {
    participants = { ...participants, ...app.participants };
  });
  return groupBy(participants, "categoryId");
}

export class Page extends Component {
  render() {
    const { tournament, category, applications } = this.props;
    const { tournamentId, categoryId } = this.props.match.params;
    let participants = [];
    if (isLoaded(applications, category)) {
      participants = participantsGroupedByCategories(applications)[categoryId];
      console.log("participants", participants);
    }

    return (
      <div>
        {isLoaded(tournament, category) ? (
          <div>
            <h1>Форма категории</h1>
            <h2>{categoryName(category)}</h2>
            <h3>{tournamentName(tournament)}</h3>
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
    category: state.firestore.data.category,
    applications: state.firestore.ordered.applications,
    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId, categoryId } = props.match.params;
    return [
      { collection: "tournaments", doc: tournamentId, storeAs: "tournament" },
      { collection: "categories", doc: categoryId, storeAs: "category" },
      { collection: "applications", where: [["tournamentId", "==", tournamentId]] }
    ];
  })
)(Page);

//return [{ collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] }];
