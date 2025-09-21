
let kanbanColumn = "to_do";

// Initial Function -----------------------------------------------------------------

async function initAddTaskPage(goalKanbanColumn = "to_do"){
    initNavigation("add_task"); // include.js

    includeAddTaskForm("add_task_form"); // include.js
    await initTaskForm();
    kanbanColumn = goalKanbanColumn;
}


async function initAddTaskOverlay(goalKanbanColumn = "to_do"){
    deleteTaskForm("edit");
    toggleScrollBehaviorOfBody('hidden');

    includeAddTaskForm("add_task_form");
    await initTaskForm();
    kanbanColumn = goalKanbanColumn;
}

// Specific functions of Add Task ---------------------------------------------------

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
    
    if (checkRequiredFields()){
        newTask = await createTask();
        path = "/tasks/" + "task_" + newTask.id;
        await setData(newTask, path);
        await increaseTaskCounter(newTask.id);
        displayToastMessage("overlay_container", "overlay_message", "../pages/board.html");
    }
}


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
