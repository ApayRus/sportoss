export function categoryName(category) {
  const { gender, minAge, maxAge, minWeight, maxWeight } = category;
  const name = `${gender}, ${minAge}-${maxAge} лет, ${minWeight}-${maxWeight}`;
  return name;
}

export function athletName(athlet) {
  const { familyName, firstName, fatherName } = athlet;
  const name = `${familyName} ${firstName} ${fatherName}`;
  return name;
}
