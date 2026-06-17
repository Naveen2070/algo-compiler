/**
 * Splits an array at the first occurrence of a comma and returns the parts as an array.
 * If no comma is found, returns null.
 *
 * @param {Array} arr - The array to split.
 * @return {Array|null} An array with the two parts, or null if no comma was found.
 */
function splitArrayAtFirstComma(arr) {
  // Find the index of the first comma in the array
  const commaIndex = arr.indexOf(',');

  // If no comma is found, return null
  if (commaIndex === -1) {
    return null;
  }

  // Split the array into two parts using the comma index
  const firstHalf = arr.slice(0, commaIndex).join('');
  const secondHalf = arr.slice(commaIndex + 1).join('');

  // Return the two parts as an array
  return [firstHalf, secondHalf];
}

module.exports = { splitArrayAtFirstComma };
