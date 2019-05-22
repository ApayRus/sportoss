import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  SwipeableDrawer,
  IconButton
} from "@material-ui/core";

import { Link } from "react-router-dom";

import { MoveToInbox as InboxIcon, Mail as MailIcon, Menu as MenuIcon } from "@material-ui/icons";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";

const styles = {
  list: {
    width: 250
  },
  fullList: {
    width: "auto"
  }
};

class SwipeableTemporaryDrawer extends React.Component {
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open
    });
  };

  render() {
    const { classes } = this.props;

    const sideList = (
      <div className={classes.list}>
        <List>
          <ListItem button component={Link} to="/athlets">
            <ListItemText primary="Спортсмены" />
          </ListItem>
          <ListItem button component={Link} to="/trainers">
            <ListItemText primary="Тренеры" />
          </ListItem>
          <ListItem button component={Link} to="/tournaments">
            <ListItemText primary="Турниры" />
          </ListItem>
          <ListItem button component={Link} to="/categories">
            <ListItemText primary="Категории" />
          </ListItem>
          <ListItem button component={Link} to="/applications">
            <ListItemText primary="Заявки" />
          </ListItem>
        </List>
        <Divider />
        {this.props.authLinks}
      </div>
    );

    return (
      <div>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
          onClick={this.toggleDrawer("left", true)}
        >
          <MenuIcon />
        </IconButton>

        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer("left", false)}
          onOpen={this.toggleDrawer("left", true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer("left", false)}
            onKeyDown={this.toggleDrawer("left", false)}
          >
            {sideList}
          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

SwipeableTemporaryDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SwipeableTemporaryDrawer);
