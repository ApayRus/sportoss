import React, { Component } from "react";

import { connect } from "react-redux";
import { firestoreConnect, isLoaded } from "react-redux-firebase";
import { compose } from "redux";
import { CircularProgress, Avatar, Typography } from "@material-ui/core";
import { participantsGroupedByCategories } from "../../dataFunctions";
import { map, sortBy, groupBy } from "lodash";
import { randomColor } from "randomcolor";

import { athletName, categoryName, trainerName, tournamentName } from "../../config/functions";

export class Page extends Component {
  render() {
    const { tournament, category, applications, allAthlets, allTrainers } = this.props;
    const { categoryId } = this.props.match.params;
    let participants = [];
    //let participantsByTrainer = {};
    let athletIds = [];
    let trainerIds = [];
    let athlets = [];
    let trainers = [];
    let trainerColors = {};
    let athletsByKey = {};

    if (isLoaded(applications, category, allAthlets, allTrainers)) {
      participants = participantsGroupedByCategories(applications)[categoryId];
      //participantsByTrainer = groupBy(participants, "trainerId");

      athletIds = map(participants, "athletId"); // ['1111', '2222', '3333', ...]
      trainerIds = map(participants, "trainerId"); // ['1111', '2222', '3333', ...]
      trainerIds.forEach(trainerId => {
        trainerColors[trainerId] = randomColor();
      });
      participants = sortBy(participants, "trainerId");
      athlets = allAthlets.filter(athlet => athletIds.includes(athlet.id));
      trainers = allTrainers.filter(trainer => trainerIds.includes(trainer.id));
      athletsByKey = groupBy(athlets, "id");
      console.log("athletsByKey", athletsByKey);
    }

    return (
      <div>
        {isLoaded(tournament, category, allAthlets, allTrainers, applications) ? (
          <div>
            <h1>Форма категории</h1>
            <h2>{categoryName(category)}</h2>
            <h3>{tournamentName(tournament)}</h3>
            {trainers.map(trainer => (
              <div key={trainer.id}>
                <Avatar
                  style={{ backgroundColor: trainerColors[trainer.id], width: 10, height: 10 }}
                />{" "}
                <Typography variant="body1">{trainerName(trainer)} </Typography>
              </div>
            ))}
            <ul>
              {/* {athletId, trainerId, categoryId} */}
              {participants.map(par => (
                <div key={par.athletId}>
                  <Avatar
                    style={{ backgroundColor: trainerColors[par.trainerId], width: 10, height: 10 }}
                  />{" "}
                  <Typography variant="body1">
                    {athletName(athletsByKey[par.athletId][0])}{" "}
                  </Typography>
                </div>
              ))}
            </ul>
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const userId = state.firebase.auth.uid;
  const userName = state.firebase.profile.username;

  return {
    tournament: state.firestore.data.tournament,
    category: state.firestore.data.category,
    allAthlets: state.firestore.ordered.allAthlets,
    allTrainers: state.firestore.ordered.allTrainers,
    applications: state.firestore.ordered.applications,
    user: { userId, userName }
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect(props => {
    const { tournamentId, categoryId } = props.match.params;
    return [
      { collection: "tournaments", doc: tournamentId, storeAs: "tournament" },
      { collection: "categories", doc: categoryId, storeAs: "category" },
      { collection: "applications", where: [["tournamentId", "==", tournamentId]] },
      { collection: "athlets", storeAs: "allAthlets" },
      { collection: "trainers", storeAs: "allTrainers" }
    ];
  })
)(Page);

//return [{ collection: "athlets", where: [["createdBy.userId", "==", props.user.userId]] }];
