
async function displayEditTaskOverlay(taskId){
    await includeAddTaskForm();
    await getTaskFromDB(taskId);
    manipulateTaskForm();
    await loadContacts();

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
    if (taskKeys.includes("assignedPersons")) setAssignedToList(currentTask.assignedPersons);
    if (taskKeys.includes("category")) setCategory(currentTask.category);
    if (taskKeys.includes("subtasks")) setSubtasks(currentTask.subtasks);
}


function changeDateFormat(date){
    const splitDate = date.split("-");sss
    splitDate.reverse();
    return splitDate.join("/");
}


function setPriority(priority){
    const priorityButtonRef = document.getElementById(priority);
    setGlobalPriority(priorityButtonRef, priority);
}


function setAssignedToList(assignedPersons){
    const personKeys = Object.keys(persons);
    const assignedKeys = Object.keys(assignedPersons);
    const searchHTMLList = document.getElementById("selection").children;
    
    for (let assignedKeyIdx = 0; assignedKeyIdx < assignedKeys.length; assignedKeyIdx++) {
        for (let personKeyIdx = 0; personKeyIdx < personKeys.length; personKeyIdx++) {
            if (assignedPersons[assignedKeys[assignedKeyIdx]] == persons[personKeys[personKeyIdx]].id){
                assignedToList[personKeyIdx] = true;    
                selectPerson(searchHTMLList[personKeyIdx], personKeyIdx);         
                break;
            }
        }    
    }
}


function setSubtasks(subtasks){
    const keys = Object.keys(subtasks);

    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        document.getElementById("subtask_input").value = subtasks[keys[keyIdx]].description;
        addSubtask();
    }
}
