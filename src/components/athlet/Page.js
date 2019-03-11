import React, { Component } from "react";
import { Fab, CircularProgress, Grid, Select } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

import Table from "../table/Table";
import Form from "./Form";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { categoryName } from "../category/functions";
import Application from "../application/Form";
//Table columns or fields of our data model
const columnsAthlets = [
  { id: "name", numeric: false, disablePadding: false, label: "ФИО" },
  { id: "birthday", numeric: false, disablePadding: false, label: "Родился" },
  { id: "gender", numeric: false, disablePadding: false, label: "Пол" }
];

//categories = array of ids
const SelectCategory = categories => {
  return (
    <Select
      native
      value={""}
      inputProps={{
        "data-id": "category"
      }}
    >
      <option value="" />
      {categories.map(cat => (
        <option value={cat.id} key={`cat-${cat.id}`}>
          {categoryName(cat).name}
        </option>
      ))}
    </Select>
  );
};

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
    const { athlets, categories } = this.props;
    const { selected } = this.state;
    let selectedAthlets = [];
    let selectedAthletsWithCategories = [];
    if (isLoaded(athlets)) {
      selectedAthlets = athlets.filter(athlet => selected.includes(athlet.id));
      console.log("selectedAthlets", selectedAthlets);
      selectedAthletsWithCategories = selectedAthlets.map(athlet => {
        const { id, name } = athlet;
        const category = SelectCategory(categories);
        return { id, name, category };
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
              <Table
                data={athlets}
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
                />
              )}
            </Grid>
            <Grid item sm={5}>
              <Application selectedAthletsWithCategories={selectedAthletsWithCategories} />
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
  return {
    athlets: state.firestore.ordered.athlets,
    categories: state.firestore.ordered.categories
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "athlets" }, { collection: "categories" }])
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
