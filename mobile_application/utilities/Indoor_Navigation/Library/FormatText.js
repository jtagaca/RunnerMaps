const buildText = (card, index, sorted_shortest_path, type) => {
  let textElement = "";
  let additionalText = "";

  if (type === "noImage") {
    if (
      card.userDirection &&
      card.userDirection != null &&
      card.userDirection != ""
    ) {
      textElement = card.userDirection.toUpperCase();
      if (card.userDirection !== "enter") {
        textElement = `${
          card.userDirection == "keep straight" ? "" : "TURN"
        } ${card.userDirection.toUpperCase()}`;
      }

      if (card.is_outside && card.is_outside !== false) {
        additionalText = "YOU ARE OUTSIDE, FOLLOW THE ROAD PATH";
      } else {
        additionalText = "IN THE HALLWAY";
      }

      return `${textElement}\n${additionalText}`;
    }
  } else {
    if (card.locationName && card.locationName != null) {
      if (index === 0) {
        return `START LOCATION ${card.locationName.toUpperCase()}`;
      }

      if (index === sorted_shortest_path.length - 1) {
        return `DESTINATION LOCATION ${card.locationName.toUpperCase()}`;
      }

      if (
        card.userDirection === "enter" ||
        card.locationName === "elevator" ||
        card.locationName === "stairs"
      ) {
        return `ENTER ${card.locationName.toUpperCase()}`;
      }
    }
  }

  return "";
};

export { buildText };
