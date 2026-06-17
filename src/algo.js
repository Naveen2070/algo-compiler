#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const { compileToJs } = require('./Compilers/js/compiler');
const packageJson = require('../package.json');

/**
 * Reads the configuration from the config.lang file in the specified directory.
 * If the file does not exist, it uses default values.
 * @param {string} directory - The directory containing the config.lang file.
 * @param {function} callback - The callback function to be called with the config object.
 */
function readConfig(directory, callback) {
  // Path to the config.lang file
  const configPath = path.join(directory, 'config.lang');

  // Read the config file
  fs.readFile(configPath, 'utf8', (err, data) => {
    if (err) {
      // If the file does not exist, use default values
      if (err.code === 'ENOENT') {
        callback({
          Language: 'JavaScript', // Default language
          Format: 'js', // Default format
          Version: 'default', // Default version
          OutFolder: 'output', // Default output folder
          Mode: 'Production', // Default mode
          EntryPoint: 'main.alg', // Default entry point
        });
      } else {
        // If there is an error reading the file, log it
        console.error('Error reading config file:', err);
      }
      return;
    }

    // Parse the config file
    const config = {};
    data
      .trim()
      .split('\n')
      .forEach((line) => {
        const [key, value] = line.split('=');
        config[key.trim()] = value.trim();
      });

    // Call the callback function with the config object
    callback(config);
  });
}

/**
 * Recursively finds all .alg files in a directory and its subdirectories
 * @param {string} directory - The directory to search for .alg files
 * @param {function} callback - The callback function to be called with the path of each .alg file
 */
function findAllAlgFiles(directory, callback) {
  // Read the contents of the directory
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    // Iterate over each file in the directory
    files.forEach((file) => {
      const filePath = path.join(directory, file.name);

      if (file.isDirectory()) {
        // If the file is a directory, recursively search within it
        if (file.name !== 'output' && file.name !== 'OutFolder') {
          findAllAlgFiles(filePath, callback);
        }
      } else if (file.isFile() && file.name.endsWith('.alg')) {
        // If the file is a .alg file, call the callback function with its path
        callback(filePath);
      }
    });
  });
}

/**
 * Process all .alg files in a directory and its subdirectories based on the specified action.
 * @param {string} directory - The directory to search for .alg files
 * @param {string} action - The action to perform on each .alg file ('Convert' or 'Run')
 */
function processFiles(directory, action) {
  console.log(directory);
  // Read the configuration from the config.lang file in the specified directory
  readConfig(directory, (config) => {
    const language = String(config.Language);

    // Recursively find all .alg files in the directory and its subdirectories
    findAllAlgFiles(directory, (filePath) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error('Error reading file:', err);
          return;
        }

        if (language.toLowerCase() === 'javascript') {
          // Compile the .alg file to JavaScript based on the specified action
          compileToJs(
            data,
            action,
            path.basename(filePath, '.alg'),
            filePath,
            directory,
            config
          );
        } else if (language.toLowerCase() === 'under-work') {
          // Compile the .alg file to Python (currently not implemented)
          compileToPython(
            data,
            outputType,
            path.basename(filePath, '.alg'),
            config
          );
        } else {
          console.error('Unsupported language:', config.Language);
        }
      });
    });
  });
}

// Command definitions
program
  .command('clean')
  .description('Delete log and temp folders in compilers directory')
  .action(() => {
    cleanCompilersDirectory();
  });

program
  .command('run')
  .description('Compile and execute the .alg files.')
  .action(() => {
    const directory = process.cwd();
    processFiles(directory, 'Run');
  });

program
  .command('convert')
  .description('Compile and convert the .alg files.')
  .action(() => {
    const directory = process.cwd();
    processFiles(directory, 'Convert');
  });

program
  .version(`Algo-Compiler\nVersion: ${packageJson.version}`, '-v, --version')
  .arguments('<file>')
  .description('Compile and execute .alg files.')
  .action((file) => {
    const filePath = path.resolve(file);
    const directory = path.dirname(filePath);

    readConfig(directory, (config) => {
      const language = String(config.Language);

      /**
       * Prompts the user to select the mode (Convert or 1/Run or 2) and compiles
       * the .alg files based on the selected mode and language.
       *
       * @param {string} directory - The directory containing the .alg files
       * @param {function} callback - The callback function to be called with the
       * filePath of the .alg file
       */
      function promptUser() {
        // Prompt the user to select the mode (Convert or 1/Run or 2)
        const promptMessage = `Selected Language:${language}
Select Mode (Convert or 1/Run or 2): `;

        rl.question(promptMessage, (outputType) => {
          if (
            ['1', '2', 'Convert', 'convert', 'Run', 'run'].includes(outputType)
          ) {
            findAllAlgFiles(directory, (filePath) => {
              fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                  console.error('Error reading file:', err);
                  return;
                }

                // Compile the .alg file to JavaScript or Python based on the selected mode and language
                if (language.toLowerCase() === 'javascript') {
                  compileToJs(
                    data,
                    outputType,
                    path.basename(filePath, '.alg'),
                    filePath,
                    directory,
                    config
                  );
                } else if (language.toLowerCase() === 'under-work') {
                  compileToPython(
                    data,
                    outputType,
                    path.basename(filePath, '.alg'),
                    config
                  );
                } else {
                  console.error('Unsupported language:', config.Language);
                }
              });
            });
          } else {
            console.error(
              'Invalid option. Please select 1, 2, Convert, or Run.'
            );
            promptUser(); // Prompt again for valid input
          }
        });
      }

      promptUser();
    });
  })
  .on('--help', () => {
    console.log('');
    console.log('Examples:');
    console.log('  $ algo script.alg');
    console.log('  $ algo clean');
    console.log('  $ algo run');
    console.log('  $ algo convert');
    console.log('  $ algo --help');
    console.log('  $ algo -v');
  });

// Parse command line arguments
program.parse(process.argv);

/**
 * Cleans the Compilers directory by deleting the log and temp folders
 * in each compiler subdirectory.
 */
function cleanCompilersDirectory() {
  // Get the path to the Compilers directory
  const compilersDir = path.join(__dirname, 'Compilers');

  // Read the contents of the Compilers directory
  fs.readdir(compilersDir, (err, files) => {
    if (err) {
      console.error('Error reading compilers directory:', err);
      return;
    }

    // Iterate over each file in the Compilers directory
    files.forEach((compiler) => {
      // Get the path to the compiler subdirectory
      const compilerPath = path.join(compilersDir, compiler);

      // Check if the file is a directory
      if (
        fs.existsSync(compilerPath) &&
        fs.statSync(compilerPath).isDirectory()
      ) {
        // Get the paths to the log and temp folders in the compiler subdirectory
        const logFolder = path.join(compilerPath, 'log');
        const tempFolder = path.join(compilerPath, 'temp');

        // Delete the log and temp folders
        deleteFolder(logFolder);
        deleteFolder(tempFolder);
      }
    });
  });
}

/**
 * Deletes a folder and its contents recursively.
 * @param {string} folderPath - The path of the folder to delete.
 */
function deleteFolder(folderPath) {
  // Check if the folder exists
  if (fs.existsSync(folderPath)) {
    // Delete the folder and its contents recursively
    fs.rm(folderPath, { recursive: true }, (err) => {
      if (err) {
        // If there is an error, log it
        console.error(`Error deleting ${folderPath}:`, err);
      } else {
        // If the folder is successfully deleted, log it
        console.log(`Deleted ${folderPath}`);
      }
    });
  }
}
