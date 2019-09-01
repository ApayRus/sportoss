//copy paste-ted from '/trainer'
import React, { Component } from "react";
import { Fab, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Table from "../table/Table";
import Form from "./Form";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
// import Application from "./ApplicationQuickForm";
//Table columns or fields of our data model
const columnsTrainers = [{ id: "name", numeric: false, disablePadding: false, label: "ФИО" }];

export class Page extends Component {
  state = { isModalOpen: false, data: {}, selected: [] };

  openModal = id => {
    const defaultData = { name: "" }; // if we create new entry
    const modalData = this.props.trainers.find(el => el.id === id) || defaultData;
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
    const { trainers, user } = this.props;
    // const { selected } = this.state;
    let data = [];
    if (isLoaded(trainers)) {
      data = trainers.map(trainer => {
        return {
          ...trainer,
          name: `${trainer.familyName} ${trainer.firstName} ${trainer.fatherName}`
        };
      });
    }
    const {
      add: firestoreAdd,
      delete: firestoreDelete,
      update: firestoreUpdate
    } = this.props.firestore;

    return (
      <main>
        {isLoaded(trainers) ? (
          <div>
            <Table
              data={data}
              openModal={this.openModal}
              firestoreDelete={firestoreDelete}
              columns={columnsTrainers}
              collection="trainers"
              title="Тренеры"
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
    trainers: state.firestore.ordered.trainers,
    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    if (props.user.userId)
      return [{ collection: "trainers", /* where: [["createdBy.userId", "==", props.user.userId]] */ }];
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
  trainersContainer: {
    position: "relative"
  }
};
