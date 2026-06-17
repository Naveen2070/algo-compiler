/**
 * Function to check and replace core keywords
 *
 * @param {string} line - The line of code to be checked and replaced
 * @returns {string} - The modified line of code with the core replacements
 */
function CoreChecker(line) {
  // Check for New Link
  // Replace 'New Link("linkName")' with 'Links.createLink("linkName")'
  if (line.includes('New Link')) {
    return line.replace(
      /New Link\s*\(\s*["'](.+?)["']\s*\)/g,
      "Links.createLink('$1')"
    );
  }

  // Check for Link To
  // Replace 'Link To("linkName")' with 'Links.getLink("linkName")'
  if (line.includes('Link To')) {
    return line.replace(
      /Link To\s*\(\s*["'](.+?)["']\s*\)/g,
      "Links.getLink('$1')"
    );
  }

  // Check for Set Link
  // Replace 'Set Link(linkName, "value")' with 'linkName.set("value")'
  if (line.includes('Set Link')) {
    return line.replace(
      /Set Link\s*\(\s*(.+?)\s*,\s*["'](.+?)["']\s*\)/g,
      "$2.set('$1')"
    );
  }

  // Check for Get Link
  // Replace 'Get Link("linkName")' with 'linkName.get()'
  if (line.includes('Get Link')) {
    return line.replace(/Get Link\s*\(\s*["'](.+?)["']\s*\)/g, '$1.get()');
  }

  // Check for Unlink
  // Replace 'Unlink("linkName")' with 'linkName.destroy()'
  if (line.includes('Unlink')) {
    return line.replace(/Unlink\s*\(\s*["'](.+?)["']\s*\)/g, '$1.destroy()');
  }

  // Check for Create Thread
  // Replace 'Create Thread("threadName")' with 'new Threads("threadName")'
  if (line.includes('Create Thread')) {
    return line.replace(
      /Create Thread\s*\(\s*["'](.+?)["']\s*\)/g,
      "new Threads('$1')"
    );
  }

  // Check for Run Thread
  // Replace 'Run Thread("threadName") With ("threadArgs")' with 'await threadName.run("threadArgs")'
  if (line.includes('Run Thread')) {
    return line.replace(
      /Run Thread\s*\(\s*["'](.+?)["']\s*\)\s*With\s*\((.+?)\)/g,
      'await $1.run($2)'
    );
  }

  return line;
}

module.exports = { CoreChecker };
