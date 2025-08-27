
// Get Title ---------------------------------------------------------

function getTitle(){
    return document.getElementById("task_title_input").value;
}


// Get Description --------------------------------------------------

function getDescription(){
    return document.getElementById("task_description_input").value;
}


// Get Due Date -----------------------------------------------------

function getDueDate(){
    let dueDate = document.getElementById("task_deadline_input").value;
    return changeDateFormat(dueDate);
}


// Get Priority -> global "currentPriority" -------------------------


// Get Assigned Persons -> global "assignedToList" ------------------
// -> getAssignedPersons() in add_tasks.js


// Get Category -> global "currentCategory" -------------------------


// Get Subtasks -----------------------------------------------------

function getSubtasks(){
    let subtasksContainer = document.getElementById("subtasks_container").children;
    let subtasks = {};
    let subtaskNr = 0;
    let subtaskKey = "";

    for (let subtaskIdx = 0; subtaskIdx < subtasksContainer.length; subtaskIdx++) {
        subtaskNr = extractSubtaskNrFromId(subtasksContainer[subtaskIdx].id);
        subtaskKey = "subtask_" + subtaskIdx;
        subtasks[subtaskKey] = {"description": getSubtaskTxt(subtaskNr), "status": false};
    }

    return subtasks;
}


function getSubtaskTxt(subtaskNr){
    let subtaskTxtSpan = document.getElementById("subtask_element_" + subtaskNr);
    return subtaskTxtSpan.innerText;
}


function extractSubtaskNrFromId(subtaskId){
    let strNumber = subtaskId.split("_")[2];
    return strNumber;
}

