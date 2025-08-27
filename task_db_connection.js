const BASE_URL = "https://test-projekt-3707a-default-rtdb.europe-west1.firebasedatabase.app/";

async function getAllTasks(){
    tasks = await getData("/tasks");
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
  return await getData("/task_counter");
}

async function setTaskCounter(){
  await setData(nextTaskId, "/task_counter");
}

async function increaseTaskCounter(){
        nextTaskId++;
        await setTaskCounter();       
}
