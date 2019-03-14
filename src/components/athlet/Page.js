import React, { Component } from "react";
import { Fab, CircularProgress, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Table from "../table/Table";
import Form from "./Form";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import Application from "../application/Form";
//Table columns or fields of our data model
const columnsAthlets = [
  { id: "name", numeric: false, disablePadding: false, label: "ФИО" },
  { id: "birthday", numeric: false, disablePadding: false, label: "Родился" },
  { id: "gender", numeric: false, disablePadding: false, label: "Пол" }
];

export class Page extends Component {
  state = { isModalOpen: false, data: {}, selected: [] };

  openModal = id => {
    const defaultData = { name: "", birthday: "", gender: "" }; // if we create new entry
    const modalData = this.props.athlets.find(el => el.id === id) || defaultData;
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
    const { athlets, user } = this.props;
    const { selected } = this.state;
    let data = [];
    if (isLoaded(athlets)) {
      data = athlets.map(athlet => {
        return { ...athlet, name: `${athlet.familyName} ${athlet.firstName} ${athlet.fatherName}` };
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
          <Grid container spacing={32}>
            <Grid item sm={5}>
              <div style={styles.athletsContainer}>
                <Table
                  data={data}
                  openModal={this.openModal}
                  firestoreDelete={firestoreDelete}
                  columns={columnsAthlets}
                  collection="athlets"
                  title="Спортсмены"
                  handleSelect={this.handleSelect}
                />

                <Fab
                  style={styles.fab}
                  onClick={() => this.openModal(null)}
                  color="primary"
                  aria-label="Add"
                  size="small"
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
            </Grid>
            <Grid item sm={5}>
              <Application selected={selected} athlets={athlets} user={user} />
            </Grid>
          </Grid>
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
    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "athlets" }, { collection: "applications" }])
)(Page);

const styles = {
  fab: {
    margin: 0,
    top: "auto",
    right: 5,
    bottom: 5,
    left: "auto",
    position: "absolute"
  },
  athletsContainer: {
    position: "relative"
  }
};
