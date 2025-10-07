
/**
 * Returns the formatted label template for a given category.
 * 
 * @param {string} category - The name of the category.
 * @returns {string} - The HTML template or label for the category.
 */
function getCategory(category){
    return getCategoryLabelTemplate(category)
}


/**
 * Builds a short description container if the task has a description.
 * 
 * @param {Object} task - The task object containing a "description" field.
 * @returns {string} - HTML string of the description or an empty string if no description exists.
 */
function buildDescriptionContainer(task){
    if(task["description"]){
        return getShortDescriptionTemplate(task['description']);
    }
    return "";
}


/**
 * Shortens a text string to a given character limit, cutting at word boundaries if necessary.
 * 
 * @param {string} text - The text to shorten.
 * @param {number} limit - The maximum number of characters.
 * @returns {string} - The shortened text with ellipsis if truncated.
 */
function shortenText(text, limit) {
    if (text.length <= limit) return text;
    let cut = text.slice(0, limit);
    
    if (/\S/.test(text[limit])) {
        cut = cut.replace(/\s+\S*$/, '');
    }
    return cut.trim() + '...';
}


/**
 * Builds a progress bar for the subtasks of a given task.
 * 
 * @param {Object} task - The task object containing "subtasks".
 * @returns {string} - HTML string of the progress bar or an empty string if no subtasks exist.
 */
function buildSubtaskProgressbar(task){
    if (task["subtasks"] && Object.keys(task["subtasks"]).length > 0){
        const subtasks = task["subtasks"];
        const values = countArchievedSubtasks(subtasks);
        let progressbarColor = values.counter/values.amount == 1 ? "all_subtasks_completed" : "subtasks_outstanding";
        return getProgressbarTemplate(task.id, values.counter, values.amount, progressbarColor);
    }
    return "";
}


/**
 * Generates the HTML list of assigned persons for a task.
 * 
 * @param {Object} task - The task object containing "assignedPersons".
 * @returns {string} - HTML list of assigned persons or an empty list if none are assigned.
 */
function buildAssignedToTemplate(task){
    if (task["assignedPersons"]){
        let htmlContainer = `<ul id="task_assigned_to" class="bct_assigned_to_list">`;
        const assignedPersonsList = task["assignedPersons"];
        htmlContainer += getHTMLTemplateFromContactInfo(assignedPersonsList, "icon", true, "li");
        return htmlContainer + `</ul>`;
    }
    return "<ul></ul>";
}


/**
 * Returns the icon filename based on the task priority level.
 * 
 * @param {string} priority - The priority level ("urgent", "medium", or "low").
 * @returns {string} - Filename of the corresponding priority icon.
 */
function getPriorityIcon(priority){
    if (priority == "urgent"){
        return "urgent_red.svg";
    }
    if (priority == "medium"){
        return "medium_yellow.svg";
    }
    return "low_green.svg";
}


// --- Task Overlay -----------------------------------------------------------------

/**
 * Displays the task overlay for a specific task by ID.
 * 
 * @param {string} taskId - The ID of the task to display.
 */
async function displayTaskOverlay(taskId){
    setCurrentTask(taskId);
    showAnimationOverlay("overlay_task", "overlay_task_container");
    renderCurrentTask();
    toggleScrollBehaviorOfBody('hidden');
}


/**
 * Renders all relevant task information into the task overlay.
 * 
 * Populates title, description, due date, priority, category,
 * assigned persons, and subtasks if available.
 */
function renderCurrentTask(){
    const task = getCurrentTask();
    const taskKeys = Object.keys(task);
    if (taskKeys.includes("title")) document.getElementById("task_title").innerText = task.title;
    if (taskKeys.includes("description")) document.getElementById("task_description").innerText = task.description;
    if (taskKeys.includes("duedate")) document.getElementById("duedate").innerText = changeDateFormat2(task.duedate);
    if (taskKeys.includes("priority")) displayPriority(task["priority"]);
    if (taskKeys.includes("assignedPersons")) {displayPersonIconsAndName(task["assignedPersons"])} else {document.getElementById("task_overlay_assigned_to").innerHTML = ""};
    if (taskKeys.includes("category")) displayCategory(task["category"]);
    if (taskKeys.includes("subtasks")) {displaySubtasks(task["subtasks"])} else {document.getElementById("subtask_list").innerHTML = ""};
}


/**
 * Displays the task's category with appropriate background color.
 * 
 * @param {string} category - The category name of the task.
 */
function displayCategory(category){
    let number = getCategoryNumber(category);
    const categoryRef = document.getElementById("task_category");
    categoryRef.classList = "category";
    categoryRef.classList.add("category_bg_color" + number);
    categoryRef.innerText = category;
}


/**
 * Displays the visual representation of the task's priority.
 * 
 * @param {string} priority - The task's priority.
 */
function displayPriority(priority){
    const priorityRef = document.getElementById("task_priority");
    priorityRef.innerHTML = getPriorityTemplate(priority);
}


/**
 * Displays assigned persons in the task overlay with their icon and name.
 * 
 * @param {Array} assignedPersonsList - List of person IDs assigned to the task.
 */
function displayPersonIconsAndName(assignedPersonsList){
    const listContainerRef = document.getElementById("task_overlay_assigned_to");
    listContainerRef.innerHTML = getHTMLTemplateFromContactInfo(assignedPersonsList, "icon_and_name", false);
}


/**
 * Displays the list of subtasks for a task in the overlay.
 * 
 * @param {Object} subtasks - Object containing subtask entries.
 */
function displaySubtasks(subtasks){
    const keys = Object.keys(subtasks);
    const listContainerRef = document.getElementById("subtask_list");
    let subtask = null;

    listContainerRef.innerHTML = "";
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        subtask = subtasks[keys[keyIdx]];
        listContainerRef.innerHTML += subtaskListElementTemplate(subtask, keyIdx);
    }    
}


// Events

/**
 * Toggles the checkbox status of a subtask at the given index.
 * 
 * @param {number} idx - Index of the subtask in the list.
 */
function findSubtaskAndToggleCheckbox(idx){
    const task = getCurrentTask();
    const keys = Object.keys(task.subtasks);
    const subtask = task.subtasks[keys[idx]];
    subtask.status = !subtask.status;
    document.getElementById("checkbox_" + idx).src = getCheckboxSubtask(subtask.status);
}


/**
 * Returns the image path for a subtask checkbox based on its status.
 * 
 * @param {boolean} status - Completion status of the subtask.
 * @returns {string} - Path to the checkbox image.
 */
function getCheckboxSubtask(status){
    return status ? "../assets/img/icons/task/checkbox_tick_dark.svg" : "../assets/img/icons/task/checkbox.svg";
}


/**
 * Saves current subtask statuses to the database and updates the progress bar.
 * 
 * @returns {Promise<boolean>} - Resolves to true after saving.
 */
async function saveSubtaskChanges(){
    const task = getCurrentTask();
    if (task["subtasks"] && Object.keys(task["subtasks"]).length > 0){
        await setData(task["subtasks"], "/tasks/task_" + task.id + "/subtasks");
        updateProgressbar(task);
    }
    return true;
}


/**
 * Updates the progress bar based on the completion status of subtasks.
 * 
 * @param {Object} task - The task object containing subtasks.
 */
function updateProgressbar(task){
    const progressbarRef = document.getElementById("progressbar_" + task.id);
    const values = countArchievedSubtasks(task["subtasks"]);
    let percent = values.counter/values.amount*100;
    progressbarRef.style = "width: " + percent + "%";
    if (percent == 100){
        progressbarRef.classList.replace("subtasks_outstanding", "all_subtasks_completed");
    } else {
        progressbarRef.classList.replace("all_subtasks_completed", "subtasks_outstanding");
    }
    const progressTextRef = document.getElementById("progress_text_" + task.id);
    progressTextRef.innerText = values.counter + "/" + values.amount + " Subtasks";
}


/**
 * Deletes the current task from the UI, memory, and database.
 * Shows a toast message and removes the task card after animation.
 * 
 * @returns {Promise<void>}
 */
async function deleteCurrentTask(){
    const task = getCurrentTask();
    displayToastMessage("overlay_container_task_deleted", "overlay_message_task_deleted");
    setTimeout(function () {toggleOverlay("overlay_task");}, 2700);
    
    resetAnimation("overlay_task", "overlay_task_container");
    deleteTaskFromArray(task.id)
    deleteTaskFromFirebase(task.id);

    document.getElementById("task_card_" + task.id).remove();
}


/**
 * Removes a task from the local task array based on its ID.
 * 
 * @param {string} taskId - The ID of the task to remove.
 */
function deleteTaskFromArray(taskId) {
    const tasks = getBoardAllTasks();
    const taskIdx = tasks.findIndex(task => task.id === taskId);
    if (taskIdx !== -1) {
        tasks.splice(taskIdx, 1);
    }
}


/**
 * Opens the edit task overlay for the currently selected task.
 * 
 * @returns {Promise<void>}
 */
async function openEditTaskOverlay(){
    await displayEditTaskOverlay();
}


/**
 * Generates HTML for assigned persons using their contact information.
 * 
 * @param {Array} assignedPersonsList - List of assigned person IDs.
 * @param {string} selection - Template style ("icon" or "icon_and_name").
 * @param {boolean} limited - Whether to limit the displayed persons (e.g., max 3).
 * @param {string} container - HTML tag for each person element (e.g., "li", "div").
 * @returns {string} - HTML representation of assigned persons.
 */
function getHTMLTemplateFromContactInfo(assignedPersonsList, selection = "icon", limited = false, container = "div"){
    let htmlContainer = "";
    let counter = 0;
    for (const personKey in assignedPersonsList) {
        const person = searchAssignedPersonInContacts(assignedPersonsList[personKey]);
        if (person){
            if (!limited || counter < 3){
                htmlContainer += assignedToTemplateSelector(selection, person, container);
            }
            counter++;
        }
    }        
    return htmlContainer + getAssignedToPlaceholder(counter, 3, limited, container);
}


/**
 * Searches for a contact object by assigned person ID.
 * 
 * @param {string|number} assignedPersonId - The ID of the assigned person.
 * @returns {Object|null} - The contact object or null if not found.
 */
function searchAssignedPersonInContacts(assignedPersonId){
    const contacts = getBoardContacts();
    for (const key in contacts) {
        const contact = contacts[key];
        if (assignedPersonId == contact.id) {
            return contact;
        }
    }
    return null;
}


/**
 * Selects and returns the appropriate HTML template for an assigned person.
 * 
 * @param {string} selection - Template type ("icon", "icon_and_name").
 * @param {Object} person - The contact object.
 * @param {string} container - HTML container element (default is "div").
 * @returns {string} - HTML string for the selected template.
 */
function assignedToTemplateSelector(selection, person, container = "div"){
    if (selection === "icon"){
        return getAssignedToIconTemplate(person.avatarColor, generateInitials(person.name), container);
    }
    if (selection === "icon_and_name"){
        return assignedToListElementTemplate(person);
    }
    if (selection === "")
    return "";
}


/**
 * Returns a placeholder avatar (e.g., "+2") if assigned persons exceed display limit.
 * 
 * @param {number} counter - Total number of assigned persons.
 * @param {number} limit - Display limit.
 * @param {boolean} limited - Whether the display is limited.
 * @param {string} container - HTML container tag.
 * @returns {string} - HTML placeholder string.
 */
function getAssignedToPlaceholder(counter, limit, limited = true, container = "div"){
    if (limited && counter > limit){
        return getAssignedToIconTemplate("grey", "+ " + (counter - 3), container);
    }
    return "";
}


/**
 * Returns a numerical index for a given category.
 * Used to apply consistent styling or logic based on category.
 * 
 * @param {string} category - Category name (e.g., "User Story").
 * @returns {number} - Index of the category in the predefined list.
 */
function getCategoryNumber(category){
    return ["User Story", "Technical Task"].indexOf(category);
}


/**
 * Counts completed subtasks from a given subtasks object.
 * 
 * @param {Object} subtasks - Object containing subtasks.
 * @returns {Object} - Object with total amount and completed count (e.g., {amount: 5, counter: 3}).
 */
function countArchievedSubtasks(subtasks){
    let subtaskKeys = Object.keys(subtasks);
    let subtasksAmount = subtaskKeys.length;
    let counter = 0;
    for (let index = 0; index < subtasksAmount; index++) {
        if (subtasks[subtaskKeys[index]].status){
            counter++;
        }
    }
    return {"amount": subtasksAmount, "counter": counter};
}
