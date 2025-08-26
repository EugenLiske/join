const BASE_URL = "https://test-projekt-3707a-default-rtdb.europe-west1.firebasedatabase.app/";

async function getAllTasks(){
    tasks = await getData("/tasks");
}

async function getData(path) {
  let fireBaseResponse = await fetch(BASE_URL + path + ".json");
  let fireBaseResponseAsJson = await fireBaseResponse.json();
  return fireBaseResponseAsJson; // gibt Objekt oder null zurück
}

async function setData(data, path) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  // let responseAsJson = await response.json();
  // console.log(response);
  // console.log(responseAsJson);
}

async function getTaskCounter(){
  return await getData("/task_counter");
}

async function setTaskCounter(){
  await setData(nextTaskId, "/task_counter");
}

async function increaseTaskCounter(){
        nextTaskId++;
        await setTaskCounter();       
}
