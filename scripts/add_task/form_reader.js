
// Get Title ---------------------------------------------------------

function getTitle(){
    return document.getElementById("task_title_input").value;
}


// Get Description --------------------------------------------------

function getDescription(){
    return document.getElementById("task_description_input").value;
}


// Get Due Date -----------------------------------------------------

function getDuedate(){
    let duedate = document.getElementById("task_deadline_input").value;
    return changeDateFormat(duedate);
}


// Get Priority  --------------------------------------------------

function getCurrentPriority() {
    const priorityButtons = document.getElementsByClassName("priority_button");
    for (let btn of priorityButtons) {
        if ([...btn.classList].some(cls => cls.endsWith("_color_click"))) {
            return btn.id;
        }
    }
    return null;
}


// Get Assigned Persons


// Get Category


// Get Subtasks -----------------------------------------------------

function getSubtasks(oldSubtasks = null){
    let subtasksContainer = document.getElementById("subtasks_container").children;
    let subtasks = {};
    let subtaskNr = "";

    for (let subtaskIdx = 0; subtaskIdx < subtasksContainer.length; subtaskIdx++) {
        subtaskNr = extractSubtaskNrFromId(subtasksContainer[subtaskIdx].id);
        subtasks["subtask_" + subtaskNr] = getSingleSubtask(oldSubtasks, subtaskNr);
    }

    return subtasks;
}


function getSingleSubtask(oldSubtasks, subtaskNr){
    let status = false;
    if (checkIfOldSubtaskExists(oldSubtasks, "subtask_" + subtaskNr)){
        status = oldSubtasks["subtask_" + subtaskNr].status;
    }
    return {"description": getSubtaskTxt(subtaskNr), "status": status};    
}


function checkIfOldSubtaskExists(oldSubtasks, subtaskKey){
    if (oldSubtasks !== null){
        const keyOldSubtasks = Object.keys(oldSubtasks);
        if (keyOldSubtasks.includes(subtaskKey)){
            return true;
        }        
    }

    return false;
}


function getSubtaskTxt(subtaskNr){
    let subtaskTxtSpan = document.getElementById("subtask_element_" + subtaskNr);
    return subtaskTxtSpan.innerText;
}


function extractSubtaskNrFromId(subtaskId){
    let strNumber = subtaskId.split("_")[2];
    return strNumber;
}

