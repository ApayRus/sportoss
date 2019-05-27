import groupBy from "lodash/groupBy";

/**
 * Gets applications of Tournament and returns Participans, grouped by Categories
 * @applications {array}
 */
export function participantsGroupedByCategories(applications) {
  let participants = {};
  applications.forEach(app => {
    participants = { ...participants, ...app.participants };
  });
  return groupBy(participants, "categoryId");
}
