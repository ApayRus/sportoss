//copy paste-ted from '/athlet'
import React from "react";

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
// import { Link, Redirect } from "react-router-dom";
//import { connect } from "react-redux";

class Form extends React.Component {
  state = { id: "", firstName: "", familyName: "", fatherName: "" };

  componentDidMount() {
    const { id, firstName, familyName, fatherName } = this.props.data;
    this.setState({ id, firstName, familyName, fatherName });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = () => {
    const { id, firstName, familyName, fatherName } = this.state;
    const createdBy = this.props.user;
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "trainers" },
        { firstName, familyName, fatherName, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error);
      });
    } else {
      const firestoreUpdate = this.props.firestoreUpdate(
        { collection: "trainers", doc: id },
        { firstName, familyName, fatherName, createdBy }
      );
      firestoreUpdate.catch(error => {
        console.log("firestoreUpdate error", error);
      });
    }

    this.handleCancel();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { id, firstName, familyName, fatherName } = this.state;
    const formTitle = id ? "Редактирование" : "Добавление";
    return (
      <div>
        <Dialog
          open={this.props.isModalOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography color="primary">{formTitle} тренера</Typography>
          </DialogTitle>
          <DialogContent>
            <form onChange={this.handleChange}>
              {/* FULLNAME */}
              <TextField
                id="familyName"
                label="Фамилия"
                type="text"
                value={familyName}
                margin="normal"
                autoFocus
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="firstName"
                label="Имя"
                type="text"
                value={firstName}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
              <TextField
                id="fatherName"
                label="Отчество"
                type="text"
                value={fatherName}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
            </form>
            <br />
            <FormHelperText> {/*THIS IS PLACE FOR ERROR MESSAGE */}</FormHelperText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="default">
              Отмена
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Сохранить
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default Form;
