// const BASE_URL = "https://test-projekt-3707a-default-rtdb.europe-west1.firebasedatabase.app";
const BASE_URL = "https://join-476d1-default-rtdb.firebaseio.com";
// Die aktivierte BASE_URL ist Eugen. Ich nutze das zwecks Kanban-Tests.
// const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";


async function getAllTasks(){
  return await getData("/tasks");
}


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
  return fireBaseResponseAsJson; // gibt Objekt oder null zurück
}


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


async function getTaskCounter(){
  return await getData("/task_counter");
}


async function setTaskCounter(counter){
  await setData(counter, "/task_counter");
}


async function increaseTaskCounter(nextTaskId){
  await setTaskCounter(nextTaskId+1);       
}


async function getTaskFromDB(taskId){
    await setAllTasks();
    currentTask = getElementWithId(tasks, taskId)
    if (!objectFound(currentTask)) return false;
    return true;
}

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