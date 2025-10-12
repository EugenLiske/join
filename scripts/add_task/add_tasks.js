
let kanbanColumn = "to_do";


/**
 * Initializes the Add Task page by setting up navigation, including the add task form,
 * initializing the task form, and setting the target Kanban column for the new task.
 *
 * @async
 * @param {string} [goalKanbanColumn="to_do"] - The Kanban column where the new task should be added (default is "to_do").
 * @returns {Promise<void>} Resolves when the page initialization is complete.
 */
async function initAddTaskPage(goalKanbanColumn = "to_do"){
    initNavigation("add_task"); // include.js
    includeAddTaskForm("add_task_form"); // include.js
    await initTaskForm(); //task_form.js
    kanbanColumn = goalKanbanColumn;
}


/**
 * Initializes the Add Task overlay by preparing the form and setting the target Kanban column.
 * - Removes any existing edit task form.
 * - Disables body scroll while the overlay is open.
 * - Includes and initializes the add task form.
 * - Sets the target Kanban column for the new task.
 *
 * @async
 * @param {string} [goalKanbanColumn="to_do"] - The Kanban column where the new task should be added (default is "to_do").
 * @returns {Promise<void>} Resolves when the overlay and form are fully initialized.
 */
async function initAddTaskOverlay(goalKanbanColumn = "to_do"){
    deleteTaskForm("edit");
    toggleScrollBehaviorOfBody('hidden');
    includeAddTaskForm("add_task_form");
    await initTaskForm();
    kanbanColumn = goalKanbanColumn;
}


function clearForm(){
    document.getElementById("task_title_input").value = "";
    document.getElementById("task_description_input").value = "";
    document.getElementById("task_deadline_input").value = "";
    clearPriorityButtons("default");
    clearAssignedToInputArea();
    clearCategoryInput();
    renderCategoryOptions();
    clearSubtasksInputArea();
    resetWarning();
}


async function checkAndCreateTask(){
    let newTask = null;
    let path = "";
    let nextPage = nextPageLink();
    if (checkRequiredFields()){
        newTask = await createTask();
        path = "/tasks/" + "task_" + newTask.id;
        await setData(newTask, path);
        await increaseTaskCounter(newTask.id);
        displayToastMessage("overlay_container", "overlay_message", nextPage);
        additionalOverlayFunctions(nextPage, newTask)
    }
}


function additionalOverlayFunctions(nextPage, newTask){
    if (nextPage === "")
    {
        newTaskToColumn(newTask);
        toggleOverlay("overlay_add_task");
        toggleScrollBehaviorOfBody('');
        clearForm();
        addTaskToAllTasks(newTask);            
    }    
}


function nextPageLink(){
    return window.location.pathname.endsWith("add_task.html") ? "board.html" : "";
}


function newTaskToColumn(newTask){
    const kanbanColumnRef = document.getElementById(newTask["kanbanBoardColumn"]);
    if (checkIfTaskColumnEmpty(kanbanColumnRef)) {
        kanbanColumnRef.innerHTML = getTaskCardTemplate(newTask);
    }
    else {
        kanbanColumnRef.innerHTML += getTaskCardTemplate(newTask);
    }
}

function checkIfTaskColumnEmpty(columnRef){
    return columnRef.children[0].classList.contains("no_tasks_placeholder") ? true : false;
}


/**
 * Asynchronously creates a new task object with all required properties.
 *
 * @async
 * @returns {Promise<Object>} A promise that resolves to the newly created task object containing:
 *   - {number} id - The unique identifier for the task.
 *   - {string} title - The title of the task.
 *   - {string} description - The description of the task.
 *   - {string} duedate - The due date of the task.
 *   - {string} priority - The priority level of the task.
 *   - {number[]} assignedPersons - The list of persons assigned to the task.
 *   - {string} category - The category of the task.
 *   - {Object} subtasks - The list of subtasks.
 *   - {string} kanbanBoardColumn - The kanban board column where the task is placed.
 */
async function createTask(){
    return {
        "id": await getTaskCounter(),
        "title": getTitle(),
        "description": getDescription(),
        "duedate": getDuedate(),
        "priority": getCurrentPriority(),
        "assignedPersons": getAssignedPersons(),
        "category": getCurrentCategory(),
        "subtasks": getSubtasks(),
        "kanbanBoardColumn": kanbanColumn
    };
}
