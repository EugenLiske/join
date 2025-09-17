
// --- Task Edit Overlay --------------------------------------------------------------------------
// Contacts have already been loaded from the board when displaying.

async function displayEditTaskOverlay(taskId){
    await includeAddTaskForm("edit_task_form");
    await getTaskFromDB(taskId);
    // ToDo: Toggle Overlays
    manipulateTaskForm();
    // await loadContacts();

    setTaskFormData();
}



function manipulateTaskForm(){
    document.getElementById("add_task_footer").innerHTML = getOKButtonTemplate();
    hideRequiredSymole();
    document.getElementById("category_wrapper").classList.add("d_none");
}


function hideRequiredSymole(){
    const symbols = document.getElementsByClassName("required_symbole");
    for (let symbolIdx = 0; symbolIdx < symbols.length; symbolIdx++) {
        symbols[symbolIdx].classList.add("d_none");
    }
}


function setTaskFormData(){
    const taskKeys = Object.keys(currentTask);
    if (taskKeys.includes("title")) document.getElementById("task_title_input").value = currentTask.title;
    if (taskKeys.includes("description")) document.getElementById("task_description_input").value = currentTask.description;
    if (taskKeys.includes("duedate")) document.getElementById("task_deadline_input").value = changeDateFormat2(currentTask.duedate);
    if (taskKeys.includes("priority")) setPrioritySelection(currentTask.priority);
    if (taskKeys.includes("assignedPersons")) setAssignedToSelection(currentTask.assignedPersons);
    // if (taskKeys.includes("category")) setCategorySelection(currentTask.category);
    if (taskKeys.includes("subtasks")) setSubtasksList(currentTask.subtasks);
}



function setPrioritySelection(priority){
    const priorityButtonRef = document.getElementById(priority);
    setGlobalPriority(priorityButtonRef, priority);
}

// Suchliste markieren
// Ausgewählte Personen anzeigen
function setAssignedToSelection(assignedPersons){
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


function setSubtasksList(subtasks){
    const subtaskKeys = Object.keys(subtasks);

    for (let keyIdx = 0; keyIdx < subtaskKeys.length; keyIdx++) {
        document.getElementById("subtask_input").value = subtasks[subtaskKeys[keyIdx]].description;
        addSubtaskToList();
    }
}
