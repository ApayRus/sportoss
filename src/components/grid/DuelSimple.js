import React from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  duel: {
    width: 50,
    height: 20,
    border: "1px solid gray"
  }
};

function DuelSimple(props) {
  const { id, classes } = props;
  return <div className={classes.duel}>{id}</div>;
}

export default withStyles(styles)(DuelSimple);
