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
  state = { tournament: "", participants: [{ athletId: "", categoryId: "" }] };

  handleChangeCategory = event => {
    const athletId = event.target.dataset.id;
    const categoryId = event.target.value;

    console.log("athletId", athletId, "categoryId", categoryId);
  };

  render() {
    const { athlets, categories, tournaments, selected } = this.props;

    let selectedAthlets = [];
    let selectedAthletsWithCategories = [];

    if (isLoaded(athlets) && isLoaded(categories)) {
      selectedAthlets = athlets.filter(athlet => selected.includes(athlet.id));
      selectedAthletsWithCategories = selectedAthlets.map(athlet => {
        const { id, name } = athlet;
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
              <Button variant="contained" color="primary" style={styles.button}>
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
