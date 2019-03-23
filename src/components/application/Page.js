import React, { Component } from "react";
import { Fab, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Table from "../table/Table";
import Form from "../application/Form";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { tournamentName } from "../../config/functions";
//Table columns or fields of our data model
const columns = [{ id: "name", numeric: false, disablePadding: false, label: "Турнир" }];

export class Page extends Component {
  state = { isModalOpen: false, data: {}, selected: [] };

  openModal = id => {
    const defaultData = { tournament: "", participants: {} }; // if we create new entry
    const modalData = this.props.applications.find(el => el.id === id) || defaultData;
    console.log("modalData", modalData);
    this.setState({ modalData });
    this.setState({ isModalOpen: true });
  };

  handleSelect = selected => {
    this.setState({ selected }, () => {
      console.log("selected", selected);
    });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const { athlets, tournaments, applications, user } = this.props;
    // const { selected } = this.state;
    console.log("applications", applications);
    let data = [];
    if (isLoaded(tournaments, applications)) {
      data = applications.map(app => {
        const tournament = tournaments.filter(elem => elem.id === app.tournament)[0];
        console.log("tournament", tournament);
        //console.log("tournamentName(tournament)", tournamentName(tournament));
        if (tournament) return { ...app, name: tournamentName(tournament) };
        else return { ...app, name: "" };
      });
    }
    const {
      add: firestoreAdd,
      delete: firestoreDelete,
      update: firestoreUpdate
    } = this.props.firestore;

    return (
      <main>
        {isLoaded(athlets) ? (
          <div>
            <Table
              data={data}
              openModal={this.openModal}
              firestoreDelete={firestoreDelete}
              columns={columns}
              collection="applications"
              title="Заявки"
              handleSelect={this.handleSelect}
            />

            <Fab
              style={styles.fab}
              onClick={() => this.openModal(null)}
              color="primary"
              aria-label="Add"
            >
              <AddIcon />
            </Fab>
            {this.state.isModalOpen && (
              <Form
                isModalOpen={this.state.isModalOpen}
                data={this.state.modalData}
                closeModal={this.closeModal}
                firestoreAdd={firestoreAdd}
                firestoreUpdate={firestoreUpdate}
                user={user}
              />
            )}
          </div>
        ) : (
          <CircularProgress />
        )}
      </main>
    );
  }
}

const mapStateToProps = state => {
  const userId = state.firebase.auth.uid;
  const userName = state.firebase.profile.username;

  return {
    athlets: state.firestore.ordered.athlets,
    applications: state.firestore.ordered.applications,
    categories: state.firestore.ordered.categories,
    tournaments: state.firestore.ordered.tournaments,

    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    console.log("firestoreConnect props", props);
    if (props.user.userId)
      return [
        { collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] },
        { collection: "applications", where: [["createdBy.userId", "==", props.user.userId]] },
        { collection: "categories" },
        { collection: "tournaments" }
      ];
    else return [];
  })
)(Page);

const styles = {
  fab: {
    margin: 0,
    top: "auto",
    right: 5,
    bottom: 5,
    left: "auto",
    position: "fixed"
  },
  athletsContainer: {
    position: "relative"
  }
};
