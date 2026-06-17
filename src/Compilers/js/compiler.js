const fs = require('fs');
const { processFunction, importChecker } = require('./processCode');
const path = require('path');
const os = require('os');

/**
 * Helper function to format the local timestamp
 * @returns {string} - The formatted timestamp string
 */
function getLocalTimestamp() {
  // Get the current date and time
  const now = new Date();

  // Define the options for formatting the timestamp
  const options = {
    year: 'numeric', // Format the year as a four-digit number
    month: '2-digit', // Format the month as a two-digit number (01-12)
    day: '2-digit', // Format the day as a two-digit number (01-31)
    hour: '2-digit', // Format the hour as a two-digit number (00-23)
    minute: '2-digit', // Format the minute as a two-digit number (00-59)
    second: '2-digit', // Format the second as a two-digit number (00-59)
    hour12: true, // Format the hour in 12-hour format
  };

  // Format the timestamp string according to the options
  return now.toLocaleString('en-GB', options);
}

/**
 * Compiles the given code to JavaScript and performs the specified output action.
 * @param {string} code - The code to compile.
 * @param {string} outputType - The type of output action to perform.
 * @param {string} fileName - The name of the output file (optional).
 * @param {string} filePath - The path of the input file.
 * @param {string} directory - The current directory.
 * @param {object} config - The configuration object.
 */
function compileToJs(code, outputType, fileName, filePath, directory, config) {
  // Split the code into lines and trim each line
  const lines = code.split('\n');
  let jsCode = '';
  for (let line of lines) {
    line = line.trim();
    jsCode += processFunction(line, { name: '', params: [] });
  }

  // Add import statements to the JavaScript code
  jsCode = importChecker(jsCode, config, outputType);

  // Prepare the log data object
  const logData = {
    timestamp: new Date().toISOString(),
    localTimestamp: getLocalTimestamp(),
    action: outputType === 'Convert' ? 'Conversion' : 'Execution',
    codeFileName: fileName || 'output',
    language: 'JavaScript',
    config: config,
    result: '',
    error: '',
  };

  // Perform the specified output action
  if (['Convert', 'convert', '1'].includes(outputType)) {
    // Generate the output file path
    const relativePath = path.relative(directory, filePath);
    const outFolder = config.OutFolder || 'output';
    const outputFolderPath = path.join(
      directory,
      outFolder,
      path.dirname(relativePath)
    );
    if (!fs.existsSync(outputFolderPath)) {
      fs.mkdirSync(outputFolderPath, { recursive: true });
    }
    const outputFile = path.parse(filePath);
    const outputFileName = path.join(outputFolderPath, `${outputFile.name}.js`);

    // Write the JavaScript code to the output file
    fs.writeFileSync(outputFileName, jsCode);
    logData.result = `JavaScript file generated: ${outputFileName}`;

    // Log the conversion to a file
    logToFile(logData);
  } else if (['Run', 'run', '2'].includes(outputType)) {
    // Generate the temporary file path
    const relativePath = path.relative(directory, filePath);
    const tempFolder = path.join(__dirname, 'temp', path.dirname(relativePath));
    if (!fs.existsSync(tempFolder)) {
      fs.mkdirSync(tempFolder, { recursive: true });
    }
    let tempFileName;
    if (fileName) {
      const outputFile = path.parse(fileName);
      tempFileName = path.join(tempFolder, `${outputFile.name}.js`);
    } else {
      tempFileName = path.join(tempFolder, `temp_${Date.now()}.js`);
    }

    // Write the JavaScript code to the temporary file
    fs.writeFileSync(tempFileName, jsCode);
    logData.tempFilePaths = [tempFileName];

    // Execute the temporary files
    executeTempFiles(logData.tempFilePaths, logData);
  }
}

/**
 * Logs the given data to a file in the log folder.
 * If the log folder does not exist, it will be created.
 * @param {Object} data - The data to be logged.
 */
function logToFile(data) {
  // Define the log folder path
  const logFolder = path.join(__dirname, 'log');

  // Create the log folder if it does not exist
  if (!fs.existsSync(logFolder)) {
    fs.mkdirSync(logFolder);
  }

  // Define the log file path
  const logFilePath = path.join(logFolder, 'log.json');

  // Read the existing log entries from the file
  let logEntries = [];
  if (fs.existsSync(logFilePath)) {
    const existingLogData = fs.readFileSync(logFilePath, 'utf-8');
    logEntries = JSON.parse(existingLogData);
  }

  // Add the new log entry to the existing log entries
  logEntries.push(data);

  // Write the updated log entries to the file
  fs.writeFileSync(logFilePath, JSON.stringify(logEntries, null, 2) + os.EOL);
}

/**
 * Recursively removes empty parent directories of the given directory.
 *
 * @param {string} directory - The directory whose parent directories to remove.
 */
function removeEmptyParentDirectories(directory) {
  // Get the parent directory of the given directory
  const parent = path.resolve(directory, '..');

  // Check if the directory exists and is empty
  if (
    directory !== __dirname && // Exclude the current directory
    fs.existsSync(directory) &&
    fs.readdirSync(directory).length === 0
  ) {
    // Remove the directory
    fs.rmdirSync(directory);

    // Recursively remove the parent directory if it is empty
    removeEmptyParentDirectories(parent);
  }
}

/**
 * Executes the first temporary file in the array of temporary file paths.
 * Writes the result, error, and logs to a file.
 *
 * @param {Array} tempFilePaths - An array of temporary file paths to execute.
 * @param {Object} logData - The log data object.
 */
function executeTempFiles(tempFilePaths, logData) {
  // Return if no temporary files to execute
  if (!tempFilePaths || tempFilePaths.length === 0) {
    console.error('No temporary files to execute.');
    return;
  }

  const { exec } = require('child_process');
  const tempFilePath = tempFilePaths[0]; // Ensure only the first file is executed

  // Execute the temporary file
  exec(`node ${tempFilePath}`, (error, stdout, stderr) => {
    // Handle errors
    if (error) {
      console.error(`Error executing code: ${error.message}`);
      logData.error = `Error executing code: ${error.message}`;
    } else if (stderr) {
      console.error(`Error output: ${stderr}`);
      logData.error = `Error output: ${stderr}`;
    } else {
      console.log('Result:', stdout);
      logData.result = stdout;
    }

    // Delete the temporary file and its parent directories
    try {
      fs.unlinkSync(tempFilePath);
      removeEmptyParentDirectories(path.dirname(tempFilePath));
    } catch (err) {
      console.error(`Error deleting temporary file: ${err.message}`);
    }

    // Log the data
    logToFile(logData);
  });
}

module.exports = { compileToJs };
