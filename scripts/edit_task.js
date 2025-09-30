
// --- Task Edit Overlay --------------------------------------------------------------------------
// Contacts have already been loaded from the board when displaying.

async function displayEditTaskOverlay(taskId){
    deleteTaskForm("add");
    toggleScrollBehaviorOfBody('hidden');

    includeAddTaskForm("edit_task_form");
    await initTaskForm();
    
    manipulateTaskForm();
    setTaskFormData();
    setAnimtion('overlay_edit_task', 'overlay_edit_task_container');
    toggleOverlay('overlay_task');
    toggleOverlay('overlay_edit_task');
}


// Form Manipulation

function manipulateTaskForm(){
    document.getElementById("add_task_footer").innerHTML = getOKButtonTemplate();
    hideRequiredSymole();
    document.getElementById("category_wrapper").classList.add("d_none");
    changeCSSClasses("task_input_area", "edit_task_input_area");
    changeCSSClasses("task_separator", "edit_task_separator");
    changeCSSClasses("add_task_footer", "edit_add_task_footer");
    document.getElementById("task_title_input").onkeyup = "checkAndEnableButton('edit_task')";
    document.getElementById("task_deadline_input").onkeyup = "checkAndEnableButton('edit_task')";
}


function hideRequiredSymole(){
    const symbols = document.getElementsByClassName("required_symbole");
    for (let symbolIdx = 0; symbolIdx < symbols.length; symbolIdx++) {
        symbols[symbolIdx].classList.add("d_none");
    }
}


function changeCSSClasses(oldCSSClass, newCSSClass){
    const elementsRef = document.getElementsByClassName(oldCSSClass);
    elementsRef[0].classList.replace(oldCSSClass, newCSSClass);
}


// Fill Form with Informations

function setTaskFormData(){
    const task = getCurrentTask();
    const taskKeys = Object.keys(task);
    if (taskKeys.includes("title")) document.getElementById("task_title_input").value = task.title;
    if (taskKeys.includes("description")) document.getElementById("task_description_input").value = task.description;
    if (taskKeys.includes("duedate")) document.getElementById("task_deadline_input").value = changeDateFormat2(task.duedate);
    if (taskKeys.includes("priority")) setPrioritySelection(task.priority);
    if (taskKeys.includes("assignedPersons")) setAssignedToSelection(task.assignedPersons);
    if (taskKeys.includes("subtasks")) setSubtasksList(task.subtasks);
}


function setPrioritySelection(priority){
    const priorityButtonRef = document.getElementById(priority);
    togglePriorityButtons(priorityButtonRef, priority);
}


function setAssignedToSelection(assignedList){
    const contacts = getFormContacts();
    const personKeys = Object.keys(contacts);
    const searchHTMLList = document.getElementById("selection").children;
    let contact = null;

    for (let personKeyIdx = 0; personKeyIdx < personKeys.length; personKeyIdx++) {
        contact = contacts[personKeys[personKeyIdx]];
        searchHTMLList[personKeyIdx].classList.remove("person_selected");  
        if(searchPersonInAssigned(assignedList, personKeyIdx, contact.id)){
            selectPerson(searchHTMLList[personKeyIdx], personKeyIdx);  
        }
    }
}


function searchPersonInAssigned(assignedList, contactID){
    const assignedKeys = Object.keys(assignedList);
    for (let assignedKeyIdx = 0; assignedKeyIdx < assignedKeys.length; assignedKeyIdx++) {
        if (assignedList[assignedKeys[assignedKeyIdx]] == contactID){
            return true;
        }
    }      
    return false; 
}


function setSubtasksList(subtasks){
    const subtaskKeys = Object.keys(subtasks);
    const subtasksContainer = document.getElementById("subtasks_container");
    let subtaskId = -1;
    for (let keyIdx = 0; keyIdx < subtaskKeys.length; keyIdx++) {
        subtaskId = getIdFromObjectKey(subtaskKeys[keyIdx]);
        subtasksContainer.innerHTML += getSubtaskTemplate(subtasks[subtaskKeys[keyIdx]].description, subtaskId);
    }
    subtaskId = parseInt(subtaskId) + 1;
    setSubtaskId(subtaskId);
}


async function updateTaskAndGoBack(){
    if (checkRequiredFields("edit_task")){
        const formContent = getFormContent();
        await saveFormContentInDB(formContent);
        updateTask(currentTask.id, formContent);
        updateTaskCardAtBoard(currentTask.id);
        displayToastMessage("overlay_container_edit", "overlay_message_edit");
        setTimeout(function () {goBack();}, 2700);
    }
}

async function saveFormContentInDB(formContent) {
    for (const [key, value] of Object.entries(formContent)) {
        await setData(value, `/tasks/task_${currentTask.id}/${key}`);
    }
}


function goBack(){
    displayTaskOverlay(currentTask.id);
    toggleOverlay('overlay_edit_task');    
}



function getFormContent(){
    return {
        "title": getTitle(),
        "description": getDescription(),
        "duedate": getDuedate(),
        "priority": getCurrentPriority(),
        "assignedPersons": getAssignedPersons(),
        "subtasks": getSubtasks(currentTask.subtasks),
    };
}
