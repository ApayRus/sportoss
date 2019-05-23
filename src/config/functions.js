export function categoryName(category) {
  const { gender, minAge, maxAge, weight } = category;
  const name = `${gender}, ${minAge}-${maxAge} лет, ${weight}`;
  return name;
}

export function athletName(athlet) {
  const { familyName, firstName, fatherName } = athlet;
  const name = `${familyName} ${firstName} ${fatherName}`;
  return name;
}

export function trainerName(trainer) {
  const { familyName, firstName, fatherName } = trainer;
  const name = `${familyName} ${firstName} ${fatherName}`;
  return name;
}

export function tournamentName(tournament) {
  const { name, date, address } = tournament;
  return `${name}, ${date}, ${address}`;
}
