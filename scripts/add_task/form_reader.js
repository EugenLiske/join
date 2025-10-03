
/**
 * Retrieves the value of the task title input field.
 * 
 * @returns {string} The current value of the input element with ID "task_title_input".
 */
function getTitle(){
    return document.getElementById("task_title_input").value;
}


/**
 * Retrieves the value from the task description input field.
 *
 * @returns {string} The current value of the task description input.
 */
function getDescription(){
    return document.getElementById("task_description_input").value;
}


/**
 * Retrieves the due date value from the input element with ID "task_deadline_input"
 * and returns it in a formatted date string using the changeDateFormat function.
 *
 * @returns {string} The formatted due date string.
 */
function getDuedate(){
    let duedate = document.getElementById("task_deadline_input").value;
    return changeDateFormat(duedate);
}


/**
 * Retrieves the ID of the currently selected priority button.
 * A priority button is considered selected if it has a class ending with "_color_click".
 *
 * @returns {string|null} The ID of the selected priority button, or null if none is selected.
 */
function getCurrentPriority() {
    const priorityButtons = document.getElementsByClassName("priority_button");
    for (let btn of priorityButtons) {
        if ([...btn.classList].some(cls => cls.endsWith("_color_click"))) {
            return btn.id;
        }
    }
    return null;
}


/**
 * 
 * Reads the entered subtasks from the HTML element
 * and returns an object with all subtasks (description, status).
 * 
 * @param {Object} [oldSubtasks=null] - Subtasks that are already saved in tasks
 * @returns {Object} - All subtasks, both old ones with their status and new ones with the status false
 */
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


/**
 * Extracts the subtask number from a subtask element ID.
 *
 * @param {string} subtaskId - The ID of the subtask element, e.g., "subtask_element_3".
 * @returns {string} - The extracted subtask number as a string.
 */
function extractSubtaskNrFromId(subtaskId){
    let strNumber = subtaskId.split("_")[2];
    return strNumber;
}


/**
 * Returns a subtask object containing its description and status.
 *
 * @param {Object} oldSubtasks - An object containing previous subtasks, with keys in the format "subtask_<number>".
 * @param {number|string} subtaskNr - The number of the subtask to retrieve.
 * @returns {{description: string, status: boolean}} - The subtask object with its description and completion status.
 */
function getSingleSubtask(oldSubtasks, subtaskNr){
    let status = false;
    if (checkIfOldSubtaskExists(oldSubtasks, "subtask_" + subtaskNr)){
        status = oldSubtasks["subtask_" + subtaskNr].status;
    }
    return {"description": getSubtaskTxt(subtaskNr), "status": status};    
}


/**
 * Checks whether a specific subtask key exists in the given oldSubtasks object.
 *
 * @param {Object|null} oldSubtasks - An object containing previous subtasks or null.
 * @param {string} subtaskKey - The key to check for existence (e.g., "subtask_1").
 * @returns {boolean} - True if the subtask key exists, false otherwise.
 */
function checkIfOldSubtaskExists(oldSubtasks, subtaskKey){
    if (oldSubtasks !== null){
        const keyOldSubtasks = Object.keys(oldSubtasks);
        if (keyOldSubtasks.includes(subtaskKey)){
            return true;
        }        
    }

    return false;
}


/**
 * Retrieves the visible text of a subtask from the DOM based on its number.
 *
 * @param {number|string} subtaskNr - The number of the subtask to retrieve text from.
 * @returns {string} - The inner text content of the subtask element.
 */
function getSubtaskTxt(subtaskNr){
    let subtaskTxtSpan = document.getElementById("subtask_element_" + subtaskNr);
    return subtaskTxtSpan.innerText;
}


