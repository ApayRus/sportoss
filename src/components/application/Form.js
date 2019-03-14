import React, { Component } from "react";
import {
  Typography,
  Paper,
  Button,
  FormControl,
  InputLabel,
  Select,
  CircularProgress
} from "@material-ui/core";
// import SendIcon from "@material-ui/icons/Send";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";

import Table from "../table/Table";
import { categoryName } from "../category/functions";

//Table columns or fields of our data model
const columnsApplication = [
  { id: "name", numeric: false, disablePadding: false, label: "Участник" },
  { id: "category", numeric: false, disablePadding: false, label: "Категория" }
];

export class Form extends Component {
  state = { tournament: "", participantCategory: {} }; //participantCategory = { athletId:categoryId, ... }

  handleChangeCategory = event => {
    const athletId = event.target.dataset.id;
    const categoryId = event.target.value;

    this.setState(oldState => {
      const newParticipantCategory = { ...oldState.participantCategory, [athletId]: categoryId };
      return { ...oldState, participantCategory: newParticipantCategory };
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
    console.log("e.target.id", e.target.id, "e.target.value", e.target.value);
  };

  handleSubmit = () => {
    const { selected } = this.props;
    const createdBy = this.props.user;

    const { add: firestoreAdd } = this.props.firestore;
    let participantCategory = this.state.participantCategory;
    for (let athletId in participantCategory) {
      //if we deleted some athlets from Application, they wasn't deleted from state.participantCategory
      // now we do this, by check with "selected"
      if (!selected.includes(athletId)) delete participantCategory[athletId];
    }
    this.setState({ participantCategory }, () => {
      firestoreAdd({ collection: "applications" }, { ...this.state, createdBy })
        .then(result => console.log("added new document ", result.path))
        .catch(error => {
          console.log("firestoreAdd error", error);
        });
    });
  };

  render() {
    const { athlets, categories, tournaments, selected } = this.props;

    let selectedAthlets = [];
    let selectedAthletsWithCategories = [];

    if (isLoaded(athlets) && isLoaded(categories)) {
      selectedAthlets = athlets.filter(athlet => selected.includes(athlet.id));
      selectedAthletsWithCategories = selectedAthlets.map(athlet => {
        const { id, familyName, firstName, fatherName } = athlet;
        const name = `${familyName} ${firstName} ${fatherName}`;
        const category = (
          <Select
            native
            inputProps={{
              "data-id": id
            }}
            onChange={this.handleChangeCategory}
          >
            <option value="" />
            {categories.map(cat => (
              <option value={cat.id} key={`cat-${cat.id}`}>
                {categoryName(cat).name}
              </option>
            ))}
          </Select>
        );
        return { id, name, category };
      });
    }

    return (
      <Paper style={styles.applicationContainer}>
        <Typography variant="h6">Заявка</Typography>
        {isLoaded(categories) && isLoaded(tournaments) ? (
          <form>
            <FormControl fullWidth>
              <InputLabel htmlFor="tournament">Турнир</InputLabel>
              <Select
                native
                onChange={this.handleChange}
                inputProps={{
                  id: "tournament"
                }}
              >
                <option value="" />
                {tournaments.map(tour => (
                  <option value={tour.id} key={`tour-${tour.id}`}>
                    {tour.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Table
              data={selectedAthletsWithCategories}
              columns={columnsApplication}
              collection="athlets"
              title="Заявка"
              hideCheckboxes={true}
              hideToolbar={true}
            />
            <div style={styles.formActions}>
              <Button
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                style={styles.button}
              >
                Отправить
              </Button>
            </div>
          </form>
        ) : (
          <CircularProgress />
        )}
      </Paper>
    );
  }
}

const mapStateToProps = state => {
  return {
    tournaments: state.firestore.ordered.tournaments,
    categories: state.firestore.ordered.categories
  };
};

const styles = {
  applicationContainer: {
    marginTop: 25,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  button: { marginTop: 10 },
  formActions: { textAlign: "right" }
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([{ collection: "tournaments" }, { collection: "categories" }])
)(Form);
