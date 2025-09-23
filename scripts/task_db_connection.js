const BASE_URL = "https://test-projekt-3707a-default-rtdb.europe-west1.firebasedatabase.app";
// Die aktivierte BASE_URL ist Eugen. Ich nutze das zwecks Kanban-Tests.
// const BASE_URL = "https://join-test-c19be-default-rtdb.firebaseio.com";

// 


// async function setAllTasks(){
//   tasks = await getData("/tasks");
// }

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


  // let responseAsJson = await response.json();
  // console.log(response);
  // console.log(responseAsJson);
}

async function getTaskCounter(){
  return await getData("/task_counter"); // muss in der DB manuell gesetzt werden --> task_counter: 0
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
    console.log(taskId);
    
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