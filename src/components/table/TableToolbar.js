import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import SendIcon from "@material-ui/icons/Send";

import FilterListIcon from "@material-ui/icons/FilterList";
import { lighten } from "@material-ui/core/styles/colorManipulator";

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  spacer: {
    flex: "1 1 100%"
  },
  actions: {
    color: theme.palette.text.secondary
  },
  title: {
    flex: "0 0 auto"
  }
});

const EnhancedTableToolbar = props => {
  const { numSelected, classes } = props;

  const handleDelete = () => {
    const { firestoreDelete, selected, collection } = props;
    selected.forEach(doc => {
      // console.log("collection", collection);
      firestoreDelete({ collection, doc });
    });
  };

  const handleEdit = () => {
    const { openModal, selected } = props;
    openModal(selected[selected.length - 1]);
  };

  const { title } = props;

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1">
            {numSelected} выбрано
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle">
            {title}
          </Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <div style={{ width: 144 }}>
            <Tooltip style={{ display: "inline" }} title="Удалить" onClick={handleDelete}>
              <IconButton aria-label="Удалить">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Редактировать" style={{ display: "inline" }} onClick={handleEdit}>
              <IconButton aria-label="Редактировать">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Добавить в заявку" style={{ display: "inline" }} onClick={handleDelete}>
              <IconButton aria-label="Добавить в заявку">
                <SendIcon />
              </IconButton>
            </Tooltip>
          </div>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

export default withStyles(toolbarStyles)(EnhancedTableToolbar);
