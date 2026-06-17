const Snippets = {
  // Convert a fraction to a percentage
  fractionToPercentage: (numerator, denominator) => {
    if (denominator === 0) return 'Error: Division by zero';
    return (numerator / denominator) * 100 + '%';
  },

  // Convert a decimal to a percentage
  decimalToPercentage: (decimal) => {
    return decimal * 100 + '%';
  },

  // Calculate the percentage increase from old number to new number
  percentageIncrease: (oldNumber, newNumber) => {
    if (oldNumber === 0) return 'Error: Division by zero';
    return ((newNumber - oldNumber) / oldNumber) * 100 + '%';
  },

  // Calculate the percentage decrease from old number to new number
  percentageDecrease: (oldNumber, newNumber) => {
    if (oldNumber === 0) return 'Error: Division by zero';
    return ((oldNumber - newNumber) / oldNumber) * 100 + '%';
  },

  // Basic arithmetic operations
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => {
    if (b === 0) return 'Error: Division by zero';
    return a / b;
  },

  // Find the square root
  sqrt: (num) => Math.sqrt(num),

  // Calculate the power
  power: (base, exponent) => Math.pow(base, exponent),

  // Calculate the factorial of a number
  factorial: (num) => {
    if (num < 0) return 'Error: Negative number';
    if (num === 0) return 1;
    return num * Snippets.factorial(num - 1);
  },

  // Convert Celsius to Fahrenheit
  celsiusToFahrenheit: (celsius) => (celsius * 9) / 5 + 32,

  // Convert Fahrenheit to Celsius
  fahrenheitToCelsius: (fahrenheit) => ((fahrenheit - 32) * 5) / 9,

  // Convert meters to feet
  metersToFeet: (meters) => meters * 3.28084,

  // Convert feet to meters
  feetToMeters: (feet) => feet / 3.28084,

  // Convert kilograms to pounds
  kilogramsToPounds: (kilograms) => kilograms * 2.20462,

  // Convert pounds to kilograms
  poundsToKilograms: (pounds) => pounds / 2.20462,

  // Convert liters to gallons
  litersToGallons: (liters) => liters * 0.264172,

  // Convert gallons to liters
  gallonsToLiters: (gallons) => gallons / 0.264172,

  // Convert centimeters to inches
  centimetersToInches: (centimeters) => centimeters * 0.393701,

  // Convert inches to centimeters
  inchesToCentimeters: (inches) => inches / 0.393701,

  // Convert miles to kilometers
  milesToKilometers: (miles) => miles * 1.60934,

  // Convert kilometers to miles
  kilometersToMiles: (kilometers) => kilometers / 1.60934,

  // Convert square meters to square feet
  squareMetersToSquareFeet: (squareMeters) => squareMeters * 10.7639,

  // Convert square feet to square meters
  squareFeetToSquareMeters: (squareFeet) => squareFeet / 10.7639,

  // Convert cubic meters to cubic feet
  cubicMetersToCubicFeet: (cubicMeters) => cubicMeters * 35.3147,

  // Convert cubic feet to cubic meters
  cubicFeetToCubicMeters: (cubicFeet) => cubicFeet / 35.3147,

  // Convert grams to ounces
  gramsToOunces: (grams) => grams * 0.035274,

  // Convert ounces to grams
  ouncesToGrams: (ounces) => ounces / 0.035274,

  // Convert milliliters to fluid ounces
  millilitersToFluidOunces: (milliliters) => milliliters * 0.033814,

  // Convert fluid ounces to milliliters
  fluidOuncesToMilliliters: (fluidOunces) => fluidOunces / 0.033814,
};

module.exports = Snippets;
