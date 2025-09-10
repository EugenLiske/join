

async function displayEditTaskOverlay(taskId){
    await getTaskFromDB(taskId);
    
    await includeAddTaskForm();
    manipulateTaskForm();
    setTaskFormData();
}

async function getTaskFromDB(taskId){
    await getAllTasks();
    currentTask = getElementWithId(tasks, taskId)
    if (!objectFound(currentTask)) return false;
    return true;
}

function getElementWithId(objects, getId) {
    if (!objects) return -1;

    const objectKeys = Object.keys(objects);

    for (let keyIdx = 0; keyIdx < objectKeys.length; keyIdx++) {
        if (getId == getIdFromObjectKey(objectKeys[keyIdx])){
            return objects[objectKeys[keyIdx]];
        }
    }

    return -1;
}


function getIdFromObjectKey(key){
    let splitKey = key.split("_");
    return splitKey[splitKey.length - 1];
}


function objectFound(object){
    if (object == -1)
    {
        console.warn("Object doesn't exist!");
        return false;
    }
    return true;
}


function manipulateTaskForm(){
    document.getElementById("add_task_footer").innerHTML = getOKButtonTemplate();
    hideRequiredSymole();

}


function hideRequiredSymole(){
    const symboles = document.getElementsByClassName("required_symbole");
    for (let symboleIdx = 0; symboleIdx < symboles.length; symboleIdx++) {
        symboles[symboleIdx].classList.add("d_none");
        
    }
}


function setTaskFormData(){
    const taskKeys = Object.keys(currentTask);
    if (taskKeys.includes("title")) document.getElementById("task_title_input").value = currentTask.title;
    if (taskKeys.includes("description")) document.getElementById("task_description_input").value = currentTask.description;
    if (taskKeys.includes("duedate")) document.getElementById("task_deadline_input").value = changeDateFormat2(currentTask.duedate);
    if (taskKeys.includes("priority")) setPriority(currentTask.priority);
    // Assigned To !!!!!!!!!!!!!!!!!!
    // setAssignedToList({"contact_0": 0, "contact_2": 2});
    if (taskKeys.includes("category")) setCategory(currentTask.category);
    if (taskKeys.includes("subtasks")) setSubtasks(currentTask.subtasks);
}


function changeDateFormat(date){
    const splitDate = date.split("-");
    splitDate.reverse();
    return splitDate.join("/");
}


function setPriority(priority){
    const priorityButtonRef = document.getElementById(priority);
    setGlobalPriority(priorityButtonRef, priority);
}


function setAssignedToList(assignedToList){
    const erf = document.getElementById("selection");
    const listerf = erf.children;
    console.log(listerf[0].innerHTML);
    
}


function setSubtasks(subtasks){
    const keys = Object.keys(subtasks);

    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        document.getElementById("subtask_input").value = subtasks[keys[keyIdx]].description;
        addSubtask();
        
    }
}


function getOKButtonTemplate(){
    return `<button id="create_task_button" class="button_filled button_check" onclick="checkAndCreateTask()">
                Ok
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.61905 9.15L14.0941 0.675C14.2941 0.475 14.5316 0.375 14.8066 0.375C15.0816 0.375 15.3191 0.475 15.5191 0.675C15.7191 0.875 15.8191 1.1125 15.8191 1.3875C15.8191 1.6625 15.7191 1.9 15.5191 2.1L6.31905 11.3C6.11905 11.5 5.88572 11.6 5.61905 11.6C5.35239 11.6 5.11905 11.5 4.91905 11.3L0.619055 7C0.419055 6.8 0.323221 6.5625 0.331555 6.2875C0.339888 6.0125 0.444055 5.775 0.644055 5.575C0.844055 5.375 1.08155 5.275 1.35655 5.275C1.63155 5.275 1.86905 5.375 2.06905 5.575L5.61905 9.15Z" fill="white"/>
                </svg>
            </button>`
}