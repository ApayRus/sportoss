import React from "react";

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@material-ui/core";
// import { Link, Redirect } from "react-router-dom";
//import { connect } from "react-redux";

class Form extends React.Component {
  state = { id: "", firstName: "", familyName: "", fatherName: "", birthday: "", gender: "" };

  componentDidMount() {
    const { id, firstName, familyName, fatherName, birthday, gender } = this.props.data;
    this.setState({ id, firstName, familyName, fatherName, birthday, gender });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = () => {
    const { id, firstName, familyName, fatherName, birthday, gender } = this.state;
    const createdBy = this.props.user;
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "athlets" },
        { firstName, familyName, fatherName, birthday, gender, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error);
      });
    } else {
      const firestoreUpdate = this.props.firestoreUpdate(
        { collection: "athlets", doc: id },
        { firstName, familyName, fatherName, birthday, gender, createdBy }
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
    const { id, firstName, familyName, fatherName, birthday, gender } = this.state;
    const formTitle = id ? "Редактирование" : "Добавление";
    return (
      <div>
        <Dialog
          open={this.props.isModalOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography color="primary">{formTitle} спортсмена</Typography>
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
              <br />
              {/* BIRTHDAY */}
              <TextField
                id="birthday"
                label="Дата рождения"
                type="date"
                value={birthday}
                margin="normal"
                fullWidth
                InputLabelProps={{
                  shrink: true
                }}
              />
              {/* GENDER */}
              <FormControl fullWidth>
                <InputLabel htmlFor="gender">Пол</InputLabel>
                <Select
                  native //if remove that, id does't appear in event.target
                  value={gender}
                  inputProps={{
                    id: "gender"
                  }}
                >
                  <option value="" />
                  <option value="Муж">Муж</option>
                  <option value="Жен">Жен</option>
                </Select>
              </FormControl>
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
