const fs = require('fs');
const path = require('path');

/**
 * Class representing a Link.
 */
class Link {
  /**
   * Create a Link.
   * @param {string} name - The name of the link.
   */
  constructor(name) {
    this.name = name;
    this.value = null;
    this.subscribers = [];
  }

  /**
   * Get the value of the link.
   * @returns {Promise<any>} - A promise that resolves to the value of the link.
   */
  async get() {
    if (this.value !== null) {
      return this.resolveValue();
    }

    const links = await loadLinks();
    if (links[this.name] && links[this.name].value !== null) {
      this.value = links[this.name].value;
      return this.resolveValue();
    }

    // Create a promise that resolves when the value is set
    return new Promise((resolve) => {
      this.subscribers.push(resolve);
    });
  }

  /**
   * Set the value of the link.
   * @param {any} newValue - The new value of the link.
   * @returns {Promise<void>} - A promise that resolves when the value is set.
   */
  async set(newValue) {
    this.value = newValue;
    this.subscribers.forEach((resolve) => resolve(this.resolveValue()));
    this.subscribers = []; // Clear subscribers after setting the value
    await this.save();
  }

  /**
   * Save the link to the file system.
   * @returns {Promise<void>} - A promise that resolves when the link is saved.
   */
  async save() {
    const links = await loadLinks();
    links[this.name] = {
      value: this.serializeValue(),
    };
    await saveLinks(links);
  }

  /**
   * Resolve the value of the link.
   * If the value is a function, it will be converted to a function.
   * @returns {any} - The resolved value of the link.
   */
  resolveValue() {
    if (typeof this.value === 'string' && this.value.startsWith('function:')) {
      const funcString = this.value.slice(9);
      return new Function('return ' + funcString)();
    }
    return this.value;
  }

  /**
   * Serialize the value of the link.
   * If the value is a function, it will be converted to a string.
   * @returns {string} - The serialized value of the link.
   */
  serializeValue() {
    if (typeof this.value === 'function') {
      return 'function:' + this.value.toString();
    }
    return this.value;
  }

  /**
   * Destroy the link and remove it from the registry.
   * @returns {Promise<void>} - A promise that resolves when the link is destroyed.
   */
  async destroy() {
    this.subscribers = [];
    this.value = null;
    delete linkRegistry[this.name];
    this.name = null;

    try {
      const links = await loadLinks();
      delete links[this.name];

      const hasLinks = Object.values(links).some(
        (link) => link !== null && link.value !== null
      );

      if (!hasLinks) {
        await fs.promises.unlink(getFilePath());
      } else {
        await saveLinks(links);
      }
    } catch (error) {
      console.error('Error while destroying link:', error);
    }
  }
}

// Global registry of links
const linkRegistry = {};

/**
 * Create a new Link and add it to the global registry.
 *
 * If a Link with the same name already exists, it will return the existing Link.
 *
 * @param {string} name - The name of the Link.
 * @returns {Link} The newly created or existing Link.
 */
async function createLink(name) {
  // Check if a Link with the same name already exists
  if (linkRegistry[name]) {
    console.warn(`Link with name "${name}" already exists.`);
    return linkRegistry[name];
  }
  // Create a new Link
  const link = new Link(name);
  // Add the Link to the global registry
  linkRegistry[name] = link;
  // Save the Link to the file system
  await link.save(); // Save the link when it's created
  return link;
}

/**
 * Load the Links from the file system and return them as an object.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object with the Links.
 */
async function loadLinks() {
  const filePath = getFilePath();
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const data = await fs.promises.readFile(filePath, 'utf-8');
  return decodeLinks(data);
}

/**
 * Get a Link by its name.
 *
 * If the Link already exists in the global registry, it is returned.
 * If the Link exists in the file system, it is loaded and returned.
 * If the Link does not exist anywhere, null is returned.
 *
 * @param {string} name - The name of the Link.
 * @returns {Promise<Link|null>} - A promise that resolves to the Link if it exists, or null if it doesn't.
 */
async function getLink(name) {
  // Check if the Link already exists in the global registry
  if (linkRegistry[name]) {
    return linkRegistry[name];
  }

  // Load the Links from the file system
  const links = await loadLinks();

  // Check if the Link exists in the file system
  if (links[name]) {
    // Create a new Link object
    const link = new Link(name);
    // Set the value of the Link
    link.value = links[name].value;
    // Add the Link to the global registry
    linkRegistry[name] = link;
    // Return the Link
    return link;
  }

  // Return null if the Link does not exist anywhere
  return null;
}

/**
 * Returns the file path for storing links.
 *
 * The file path is built using the current working directory and the folder structure
 * used by the AlgoSys system.
 *
 * @returns {string} - The file path for storing links.
 */
function getFilePath() {
  // Build the file path using the current working directory and the folder structure
  // used by the AlgoSys system.
  return path.join(
    process.cwd(), // Current working directory
    '.AlgoSys', // Folder name for AlgoSys system
    'main', // Folder name for the main program
    'bin', // Folder name for binaries
    'links.bin' // File name for links
  );
}

/**
 * Load the Links from the file system.
 *
 * @returns {Promise<Object>} - A promise that resolves to an object with the Links.
 *                            If the file does not exist, an empty object is returned.
 * @throws {Error} - If there is an error other than the file not existing.
 */
async function loadLinks() {
  const filePath = getFilePath(); // Get the file path

  try {
    // Read the file and decode the links
    const data = await fs.promises.readFile(filePath);
    return decodeLinks(data);
  } catch (error) {
    // Check if the error is due to the file not existing
    if (error.code === 'ENOENT') {
      return {}; // Return an empty object if the file does not exist
    }
    throw error; // Throw the error if it is not due to the file not existing
  }
}

/**
 * Save the Links to the file system.
 *
 * @param {Object} links - The Links object to save.
 * @returns {Promise<void>} - A promise that resolves when the Links are saved.
 */
async function saveLinks(links) {
  // Get the file path for the Links
  const filePath = getFilePath();

  // Encode the Links object into a string
  const data = encodeLinks(links);

  // Create the parent directory of the file path if it does not exist
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

  // Write the encoded Links to the file
  await fs.promises.writeFile(filePath, data);
}

/**
 * Encodes the Links object into a string and returns it as a hexadecimal string.
 *
 * @param {Object} links - The Links object to encode.
 * @return {string} The encoded Links object as a hexadecimal string.
 */
function encodeLinks(links) {
  // Convert the Links object to a JSON string
  const jsonString = JSON.stringify(links);

  // Convert the JSON string to a Buffer using UTF-8 encoding
  const buffer = Buffer.from(jsonString, 'utf8');

  // Convert the Buffer to a hexadecimal string
  return buffer.toString('hex');
}

/**
 * Decodes the given hexadecimal string into a Links object.
 *
 * @param {string} data - The hexadecimal string to decode.
 * @return {Object} The decoded Links object.
 */
function decodeLinks(data) {
  // Convert the hexadecimal string to a Buffer
  const buffer = Buffer.from(data.toString(), 'hex');

  // Convert the Buffer to a UTF-8 string
  const jsonString = buffer.toString('utf8');

  // Parse the JSON string into a Links object
  return JSON.parse(jsonString);
}

module.exports = {
  Link,
  createLink,
  getLink,
  loadLinks,
  saveLinks,
  encodeLinks,
  decodeLinks,
};
