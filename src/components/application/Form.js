import React from "react";

import {
  Button,
  FormControl,
  InputLabel,
  Select,
  Typography,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress
} from "@material-ui/core";
// import { Link, Redirect } from "react-router-dom";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import AthletTable from "../table/Table";
import { athletName, categoryName } from "../../config/functions";

const columns = [
  { id: "participant", numeric: false, disablePadding: false, label: "Участник" },
  { id: "category", numeric: false, disablePadding: false, label: "Категория" }
];

class Form extends React.Component {
  state = { id: "", tournament: "", participants: {} };

  componentDidMount() {
    const { id, tournament, participants } = this.props.data;
    const selected = Object.keys(participants);
    console.log("this.props DidMount", this.props.data);
    this.setState({ id, tournament, participants, selected });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
    console.log("{[e.target.id]: e.target.value}", { [e.target.id]: e.target.value });
  };

  handleChangeCategory = event => {
    // participants: [ {athletId: "1", categoryId:"256"}, {athletId: "2", categoryId:"256"}, {athletId: "3", categoryId:"450"} ]
    const athletId = event.target.dataset.athletid;
    const categoryId = event.target.value;
    //console.log("athletId categoryId", athletId, categoryId);
    const participants = { ...this.state.participants };
    console.log("this.state.participants", this.state.participants);
    participants[athletId] = {};
    participants[athletId].categoryId = categoryId;
    this.setState({ participants }, () => console.log("this.state", this.state));
  };

  handleSelect = selected => {
    this.setState({ categories: selected });
  };

  handleSubmit = () => {
    const { id, tournament, participants } = this.state;
    console.log("handleSubmit participants", participants);
    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    };
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "applications" },
        { tournament, participants, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error.message);
      });
    } else {
      const firestoreUpdate = this.props
        .firestoreUpdate(
          { collection: "applications", doc: id },
          { id, tournament, participants, createdBy }
        )
        .then(result => console.log("result", result));
      firestoreUpdate.catch(error => {
        console.log("firestoreUpdate error", error.message);
      });
    }

    this.handleCancel();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { id, tournament, participants } = this.state;
    const { athlets, tournaments, categories } = this.props;
    const athletsWithCategories = athlets.map(athlet => {
      let categoryValue = "";
      console.log("participants[athlet.id]", participants[athlet.id]);
      if (participants[athlet.id] !== undefined) categoryValue = participants[athlet.id].categoryId;

      console.log("categoryValue", categoryValue);

      const category = (
        <Select
          native
          inputProps={{
            "data-athletid": athlet.id
          }}
          style={{ fontSize: "0.8125rem" }}
          onChange={this.handleChangeCategory}
          value={categoryValue}
        >
          <option value="" />
          {categories.map(cat => (
            <option value={cat.id} key={`cat-${cat.id}`}>
              {categoryName(cat)}
            </option>
          ))}
        </Select>
      );
      return { id: athlet.id, participant: athletName(athlet), category };
    });
    const formTitle = id ? "Редактирование" : "Добавление";
    // console.log("categories", categories);

    return (
      <Dialog
        open={this.props.isModalOpen}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Typography color="primary">{formTitle} заявки</Typography>
        </DialogTitle>
        <DialogContent>
          <form>
            <FormControl fullWidth>
              <InputLabel htmlFor="tournament">Турнир</InputLabel>
              <Select
                native
                onChange={this.handleChange}
                value={tournament}
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

            {isLoaded(athlets) ? (
              <AthletTable
                data={athletsWithCategories}
                openModal={this.openModal}
                columns={columns}
                title="Участники"
                selected={this.state.selected}
                handleSelect={this.handleSelect}
                hideToolbar={true}
              />
            ) : (
              <CircularProgress />
            )}
          </form>
          <br />
          <FormHelperText> {/*THIS IS PLACE FOR ERROR MESSAGE */}</FormHelperText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={this.handleSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    athlets: state.firestore.ordered.athlets,
    categories: state.firestore.ordered.categories,
    tournaments: state.firestore.ordered.tournaments
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    if (props.user.userId)
      return [
        { collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] },
        { collection: "categories" },
        { collection: "tournaments" }
      ];
    else return [];
  })
)(Form);
