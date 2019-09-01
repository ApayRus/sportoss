import React from "react";

import {
  Button,
  TextField,
  Typography,
  FormHelperText,
  Select,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl
} from "@material-ui/core";
// import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";

const styles = {
  categoryInput: { width: 40, margin: 5 },
  categoryTypography: {
    marginRight: 10,
    marginLeft: 10,
    marginTop: 6,
    display: "inline-block"
  },
  categoryContainer: {
    /* display: "flex", alignItems: "center" */
  }
};

class Form extends React.Component {
  state = {
    id: "",
    gender: "",
    minAge: "",
    maxAge: "",
    minWeight: "",
    maxWeight: ""
  };

  componentDidMount() {
    const { id, gender, minAge, maxAge, weight } = this.props.data;
    this.setState({ id, gender, minAge, maxAge, weight });
  }

  handleChange = e => {
    //console.log("event.target", e.target);
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = () => {
    // category = { id, gender, minAge, maxAge, weight }
    const { id, gender, minAge, maxAge, weight } = this.state;
    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    };
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "categories" },
        { gender, minAge, maxAge, weight, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error.message);
      });
    } else {
      const firestoreUpdate = this.props.firestoreUpdate(
        { collection: "categories", doc: id },
        { id, gender, minAge, maxAge, weight, createdBy }
      );
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
    const { id, gender, minAge, maxAge, weight } = this.state;
    //console.log("gender", gender);
    const formTitle = id ? "Редактирование" : "Добавление";
    return (
      <Dialog
        open={this.props.isModalOpen}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <Typography color="primary">{formTitle} категории</Typography>
        </DialogTitle>
        <DialogContent>
          <form style={styles.categoryContainer} onChange={this.handleChange}>
            <Typography style={styles.categoryTypography}>Пол</Typography>
            <FormControl>
              <Select
                native
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
            <br />
            <Typography style={{ ...styles.categoryTypography, marginTop: 11 }}>
              Возраст
            </Typography>
            <TextField
              id="minAge"
              value={minAge}
              placeholder="от"
              type="number"
              style={styles.categoryInput}
            />
            {` - `}
            <TextField
              placeholder="до"
              type="number"
              id="maxAge"
              value={maxAge}
              style={styles.categoryInput}
            />
            <br />
            <Typography style={{ ...styles.categoryTypography, marginTop: 11 }}>
              Вес
            </Typography>
            <TextField
              placeholder="вес"
              type="text"
              id="weight"
              value={weight}
              margin="normal"
              style={styles.categoryInput}
            />
          </form>
          <br />
          <FormHelperText>
            {" "}
            {/*THIS IS PLACE FOR ERROR MESSAGE */}
          </FormHelperText>
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
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(Form);
