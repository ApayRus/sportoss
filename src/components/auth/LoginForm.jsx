import React from "react";

import { Button, TextField, Paper, Typography, FormHelperText } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import styles from "./styles";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";

// import { signIn } from '../../store/actions/authActions';

class LoginForm extends React.Component {
  state = { email: "", password: "" };
  handleChange = e => {
    this.setState({
      [e.target.id]: e.target.value
    });
  };

  handleSubmit = () => {
    this.props.firebase.login(this.state);
  };

  render() {
    const { authError, auth } = this.props;

    if (auth.uid) return <Redirect to="/" />;
    return (
      <div style={styles.flexContainer}>
        <Paper style={styles.loginForm}>
          <Typography variant="h5" color="primary">
            Войти
          </Typography>
          <TextField
            onChange={this.handleChange}
            id="email"
            label="Email"
            type="text"
            margin="normal"
            autoFocus
            fullWidth
          />
          <br />
          <TextField
            onChange={this.handleChange}
            id="password"
            label="Password"
            type="password"
            margin="normal"
            fullWidth
          />
          <br />
          <Button
            style={styles.loginButton}
            onClick={this.handleSubmit}
            variant="contained"
            color="primary"
            margin="normal"
          >
            Войти
          </Button>
          <FormHelperText error>{authError ? authError : null}</FormHelperText>
          <FormHelperText>
            В первый раз на сайте? Тогда <Link to="/register">зарегистрируйтесь</Link>.
          </FormHelperText>
        </Paper>
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  firebaseConnect()
)(LoginForm);
