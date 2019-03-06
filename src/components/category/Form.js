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
  categoryTypography: { marginRight: 10, marginLeft: 10 },
  categoryContainer: { display: "flex", alignItems: "center" }
};

class Form extends React.Component {
  state = { id: "", gender: "", minAge: "", maxAge: "", minWeight: "", maxWeight: "" };

  componentDidMount() {
    const { id, gender, minAge, maxAge, minWeight, maxWeight } = this.props.data;
    this.setState({ id, gender, minAge, maxAge, minWeight, maxWeight });
  }

  handleChange = e => {
    //console.log("event.target", e.target);
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = () => {
    // category = { id, gender, minAge, maxAge, minWeight, maxWeight }
    const { id, gender, minAge, maxAge, minWeight, maxWeight } = this.state;
    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    };
    //id is empty when we creates new endtry, and filled when we edit an existen one
    if (!id) {
      const firestoreAdd = this.props.firestoreAdd(
        { collection: "categories" },
        { gender, minAge, maxAge, minWeight, maxWeight, createdBy }
      );
      firestoreAdd.catch(error => {
        console.log("firestoreAdd error", error.message);
      });
    } else {
      const firestoreUpdate = this.props.firestoreUpdate(
        { collection: "categories", doc: id },
        { id, gender, minAge, maxAge, minWeight, maxWeight, createdBy }
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
    const { id, gender, minAge, maxAge, minWeight, maxWeight } = this.state;
    //console.log("gender", gender);
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
              <Typography style={styles.categoryTypography} inline>
                Пол
              </Typography>
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

              <Typography style={styles.categoryTypography} inline>
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

              <Typography style={styles.categoryTypography} inline>
                Вес
              </Typography>
              <TextField
                placeholder="от"
                type="number"
                id="minWeight"
                value={minWeight}
                margin="normal"
                style={styles.categoryInput}
              />
              {` - `}
              <TextField
                placeholder="до"
                type="number"
                id="maxWeight"
                value={maxWeight}
                margin="normal"
                style={styles.categoryInput}
              />
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
