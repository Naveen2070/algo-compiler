const { CoreChecker } = require('./coreChecker');
const { checkKeyword } = require('./keywordChecker');

/**
 * Processes a line of code and returns the corresponding JavaScript code.
 * This function handles function definitions, immediate function expressions,
 * function calls, and regular statements.
 *
 * @param {string} line - The line of code to be processed.
 * @param {Object} currentFunction - The current function object.
 * @param {string} currentFunction.name - The name of the current function.
 * @param {Array} currentFunction.params - The parameters of the current function.
 * @returns {string} - The corresponding JavaScript code.
 */
function processFunction(line, currentFunction) {
  // Check for Run keyword
  if (line.startsWith('Run')) {
    // Extract function name from the line
    const functionName = line
      .substring(line.indexOf(' ') + 1)
      .trim()
      .replace(/\(.*\)/, ''); // Remove parentheses and parameters
    // Convert the line into an Immediately Invoked Function Expression (IIFE)
    const params = line
      .match(/\((.*?)\)/)[1]
      .split(',')
      .map((param) => param.trim())
      .join(', ');
    // Return the IIFE code
    return `(function ${functionName || 'main'}(${params}) {\n`;
  }

  // Check for function definition
  const funcDefMatch = line.match(/^Start\s+(\w+)\s*\((.*)\)$/);
  if (funcDefMatch) {
    const [, functionName, params] = funcDefMatch;
    currentFunction.name = functionName;
    currentFunction.params = params.split(',').map((param) => param.trim());
    // Return the function definition code
    return `function ${functionName}(${params}) {\n`;
  }

  // Check for End of function
  if (line.startsWith('Ends')) {
    const toReturn = `})(${currentFunction.params.join(', ')});\n`;
    currentFunction.name = '';
    currentFunction.params = [];
    return toReturn;
  }

  // Check for End of IIFE
  if (line.startsWith('End')) {
    currentFunction.name = '';
    currentFunction.params = [];
    return '}\n';
  }

  // Check for Link keywords
  line = CoreChecker(line);

  // Check for async function definition
  line = processAsyncFunction(line, currentFunction);

  // Check for regular statements
  return checkKeyword(line, currentFunction);
}

/**
 * Processes a line of code and checks if it is a start of an async function.
 * If it is, it returns the corresponding JavaScript code for the async function.
 * If it is not, it returns the same line of code.
 *
 * @param {string} line - The line of code to be processed.
 * @param {Object} currentFunction - The current function object.
 * @param {string} currentFunction.name - The name of the current function.
 * @param {Array} currentFunction.params - The parameters of the current function.
 * @returns {string} - The corresponding JavaScript code or the same line of code.
 */
function processAsyncFunction(line, currentFunction) {
  // Check for function definition
  const funcDefMatch = line.match(/^Delay\s+(\w+)\s*\((.*)\)$/);
  if (funcDefMatch) {
    // Extract function name and parameters from the line
    const [, functionName, params] = funcDefMatch;
    currentFunction.name = functionName;
    currentFunction.params = params.split(',').map((param) => param.trim());
    // Return the JavaScript code for the async function
    return `async function ${functionName}(${params}) {\n`;
  }

  // Check for End of function
  if (line.startsWith('End')) {
    currentFunction.name = '';
    currentFunction.params = [];
    // Return the JavaScript code for the end of the async function
    return '}\n';
  }

  // Return the same line of code if it is not a start of an async function
  return line;
}

/**
 * Checks the code for "Use" statements and generates the corresponding import statements.
 * Removes the "Use" statements from the code and prepends the generated import statements.
 *
 * @param {string} code - The code to be processed.
 * @param {Object} config - The configuration object.
 * @param {string} config.Mode - The mode of the configuration.
 * @param {string|number} outputType - The type of output.
 * @returns {string} - The processed code with import statements.
 */
function importChecker(code, config, outputType) {
  const lines = code.split('\n');
  let useStatements = []; // Array to store the types of "Use" statements found
  const isProduction = config.Mode === 'Production';
  const isRun =
    outputType.toString() === '2' ||
    outputType.toString() === 'Run' ||
    outputType.toString() === 'run';

  // Check for existing imports and keywords in the code
  for (const line of lines) {
    // Check if the line starts with "Use "
    if (line.startsWith('Use ')) {
      // Extract the "Use" statement types and split by comma
      const modules = line.substring('Use '.length).trim().split(',');
      // Map each module, trim it, and add it to the useStatements array
      useStatements = useStatements.concat(
        modules.map((module) => module.trim())
      );
    }
  }

  // Prepare the import statements based on the "Use" statements found
  let importStatements = '';

  // If "ADS" is included in the useStatements
  if (useStatements.includes('ADS')) {
    importStatements +=
      // Generate the import statement based on the configuration
      isProduction && !isRun
        ? `const ADS = require('alg-compiler/core/ADS/ADS');\n`
        : !isProduction && isRun
        ? `const ADS = require('../Core/ADS/ADS');\n`
        : `const ADS = require('../../src/Compilers/js/Core/ADS/ADS');\n`;
  }

  // If "Threads" is included in the useStatements
  if (useStatements.includes('Threads')) {
    importStatements +=
      // Generate the import statement based on the configuration
      isProduction && !isRun
        ? `const Threads = require('alg-compiler/core/Process/Threads');\n`
        : !isProduction && isRun
        ? `const Threads = require('../Core/Process/Threads');\n`
        : `const Threads = require('../../src/Compilers/js/Core/Process/Threads');\n`;
  }

  // If "Links" is included in the useStatements
  if (useStatements.includes('Links')) {
    importStatements +=
      // Generate the import statement based on the configuration
      isProduction && !isRun
        ? `const Links = require('alg-compiler/core/State/Link');\n`
        : !isProduction && isRun
        ? `const Links = require('../Core/State/Link');\n`
        : `const Links = require('../../src/Compilers/js/Core/State/Link');\n`;
  }

  // Remove the "Use" statements from the lines
  const filteredLines = lines.filter((line) => !line.startsWith('Use '));

  // Prepend the generated import statements to the filtered lines of code
  const processedCode = importStatements + filteredLines.join('\n');
  return processedCode;
}

module.exports = { processFunction, importChecker, processAsyncFunction };
