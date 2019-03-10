export function categoryName(category) {
  const { id, gender, minAge, maxAge, minWeight, maxWeight } = category;
  const name = `${gender}, ${minAge}-${maxAge} лет, ${minWeight}-${maxWeight}`;
  return { id, name };
}
