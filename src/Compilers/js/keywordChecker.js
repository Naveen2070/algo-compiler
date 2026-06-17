const { checkBuiltInFunctions } = require('./builtInChecker');

/**
 * Checks the given line for keywords and performs replacements.
 * @param {string} line - The line to check for keywords.
 * @param {object} currentFunction - The current function being defined.
 * @return {string} - The modified line with keywords replaced.
 */
function checkKeyword(line, currentFunction) {
  let checkedLine = line;

  // Check for function call
  const funcCallMatch = checkedLine.match(/^(\w+)\((.*)\)$/);
  if (funcCallMatch) {
    const [, functionName, args] = funcCallMatch;
    checkedLine = `${functionName}(${args});\n`; // Function call
  }

  // Check for Print statement
  const printMatch = checkedLine.match(/^Print\s*\(\s*(.+)\s*\)$/);
  if (printMatch) {
    const content = printMatch[1];
    checkedLine = `console.log(${content});\n`; // Print statement
  }

  // Handle Sync keyword
  checkedLine = checkedLine.replace(/\bSync\s+(\w+)/, 'await $1'); // Sync keyword

  // Check for keywords and perform replacements
  checkedLine = checkedLine.replace(
    /^(Const)\s+(\w+)\s*=\s*(.+)/,
    (match, keyword, variable, value) => {
      if (value === undefined) {
        console.error('Error: const declaration must be initialized.');
        return ''; // Return empty string to signify error
      }
      return `${keyword.toLowerCase()} ${variable} = ${value};\n`; // Const declaration
    }
  );

  checkedLine = checkedLine.replace(
    /^(Let)\s+(\w+)\s*(?:=\s*(.+))?/,
    (match, keyword, variable, value) => {
      if (value === undefined) {
        return `${keyword.toLowerCase()} ${variable};\n`; // Let declaration
      }
      return `${keyword.toLowerCase()} ${variable} = ${value};\n`; // Let declaration
    }
  );

  checkedLine = checkedLine.replace(
    /^For (\w+)\s+in\s+range\s+(.+)/,
    (match, variable, range) => {
      return `for (let ${variable} = 0; ${variable} < ${range}; ${variable}++) {\n`; // For loop
    }
  );

  checkedLine = checkedLine.replace(/^While\s+(.+)/, (match, condition) => {
    return `while (${condition}) {\n`; // While loop
  });

  checkedLine = checkedLine.replace(/^If\s+(.+)/, (match, condition) => {
    return `if (${condition}) {\n`; // If statement
  });

  checkedLine = checkedLine.replace(/^Else If\s+(.+)/, (match, condition) => {
    return `} else if (${condition}) {\n`; // Else If statement
  });

  checkedLine = checkedLine.replace(/^Else/, () => {
    return `} else {\n`; // Else statement
  });

  checkedLine = checkedLine.replace(/^Switch to\s+(\w+)/, (match, variable) => {
    return `switch (${variable}) {\n`; // Switch statement
  });

  checkedLine = checkedLine.replace(/^When\s+(.+)/, (match, condition) => {
    return `  case ${condition}:\n`; // When statement
  });

  checkedLine = checkedLine.replace(/^Usually\s+(.+)/, (match, expression) => {
    return `  default:\n    ${expression}\n`; // Usually statement
  });

  checkedLine = checkedLine.replace(/^Stop/, () => {
    return `break;\n`; // Stop statement
  });

  checkedLine = checkedLine.replace(/^Return\s+(.+)/, (match, value) => {
    if (currentFunction.name) {
      return `    return ${value};\n`; // Return statement within a function
    } else {
      return `return ${value};\n`; // Return statement outside a function
    }
  });

  // Check for Export keyword
  if (checkedLine.startsWith('Export')) {
    const functionName = line
      .substring(line.indexOf(' ') + 1)
      .trim()
      .replace(/\(.*\)/, ''); // Remove parentheses and parameters
    return `module.exports = { ${functionName || 'main'} };\n`; // Export statement
  }

  // Check for Import keyword
  if (checkedLine.startsWith('Import')) {
    const [keyword, functionName, , modulePath] = line.split(/\s+/);
    const importPath = modulePath.replace(/\/?$/, ''); // Remove trailing slash
    return `const { ${functionName} } = require('.${importPath}');\n`; // Import statement
  }

  return checkBuiltInFunctions(checkedLine); // Send the reconstructed code to the built-in checker
}

module.exports = { checkKeyword };
