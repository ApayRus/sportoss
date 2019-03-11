import React, { Component } from "react";
import { Typography, Paper, Button, FormControl, InputLabel, Select } from "@material-ui/core";
// import SendIcon from "@material-ui/icons/Send";

import Table from "../table/Table";

//Table columns or fields of our data model
const columnsApplication = [
  { id: "name", numeric: false, disablePadding: false, label: "Участник" },
  { id: "category", numeric: false, disablePadding: false, label: "Категория" }
];

export class Form extends Component {
  state = { tournament: "", participants: [{ athletId: "", categoryId: "" }] };

  render() {
    const { selectedAthletsWithCategories } = this.props;
    return (
      <Paper style={styles.applicationContainer}>
        <Typography variant="h6">Заявка</Typography>
        <FormControl fullWidth>
          <InputLabel htmlFor="gender">Пол</InputLabel>
          <Select
            native //if remove that, id does't appear in event.target
            //   value={tournament}
            inputProps={{
              id: "tournament"
            }}
          >
            <option value="" />
            <option value="Муж">Муж</option>
            <option value="Жен">Жен</option>
          </Select>
        </FormControl>
        <Table
          data={selectedAthletsWithCategories}
          columns={columnsApplication}
          collection="athlets"
          title="Заявка"
          hideCheckboxes={true}
          hideToolbar={true}
        />
        <div style={styles.formActions}>
          <Button variant="contained" color="primary" style={styles.button}>
            Отправить
          </Button>
        </div>
      </Paper>
    );
  }
}

const styles = {
  applicationContainer: {
    marginTop: 25,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
  button: { marginTop: 10 },
  formActions: { textAlign: "right" }
};

export default Form;
