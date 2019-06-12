import React from "react";
import DuelSimple from "./DuelSimple";
import { withStyles } from "@material-ui/core/styles";

function Grid(props) {
  const { grid, classes } = props;
  return (
    <div>
      {Object.keys(grid).map(key => (
        <div key={key} className={classes.levelBox}>
          <h2>Level {key}</h2>
          {grid[key].map(duel => (
            <DuelSimple id={duel.id} key={duel.id} />
          ))}
        </div>
      ))}
    </div>
  );
}

const styles = {
  levelBox: {
    border: "1px solid orange"
  }
};

export default withStyles(styles)(Grid);
