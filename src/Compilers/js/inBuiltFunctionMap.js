const { splitArrayAtFirstComma } = require('../../util/commonCheckers');

/**
 * Converts a mathematical function to its JavaScript equivalent.
 *
 * @param {string} funcName - The name of the mathematical function.
 * @param {string} args - The arguments of the function.
 * @return {string} The JavaScript equivalent of the mathematical function.
 */
function convertMathFunction(funcName, args) {
  // Map of mathematical functions to their JavaScript equivalents.
  const jsFunction = {
    'Round up': 'Math.ceil', // Rounds up to the nearest integer.
    Random: 'Math.random', // Returns a random number between 0 and 1.
    'Round down': 'Math.floor', // Rounds down to the nearest integer.
    Round: 'Math.round', // Rounds to the nearest integer.
    'Absolute value': 'Math.abs', // Returns the absolute value of a number.
    Exponential: 'Math.exp', // Returns the exponential value of a number.
    'Natural logarithm': 'Math.log', // Returns the natural logarithm of a number.
    'Base 10 logarithm': 'Math.log10', // Returns the base 10 logarithm of a number.
    Minimum: 'Math.min', // Returns the minimum value of a set of numbers.
    Maximum: 'Math.max', // Returns the maximum value of a set of numbers.
    'Power of': 'Math.pow', // Returns the value of a number raised to a power.
    Root: 'Math.sqrt', // Returns the square root of a number.
  }[funcName];

  // Return the JavaScript equivalent of the mathematical function with the arguments.
  return `${jsFunction}(${args.trim()})`;
}

/**
 * Converts a unary function to its JavaScript equivalent.
 *
 * @param {string} funcName - The name of the unary function.
 * @param {string} args - The arguments of the function.
 * @return {string} The JavaScript equivalent of the unary function.
 */
function convertUnaryFunction(funcName, args) {
  // Map of unary functions to their JavaScript equivalents.
  const jsFunction = {
    Increment: '++', // Increments the value by 1.
    Decrement: '--', // Decrements the value by 1.
  }[funcName];

  // Return the JavaScript equivalent of the unary function with the arguments.
  return `${args.trim()}${jsFunction}`;
}

/**
 * Converts a string function to its JavaScript equivalent.
 *
 * @param {string} funcName - The name of the string function.
 * @param {string} args - The arguments of the function.
 * @return {string} The JavaScript equivalent of the string function.
 */
function convertStringFunction(funcName, args) {
  // Map of string functions to their JavaScript equivalents.
  switch (funcName) {
    // Converts all characters to uppercase.
    case 'To Uppercase':
      return `${args.trim()}.toUpperCase()`;
    // Converts all characters to lowercase.
    case 'To Lowercase':
      return `${args.trim()}.toLowerCase()`;
    // Extracts a section of a string.
    case 'Substring':
      const [string, start, end] = args.split(',');
      return `${string.trim()}.substring(${start.trim()}, ${end.trim()})`;
    // Returns the length of a string.
    case 'String Length':
      return `${args.trim()}.length`;
    // Returns the character at a specified index in a string.
    case 'Char At':
      const [charAtString, charIndex] = args.split(',');
      return `${charAtString.trim()}.charAt(${charIndex.trim()})`;
    // Returns the Unicode of the character at the specified index in a string.
    case 'Char Code At':
      const [charCodeAtString, index] = args.split(',');
      return `${charCodeAtString.trim()}.charCodeAt(${index.trim()})`;
    // Returns the character at a specified index in a string.
    case 'At':
      const [atString, pos] = args.split(',');
      return `${atString.trim()}[${pos.trim()}]`;
    // Returns the index of the first occurrence of a specified value in a string.
    case 'Index of':
      const [indexOfString, searchValue] = args.split(',');
      return `${indexOfString.trim()}.indexOf(${searchValue.trim()})`;
    // Returns the index of the last occurrence of a specified value in a string.
    case 'Last Index of':
      const [lastIndexOfString, lastSearchValue] = args.split(',');
      return `${lastIndexOfString.trim()}.lastIndexOf(${lastSearchValue.trim()})`;
    // Checks if a string starts with the specified value.
    case 'Starts with':
      const [startsWithString, searchString] = args.split(',');
      return `${startsWithString.trim()}.startsWith(${searchString.trim()})`;
    // Checks if a string ends with the specified value.
    case 'Ends with':
      const [endsWithString, endsWithStringValue] = args.split(',');
      return `${endsWithString.trim()}.endsWith(${endsWithStringValue.trim()})`;
    // Replaces a specified value with another value in a string.
    case 'Replace':
      const [replaceString, searchValueReplace, replaceWithValue] =
        args.split(',');
      return `${replaceString.trim()}.replace(${searchValueReplace.trim()}, ${replaceWithValue.trim()})`;
    // Splits a string into an array of substrings.
    case 'Split':
      const params = args.split('');
      const [splitString, splitDelimiter] = splitArrayAtFirstComma(params);
      return `${splitString.trim()}.split(${splitDelimiter.trim()})`;
    // Returns a new string with the specified string concatenated to it.
    case 'Concat':
      const [string1, string2] = args.split(',');
      return `${string1.trim()}.concat(${string2.trim()})`;
    // Checks if a string contains the specified value.
    case 'Includes':
      const [includesString, searchStringInclude] = args.split(',');
      return `${includesString.trim()}.includes(${searchStringInclude.trim()})`;
    // Extracts a section of a string.
    case 'Slice':
      const [sliceString, startSlice, endSlice] = args.split(',');
      return `${sliceString.trim()}.slice(${startSlice.trim()}, ${endSlice.trim()})`;
    // Extracts a section of a string.
    case 'Substr':
      const [substrString, startSubstr, lengthSubstr] = args.split(',');
      return `${substrString.trim()}.substr(${startSubstr.trim()}, ${lengthSubstr.trim()})`;
    // Adds padding to the start of a string.
    case 'Pad Start':
      const [padStartString, targetLength, padStringStart] = args.split(',');
      return `${padStartString.trim()}.padStart(${targetLength.trim()}, ${padStringStart.trim()})`;
    // Adds padding to the end of a string.
    case 'Pad End':
      const [padEndString, targetLengthEnd, padStringEnd] = args.split(',');
      return `${padEndString.trim()}.padEnd(${targetLengthEnd.trim()}, ${padStringEnd.trim()})`;
    // Repeats a string a specified number of times.
    case 'Repeat':
      const [repeatString, countRepeat] = args.split(',');
      return `${repeatString.trim()}.repeat(${countRepeat.trim()})`;
    // Replaces all occurrences of a specified value in a string.
    case 'Replace All':
      const [replaceAllString, searchValueReplaceAll, replaceWithValueAll] =
        args.split(',');
      return `${replaceAllString.trim()}.replaceAll(${searchValueReplaceAll.trim()}, ${replaceWithValueAll.trim()})`;
    // Removes whitespace from the start of a string.
    case 'Trim Start':
      return `${args.trim()}.trimStart()`;
    // Removes whitespace from the end of a string.
    case 'Trim End':
      return `${args.trim()}.trimEnd()`;
    // Removes whitespace from both ends of a string.
    case 'Trim':
      return `${args.trim()}.trim()`;
    default:
      return '';
  }
}

/**
 * Function to convert built-in array methods to their JavaScript equivalents
 *
 * @param {string} funcName - The name of the array function
 * @param {string} args - The arguments of the function
 * @return {string} The JavaScript equivalent of the array function
 */
function convertArrayFunction(funcName, args) {
  // Parse the string arguments into an array
  const argArray = args.split(',').map((arg) => arg.trim());

  switch (funcName) {
    // Adds elements to the end of an array
    case 'Push Last':
      return `${argArray[0]}.push(${argArray.slice(1).join(', ')})`;
    // Removes the last element from an array and returns it
    case 'Pop Last':
      return `${argArray[0]}.pop()`;
    // Removes the first element from an array and returns it
    case 'Pop First':
      return `${argArray[0]}.shift()`;
    // Adds elements to the beginning of an array
    case 'Push First':
      return `${argArray[0]}.unshift(${argArray.slice(1).join(', ')})`;
    // Extracts a section of an array and returns a new array
    case 'Slice':
      return `${argArray[0]}.slice(${argArray.slice(1).join(', ')})`;
    // Changes the contents of an array by removing or replacing existing elements
    case 'Splice':
      return `${argArray[0]}.splice(${argArray.slice(1).join(', ')})`;
    // Combines two or more arrays and returns a new array
    case 'Concat':
      return `${argArray[0]}.concat(${argArray.slice(1).join(', ')})`;
    // Joins all elements of an array into a string
    case 'Join':
      const [argsString, argsDelimiter] = splitArrayAtFirstComma(
        args.split('')
      );
      return `${argsString}.join(${argsDelimiter})`;
    // Reverses the order of the elements in an array
    case 'Reverse':
      return `${argArray[0]}.reverse()`;
    // Sorts the elements of an array in place and returns the sorted array
    case 'Sort':
      return `${argArray[0]}.sort(${argArray.slice(1).join(', ')})`;
    // Returns the first index at which a given element can be found in the array,
    // or -1 if it is not present
    case 'IndexOf':
      return `${argArray[0]}.indexOf(${argArray.slice(1).join(', ')})`;
    // Returns the last index at which a given element can be found in the array,
    // or -1 if it is not present
    case 'Last Index Of':
      return `${argArray[0]}.lastIndexOf(${argArray.slice(1).join(', ')})`;
    // Returns true if the array contains a given element, and false otherwise
    case 'Includes':
      return `${argArray[0]}.includes(${argArray.slice(1).join(', ')})`;
    // Tests whether all elements in the array pass the provided testing function
    case 'Every':
      return `${argArray[0]}.every(${argArray.slice(1).join(', ')})`;
    // Tests whether at least one element in the array passes the provided testing function
    case 'Some':
      return `${argArray[0]}.some(${argArray.slice(1).join(', ')})`;
    // Creates a new array with all elements that pass the provided testing function
    case 'Filter':
      return `${argArray[0]}.filter(${argArray.slice(1).join(', ')})`;
    // Calls a provided function on every element in the array and returns a new array
    case 'Map':
      return `${argArray[0]}.map(${argArray.slice(1).join(', ')})`;
    // Calls a provided function once for each array element
    case 'ForEach':
      return `${argArray[0]}.forEach(${argArray.slice(1).join(', ')})`;
    // Reduces the array to a single value
    case 'Reduce':
      return `${argArray[0]}.reduce(${argArray.slice(1).join(', ')})`;
    // Reduces the array to a single value, going in reverse order
    case 'Reduce Right':
      return `${argArray[0]}.reduceRight(${argArray.slice(1).join(', ')})`;
    // Finds the first element in an array that satisfies the provided testing function
    case 'Find':
      return `${argArray[0]}.find(${argArray.slice(1).join(', ')})`;
    // Finds the index of the first element in the array that satisfies the provided testing function
    case 'Find Index':
      return `${argArray[0]}.findIndex(${argArray.slice(1).join(', ')})`;
    default:
      return '';
  }
}

module.exports = {
  convertMathFunction,
  convertUnaryFunction,
  convertStringFunction,
  convertArrayFunction,
};
