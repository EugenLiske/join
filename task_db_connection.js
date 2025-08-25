const BASE_URL = "https://test-projekt-3707a-default-rtdb.europe-west1.firebasedatabase.app/";
const path = "/tasks"

let newTask = {
    "title": "",
    "description": "",
    "duedate": "",
    "priority": "",
    "assignedPersons": [],
    "category": "",
    "subtasks": []
}

async function init(){
    await initTasks();
}

async function initTasks(){
    let taskObjects = await getAllTasks("/tasks");
    console.log(taskObjects);
    let taskKeys = Object.keys(taskObjects);
    console.log(taskKeys);
    
    
    
}

async function getAllTasks() {
  let fireBaseResponse = await fetch(BASE_URL + path + ".json");
  let fireBaseResponseAsJson = await fireBaseResponse.json();
  return fireBaseResponseAsJson; // gibt Objekt oder null zurück
}

async function putTaskData(data) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  let responseAsJson = await response.json();
  console.log(response);
  console.log(responseAsJson);
}