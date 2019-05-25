import React from "react";

import {
  Button,
  FormControl,
  InputLabel,
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
import { athletName, categoryName, trainerName, tournamentName } from "../../config/functions";
import Select from "./Select";

const columns = [
  { id: "participant", numeric: false, disablePadding: false, label: "Участник" },
  { id: "category", numeric: false, disablePadding: false, label: "Категория" },
  { id: "trainer", numeric: false, disablePadding: false, label: "Тренер" }
];

class Form extends React.Component {
  state = { id: "", tournamentId: "", participants: {} };

  componentDidMount() {
    const { id, tournamentId, participants } = this.props.data;
    const selected = Object.keys(participants);
    this.setState({ id, tournamentId, participants, selected });
  }

  handleChange = e => {
    this.setState({
      [e.target.dataset.id]: e.target.value
    });
  };

  handleChangeCategory = event => {
    //participants = { athletId: {categoryId, trainerId} }
    const athletId = event.target.dataset.id;
    const categoryId = event.target.value;
    const participants = { ...this.state.participants };
    participants[athletId] = { ...participants[athletId], categoryId, athletId };
    this.setState({ participants });
  };

  handleChangeTrainer = event => {
    const athletId = event.target.dataset.id;
    const trainerId = event.target.value;
    const participants = { ...this.state.participants };
    participants[athletId] = { ...participants[athletId], trainerId, athletId };
    this.setState({ participants });
  };

  handleSelect = selected => {
    this.setState({ selected });
  };

  handleSubmit = () => {
    const { id, tournamentId, participants: oldParticipants, selected } = this.state;

    //only selected participants should enter into the app
    const participants = { ...oldParticipants };
    Object.keys(participants).forEach(key => {
      if (!selected.includes(key)) {
        delete participants[key];
      }
    });

    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    };
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "applications" },
        { tournamentId, participants, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error.message);
      });
    } else {
      const firestoreUpdate = this.props
        .firestoreUpdate(
          { collection: "applications", doc: id },
          { id, tournamentId, participants, createdBy }
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
    const { id, tournamentId, participants } = this.state;
    const { athlets, tournaments, categories, trainers } = this.props;

    let tournamentValue = "";
    if (tournamentId !== undefined) tournamentValue = tournamentId;

    const tournament = (
      <Select
        parentId="tournamentId"
        value={tournamentValue}
        data={tournaments}
        handleChange={this.handleChange}
        nameFunction={tournamentName}
      />
    );

    const formTitle = id ? "Редактирование" : "Добавление";

    const athletsWithCategories = athlets.map(athlet => {
      let categoryValue = "";
      let trainerValue = "";

      if (participants[athlet.id] !== undefined) categoryValue = participants[athlet.id].categoryId;
      if (participants[athlet.id] !== undefined) trainerValue = participants[athlet.id].trainerId;

      const category = (
        <Select
          parentId={athlet.id}
          value={categoryValue}
          data={categories}
          handleChange={this.handleChangeCategory}
          nameFunction={categoryName}
        />
      );

      const trainer = isLoaded(trainers) ? (
        <Select
          parentId={athlet.id}
          value={trainerValue}
          data={trainers}
          handleChange={this.handleChangeTrainer}
          nameFunction={trainerName}
        />
      ) : (
        <CircularProgress />
      );

      return { id: athlet.id, participant: athletName(athlet), category, trainer };
    });

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
              <InputLabel htmlFor="tournamentId">Турнир</InputLabel>
              {tournament}
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
                disableRowClick
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
    trainers: state.firestore.ordered.trainers,
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
        { collection: "trainers", where: [["createdBy.userId", "==", props.user.userId]] },
        { collection: "categories" },
        { collection: "tournaments" }
      ];
    else return [];
  })
)(Form);
