/**
 * Represents an immutable stack data structure.
 * @class
 * @classdesc An immutable stack data structure.
 */
class ImmutableStack {
  /**
   * Creates an ImmutableStack.
   * @constructor
   * @param {Array} [items=[]] - The items to initialize the stack with.
   */
  constructor(items = []) {
    /**
     * The items stored in the stack.
     * @type {Array}
     * @private
     */
    this._items = items.slice(); // Create a shallow copy to ensure immutability
  }

  /**
   * Adds an item to the top of the stack.
   *
   * @param {*} item - The item to add to the stack.
   * @return {ImmutableStack} A new ImmutableStack with the item added to the top.
   */
  push(item) {
    // Create a new array with the current items and the new item.
    const newItems = this._items.concat(item);

    // Return a new ImmutableStack with the updated items.
    return new ImmutableStack(newItems);
  }

  /**
   * Removes the item at the top of the stack.
   *
   * @return {ImmutableStack} A new ImmutableStack with the top item removed.
   * @throws {Error} If the stack is empty.
   */
  pop() {
    if (this.isEmpty()) {
      throw new Error('Stack underflow');
    }
    const newItems = this._items.slice(0, -1); // Remove last item
    return new ImmutableStack(newItems); // Return a new ImmutableStack with updated items
  }

  /**
   * Retrieves the item at the top of the stack.
   *
   * @return {*} The item at the top of the stack.
   * @throws {Error} If the stack is empty.
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('Stack is empty');
    }
    return this._items[this._items.length - 1];
  }

  /**
   * Checks if the stack is empty.
   *
   * @return {boolean} True if the stack is empty, false otherwise.
   */
  isEmpty() {
    return this._items.length === 0;
  }

  /**
   * Converts the stack to an array.
   *
   * @return {Array} An array containing the items in the stack.
   */
  toArray() {
    return this._items.slice(); // Return a shallow copy
  }
}

/**
 * Represents an immutable queue data structure.
 * @class
 */
class ImmutableQueue {
  /**
   * Creates an ImmutableQueue.
   * @constructor
   * @param {Array} [items=[]] - The items to initialize the queue with.
   */
  constructor(items = []) {
    /**
     * The items stored in the queue.
     * @type {Array}
     * @private
     */
    this._items = items.slice(); // Create a shallow copy to ensure immutability
  }

  /**
   * Adds an item to the end of the queue.
   *
   * @param {*} item - The item to add to the queue.
   * @return {ImmutableQueue} A new ImmutableQueue with the item added to the end.
   */
  enqueue(item) {
    const newItems = this._items.concat(item);
    return new ImmutableQueue(newItems); // Return a new ImmutableQueue with updated items
  }

  /**
   * Removes the item at the front of the queue.
   *
   * @return {ImmutableQueue} A new ImmutableQueue with the item at the front removed.
   * @throws {Error} If the queue is empty.
   */
  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue underflow');
    }
    const newItems = this._items.slice(1); // Remove first item
    return new ImmutableQueue(newItems); // Return a new ImmutableQueue with updated items
  }

  /**
   * Retrieves the item at the front of the queue.
   *
   * @return {*} The item at the front of the queue.
   * @throws {Error} If the queue is empty.
   */
  peek() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty');
    }
    return this._items[0];
  }

  /**
   * Checks if the queue is empty.
   *
   * @return {boolean} True if the queue is empty, false otherwise.
   */
  isEmpty() {
    return this._items.length === 0;
  }

  /**
   * Converts the queue to an array.
   *
   * @return {Array} An array containing the items in the queue.
   */
  toArray() {
    return this._items.slice(); // Return a shallow copy
  }
}

/**
 * Represents a node in an immutable linked list.
 *
 * @param {*} value - The value stored in the node.
 * @param {ImmutableLinkedListNode} [next=null] - The next node in the linked list.
 */
class ImmutableLinkedListNode {
  /**
   * Creates a new ImmutableLinkedListNode.
   *
   * @param {*} value - The value stored in the node.
   * @param {ImmutableLinkedListNode} [next=null] - The next node in the linked list.
   */
  constructor(value, next = null) {
    /**
     * The value stored in the node.
     * @type {*}
     */
    this.value = value;

    /**
     * The next node in the linked list.
     * @type {ImmutableLinkedListNode}
     */
    this.next = next;
  }
}

/**
 * Represents an immutable linked list.
 */
class ImmutableLinkedList {
  /**
   * Creates a new ImmutableLinkedList.
   * @param {ImmutableLinkedListNode} [head=null] - The head node of the linked list.
   */
  constructor(head = null) {
    /**
     * The head node of the linked list.
     * @type {ImmutableLinkedListNode}
     */
    this.head = head;
  }

  /**
   * Prepends a new node with the given value to the linked list.
   * @param {*} value - The value of the new node.
   * @return {ImmutableLinkedList} - The new ImmutableLinkedList with the new node prepended.
   */
  prepend(value) {
    const newNode = new ImmutableLinkedListNode(value, this.head);
    return new ImmutableLinkedList(newNode);
  }

  /**
   * Appends a new node with the given value to the linked list.
   * @param {*} value - The value of the new node.
   * @return {ImmutableLinkedList} - The new ImmutableLinkedList with the new node appended.
   */
  append(value) {
    if (!this.head) {
      return new ImmutableLinkedList(new ImmutableLinkedListNode(value));
    }
    const newHead = new ImmutableLinkedListNode(
      this.head.value,
      this.head.next
    );
    let currentNewNode = newHead;
    let currentOldNode = this.head.next;

    while (currentOldNode) {
      currentNewNode.next = new ImmutableLinkedListNode(currentOldNode.value);
      currentNewNode = currentNewNode.next;
      currentOldNode = currentOldNode.next;
    }

    currentNewNode.next = new ImmutableLinkedListNode(value);
    return new ImmutableLinkedList(newHead);
  }

  /**
   * Deletes the first occurrence of the given value from the linked list.
   * @param {*} value - The value to delete.
   * @return {ImmutableLinkedList} - The new ImmutableLinkedList with the first occurrence of the value deleted.
   */
  delete(value) {
    if (!this.head) {
      return this;
    }
    if (this.head.value === value) {
      return new ImmutableLinkedList(this.head.next);
    }

    const newHead = new ImmutableLinkedListNode(
      this.head.value,
      this.head.next
    );
    let currentNewNode = newHead;
    let currentOldNode = this.head.next;

    while (currentOldNode) {
      if (currentOldNode.value === value) {
        currentNewNode.next = currentOldNode.next;
        break;
      }
      currentNewNode.next = new ImmutableLinkedListNode(currentOldNode.value);
      currentNewNode = currentNewNode.next;
      currentOldNode = currentOldNode.next;
    }

    return new ImmutableLinkedList(newHead);
  }

  /**
   * Converts the linked list to an array.
   * @return {Array} - An array containing the values of the linked list.
   */
  toArray() {
    const array = [];
    let current = this.head;
    while (current) {
      array.push(current.value);
      current = current.next;
    }
    return array;
  }
}

/**
 * ImmutableMap class that implements a read-only map with key-value pairs.
 */
class ImmutableMap {
  /**
   * Creates an ImmutableMap.
   * @constructor
   * @param {Array} [entries=[]] - The entries to initialize the map with.
   */
  constructor(entries = []) {
    this._entries = entries.slice(); // Create a shallow copy to ensure immutability
  }

  /**
   * Sets the value for the specified key.
   * @param {*} key - The key to set the value for.
   * @param {*} value - The value to set.
   * @return {ImmutableMap} - A new ImmutableMap with the updated entries.
   */
  set(key, value) {
    const updatedEntries = this._entries.filter(([k]) => k !== key);
    updatedEntries.push([key, value]);
    return new ImmutableMap(updatedEntries); // Return a new ImmutableMap with updated entries
  }

  /**
   * Gets the value for the specified key.
   * @param {*} key - The key to get the value for.
   * @return {*} - The value associated with the key, or undefined if the key does not exist.
   */
  get(key) {
    const entry = this._entries.find(([k]) => k === key);
    return entry ? entry[1] : undefined;
  }

  /**
   * Deletes the entry for the specified key.
   * @param {*} key - The key to delete the entry for.
   * @return {ImmutableMap} - A new ImmutableMap with the updated entries.
   */
  delete(key) {
    const updatedEntries = this._entries.filter(([k]) => k !== key);
    return new ImmutableMap(updatedEntries); // Return a new ImmutableMap with updated entries
  }

  /**
   * Checks if the map has an entry for the specified key.
   * @param {*} key - The key to check.
   * @return {boolean} - True if the map has an entry for the key, false otherwise.
   */
  has(key) {
    return this._entries.some(([k]) => k === key);
  }

  /**
   * Converts the map to an array of key-value pairs.
   * @return {Array} - An array containing the key-value pairs of the map.
   */
  toArray() {
    return this._entries.slice(); // Return a shallow copy
  }
}

/**
 * Represents an immutable set data structure.
 * @class
 */
class ImmutableSet {
  /**
   * Creates an ImmutableSet.
   * @constructor
   * @param {Array} [items=[]] - The items to initialize the set with.
   */
  constructor(items = []) {
    /**
     * The items stored in the set.
     * @type {Array}
     * @private
     */
    this._items = Array.from(new Set(items)); // Convert to Set to ensure uniqueness
  }

  /**
   * Adds an item to the set.
   * @param {*} item - The item to add to the set.
   * @return {ImmutableSet} - A new ImmutableSet with the item added.
   */
  add(item) {
    const newItems = Array.from(new Set(this._items.concat(item)));
    return new ImmutableSet(newItems); // Return a new ImmutableSet with updated items
  }

  /**
   * Deletes the specified item from the set.
   * @param {*} item - The item to delete from the set.
   * @return {ImmutableSet} - A new ImmutableSet with the item removed.
   */
  delete(item) {
    const newItems = this._items.filter((x) => x !== item);
    return new ImmutableSet(newItems); // Return a new ImmutableSet with updated items
  }

  /**
   * Checks if the set contains the specified item.
   * @param {*} item - The item to check for.
   * @return {boolean} - True if the set contains the item, false otherwise.
   */
  has(item) {
    return this._items.includes(item);
  }

  /**
   * Converts the set to an array.
   * @return {Array} - An array containing the items of the set.
   */
  toArray() {
    return this._items.slice(); // Return a shallow copy
  }
}

module.exports = {
  ImmutableStack,
  ImmutableQueue,
  ImmutableLinkedList,
  ImmutableMap,
  ImmutableSet,
};
