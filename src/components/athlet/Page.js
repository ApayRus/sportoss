import React, { Component } from "react";
import { Fab, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Table from "../table/Table";
import Form from "./Form";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";

//Table columns or fields of our data model
const columns = [
  { id: "name", numeric: false, disablePadding: false, label: "ФИО" },
  { id: "birthday", numeric: false, disablePadding: false, label: "Родился" },
  { id: "gender", numeric: false, disablePadding: false, label: "Пол" }
];

export class Page extends Component {
  state = { isModalOpen: false, data: {} };

  openModal = id => {
    const defaultData = { name: "", birthday: "", gender: "" }; // if we create new entry
    const modalData = this.props.athlets.find(el => el.id === id) || defaultData;
    this.setState({ modalData });
    this.setState({ isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const { athlets } = this.props;
    const {
      add: firestoreAdd,
      delete: firestoreDelete,
      update: firestoreUpdate
    } = this.props.firestore;

    return (
      <main>
        {isLoaded(athlets) ? (
          <Table
            data={athlets}
            // handleSelected={this.getSelected}
            openModal={this.openModal}
            firestoreDelete={firestoreDelete}
            columns={columns}
            collection="athlets"
            title="Спортсмены"
          />
        ) : (
          <CircularProgress />
        )}
        <Fab style={fabStyle} onClick={() => this.openModal(null)} color="primary" aria-label="Add">
          <AddIcon />
        </Fab>
        {this.state.isModalOpen && (
          <Form
            isModalOpen={this.state.isModalOpen}
            data={this.state.modalData}
            closeModal={this.closeModal}
            firestoreAdd={firestoreAdd}
            firestoreUpdate={firestoreUpdate}
          />
        )}
      </main>
    );
  }
}

const mapStateToProps = state => {
  return {
    athlets: state.firestore.ordered.athlets
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "athlets" }])
)(Page);

const fabStyle = {
  margin: 0,
  top: "auto",
  right: 20,
  bottom: 20,
  left: "auto",
  position: "fixed"
};
