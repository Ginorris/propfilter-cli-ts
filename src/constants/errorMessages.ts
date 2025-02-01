const CSV_FORMAT_EXAMPLE = `
squareFootage,lighting,price,rooms,bathrooms,location,description,amenities
4485,medium,470155,2,1,"(-7.25056, -56.540592)",House with renovated kitchen,"{'garage': false, 'pool': false, 'garden': false, 'fireplace': false, 'basement': true}"
`;

const JSON_FORMAT_EXAMPLE = `
[{
  "squareFootage":4485,
  "lighting":"medium",
  "price":470155,
  "rooms":2,
  "bathrooms":1,
  "location":[-7.25056, -56.540592],
  "description":"House with renovated kitchen",
  "amenities":{
      "garage":false,
      "pool":false,
      "garden":false,
      "fireplace":false,
      "basement":true
  }
}]
`;

export function csvErrorMessage(err: string) {
  return `Failed to parse CSV. Please ensure it’s valid. Example:${CSV_FORMAT_EXAMPLE}\nOriginal error: ${err}`;
}

export function jsonErrorMessage(err: string) {
  return `Failed to parse JSON. Please ensure it’s valid. Example:${JSON_FORMAT_EXAMPLE}\nOriginal error: ${err}`;
}
