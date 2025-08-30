export const capitalizeName = (name: string) => {
  const nameArray = name.split("");
  const firstLetter = nameArray[0];
  const restOfName = nameArray.slice(1).join("");
  const formattedName = `${firstLetter.toUpperCase()}${restOfName}`;
  return formattedName;
};
