const BASE_URL = "https://join-476d1-default-rtdb.firebaseio.com";


/**
 * Fetches all tasks from the Firebase database.
 * 
 * @returns {Object|null} A promise resolving to an object containing all tasks, or null if an error occurs.
 */
async function getAllTasks(){
  return getData("/tasks");
}


/**
 * Fetches data from a given Firebase path.
 * 
 * @param {string} path - The relative path in the Firebase database (e.g., "/tasks").
 * @returns {Object|null} A promise resolving to the data object or null if an error occurs.
 */
async function getData(path) {
  let fireBaseResponseAsJson = null;
  try {
    let fireBaseResponse = await fetch(BASE_URL + path + ".json");
    fireBaseResponseAsJson = await fireBaseResponse.json();
  }
  catch(error){
    console.error("getData: Error occured!");
    console.error(error);
  }
  return fireBaseResponseAsJson;
}


/**
 * Writes data to a specified path in the Firebase database.
 * Overwrites any existing data at that path.
 * 
 * @param {any} data - The data to be written.
 * @param {string} path - The relative path in the Firebase database.
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async function setData(data, path) {
  let response = null;
  try {
    response = await fetch(BASE_URL + path + ".json", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });    
  }
  catch (error){
    console.error("setData: Error occured! ");
    console.error(error);
    console.error(response);
  }
}


/**
 * Retrieves the current task counter from the database.
 * 
 * @returns {Promise<number>} The current value of the task counter.
 */
async function getTaskCounter(){
  return getData("/task_counter");
}


/**
 * Updates the task counter in the database with a new value.
 * 
 * @param {number} counter - The new counter value to be saved.
 * @returns {Promise<void>}
 */
async function setTaskCounter(counter){
  await setData(counter, "/task_counter");
}


/**
 * Increments the task counter by 1 based on the provided task ID.
 * 
 * @param {number} nextTaskId - The current task ID to increment from.
 * @returns {Promise<void>}
 */
async function increaseTaskCounter(nextTaskId){
  await setTaskCounter(nextTaskId+1);       
}


/**
 * Checks if a task with the given ID exists in the database.
 * Fetches all tasks before searching.
 * 
 * @param {number} taskId - The ID of the task to look for.
 * @returns {Promise<boolean>} True if the task exists, false otherwise.
 */
async function getTaskFromDB(taskId){
    await setAllTasks();
    currentTask = getElementWithId(tasks, taskId)
    if (!objectFound(currentTask)) return false;
    return true;
}


/**
 * Deletes a task from Firebase based on the given task ID.
 * 
 * @param {number} taskId - The ID of the task to delete.
 * @returns {Promise<boolean>} True if deletion was successful.
 * @throws Will throw an error if the deletion fails.
 */
async function deleteTaskFromFirebase(taskId) {
    try {
        const response = await fetch(BASE_URL + "/tasks/task_" + taskId + ".json", {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`Failed to delete contact: ${response.statusText}`);
        }
        return true;
    } catch (error) {
        console.error('Error deleting contact:', error);
        throw error;
    }
}


/**
 * Fetches all contacts from the Firebase database.
 * 
 * @returns {Promise<Object|null>} The contacts object if successful, or null on failure.
 */
async function getContacts() {
    try {
        const response = await fetch(`https://join-476d1-default-rtdb.firebaseio.com/contacts/data.json?t=${Date.now()}`);

        if (!response.ok) {
            throw new Error("Failed to load contacts");
        }

        return await response.json();

    } catch (error) {
        console.error("Error loading contacts:", error);
    }
    return null;
}