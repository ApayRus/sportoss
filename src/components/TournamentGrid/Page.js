import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { CircularProgress } from "@material-ui/core";
import { categoryName } from "../../config/functions";
import CategoriesTable from "../table/Table";

const columns = [{ id: "name", numeric: false, disablePadding: false, label: "Категория" }];

export class Page extends Component {
  render() {
    const { tournament, allCategories } = this.props;
    //console.log("this.props.tournament", this.props.tournament);
    let categories = [];
    if (isLoaded(allCategories, tournament)) {
      categories = allCategories.filter(cat => tournament.categories.includes(cat.id));
      categories = categories.map(cat => ({ name: categoryName(cat) }));
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
    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId } = props.match.params;
    return [
      { collection: "tournaments", doc: tournamentId, storeAs: "tournament" },
      { collection: "categories", storeAs: "allCategories" }
    ];
  })
)(Page);

//return [{ collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] }];
