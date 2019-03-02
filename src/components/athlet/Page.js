import React, { Component } from "react";
import { Fab, CircularProgress } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Table from "./Table";
import Form from "./Form";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";

export class Page extends Component {
  state = { isModalOpen: false, data: {} };

  openModal = data => {
    const defaultData = data || {
      fullname: "Aaa",
      birthday: "1984-11-11",
      gender: "Жен"
    };

    this.setState({ data: defaultData });
    this.setState({ isModalOpen: true });

    console.log("defaultData", defaultData);
  };

  toggleModal = id => {
    const selected = this.props.athlets.find(el => el.id === id);
    this.openModal(selected);
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  render() {
    const { athlets } = this.props;
    /*     if (athlets) {
      console.log("athlets.length", athlets.length);
    } */
    return (
      <main>
        {isLoaded(athlets) ? (
          <Table
            athlets={athlets}
            handleSelected={this.getSelected}
            toggleModal={this.toggleModal}
            firestoreDelete={this.props.firestore.delete}
          />
        ) : (
          <CircularProgress />
        )}
        <Fab
          style={fabStyle}
          onClick={() => this.openModal(null)}
          color="primary"
          aria-label="Add"
        >
          <AddIcon />
        </Fab>
        {this.state.isModalOpen && (
          <Form
            isModalOpen={this.state.isModalOpen}
            data={this.state.data}
            closeModal={this.closeModal}
            firestoreAdd={this.props.firestore.add}
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
