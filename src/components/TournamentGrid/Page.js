import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { CircularProgress } from "@material-ui/core";
import { categoryName } from "../../config/functions";
import groupBy from "lodash/groupBy";
import CategoriesTable from "../table/Table";

const columns = [
  { id: "name", numeric: false, disablePadding: false, label: "Категория" },
  { id: "participantsCount", numeric: false, disablePadding: false, label: "Участников" }
];

/**
 * Returns count of participans of each category
 */
function countCategories(applications) {
  let participants = {};
  applications.forEach(app => {
    participants = { ...participants, ...app.participants };
  });
  console.log("participants", participants);
  return groupBy(participants, "categoryId");
}

export class Page extends Component {
  render() {
    const { tournament, allCategories, applications } = this.props;
    let categories = [];
    if (isLoaded(allCategories, tournament, applications)) {
      categories = allCategories.filter(cat => tournament.categories.includes(cat.id));
      const countedCategories = countCategories(applications);
      console.log("countedCategories", countedCategories);

      categories = categories.map(cat => {
        let participantsCount = 0;
        if (countedCategories[cat.id]) participantsCount = countedCategories[cat.id].length;
        return { id: cat.id, name: categoryName(cat), participantsCount };
      });
    }
    return (
      <div>
        {isLoaded(tournament) ? (
          <div>
            <h1>{`${tournament.name}, ${tournament.address}, ${tournament.date}`}</h1>
            <CategoriesTable
              data={categories}
              columns={columns}
              collection="categories"
              title="Категории"
              disableRowClick
              hideToolbar
              hideCheckboxes
            />
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
    allCategories: state.firestore.ordered.allCategories,
    applications: state.firestore.ordered.applications,
    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId } = props.match.params;
    return [
      { collection: "tournaments", doc: tournamentId, storeAs: "tournament" },
      { collection: "categories", storeAs: "allCategories" },
      { collection: "applications", where: [["tournamentId", "==", tournamentId]] }
    ];
  })
)(Page);

//return [{ collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] }];
