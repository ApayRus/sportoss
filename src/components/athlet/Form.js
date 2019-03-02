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
import styles from "./styles";
import { connect } from "react-redux";

// import { signIn } from '../../store/actions/authActions';
const initialState = { fullname: "", birthday: "", gender: "" };
class Form extends React.Component {
  state = initialState;

  componentDidMount() {
    const { fullname, birthday, gender } = this.props.data;
    console.log("this.props.data", this.props.data);
    this.setState({ fullname, birthday, gender });
    console.log("componentWillReceiveProps this.state ", this.state);
  }

  handleChange = e => {
    // console.log("e.target.id & value", e.target, e.target.value);
    // const id = e.target.id || "gender";
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = () => {
    const { fullname, birthday, gender } = this.state;
    console.log("this.state", this.state);
    const createdBy = {
      userName: this.props.profile.username,
      userId: this.props.auth.uid
    };
    const firestoreAdd = this.props.firestoreAdd(
      { collection: "athlets" },
      { fullname, birthday, gender, createdBy }
    );
    firestoreAdd.catch(error => {
      console.log("firestoreAdd error", error);
    });

    this.handleCancel();
  };

  handleDelete = () => {
    const { id, name, image } = this.state;
    const confirmation = window.confirm("Are you sure? ");
    if (confirmation) this.props.deleteAuthor({ id, name, image }, "authors");
    this.props.toggleModal();
  };

  handleCancel = () => {
    this.props.closeModal();
  };

  render() {
    const { authError } = this.props;
    //const { fullname, birthday, gender } = this.state;
    const { id, fullname, birthday, gender } = this.state;
    //if (auth.uid) return <Redirect to="/" />;
    return (
      <div style={styles.flexContainer}>
        <Dialog
          open={this.props.isModalOpen}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            <Typography color="primary">Добавление спортсмена</Typography>
          </DialogTitle>
          <DialogContent>
            {/* FULLNAME */}
            <TextField
              onChange={this.handleChange}
              id="fullname"
              label="ФИО"
              type="text"
              value={fullname}
              margin="normal"
              autoFocus
              fullWidth
              InputLabelProps={{
                shrink: true
              }}
            />
            <br />
            {/* BIRTHDAY */}
            <TextField
              onChange={this.handleChange}
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
            <FormControl fullWidth /* className={classes.formControl} */>
              <InputLabel htmlFor="gender">Пол</InputLabel>
              <Select
                native
                value={gender}
                onChange={this.handleChange}
                inputProps={{
                  name: "gender",
                  id: "gender"
                }}
              >
                <option value="" />
                <option value="Муж">Муж</option>
                <option value="Жен">Жен</option>
              </Select>
            </FormControl>
            <br />
            <FormHelperText error>
              {authError ? authError : null}
            </FormHelperText>
            {/*           <FormHelperText>
            Don't have an accout? Please <Link to="/register">register</Link>.
          </FormHelperText> */}
          </DialogContent>
          <DialogActions>
            <Button /* onClick={this.handleDelete} */ color="secondary">
              Delete
            </Button>
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
    // authError: state.auth.authError,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    // signIn: creds => dispatch(signIn(creds))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form);
