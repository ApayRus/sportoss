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
import { connect } from "react-redux";

class Form extends React.Component {
  state = { id: "", name: "", date: "", address: "", categories: "" };

  componentDidMount() {
    const { id, name, date, address, categories } = this.props.data;
    this.setState({ id, name, date, address, categories });
  }

  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = () => {
    const { id, name, date, address, categories } = this.state;
    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    };
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "tournaments" },
        { name, date, address, categories, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error);
      });
    } else {
      const firestoreUpdate = this.props.firestoreUpdate(
        { collection: "tournaments", doc: id },
        { id, name, date, address, categories, createdBy }
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
    const { id, name, date, address, categories } = this.state;
    const formTitle = id ? "Редактирование" : "Добавление";
    return (
      <div>
        <Dialog
          open={this.props.isModalOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography color="primary">{formTitle} турнира</Typography>
          </DialogTitle>
          <DialogContent>
            {/* NAME */}
            <TextField
              onChange={this.handleChange}
              id="name"
              label="Название"
              type="text"
              value={name}
              margin="normal"
              autoFocus
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <br />
            {/* DATE+TIME */}
            <TextField
              onChange={this.handleChange}
              id="date"
              label="Дата"
              type="datetime-local"
              value={date}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            {/* ADDRESS */}
            <TextField
              onChange={this.handleChange}
              id="address"
              label="Адрес"
              type="text"
              value={address}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              onChange={this.handleChange}
              id="categories"
              label="Категории"
              type="text"
              value={categories}
              margin="normal"
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(Form);
