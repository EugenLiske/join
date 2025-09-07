let nameSearchList = [];
let nameSearchListResult = [];
let assignedToList = [];

let nextSubtaskId = 0;


// EventListener -------------------------------------------------------------------

document.addEventListener('click', function(event) {
    closeDropDownAssignedToSelection(event);
    closeDropDownCategorySelection(event);
});


// Initial Function -----------------------------------------------------------------

function initAddTaskGlobal(){
    initNavigation("add_task"); // important for displaying the navigation bar 
    includeAddTaskForm();
}

function initAddTask(){
    
    initAssignedToList();
    getNameSearchList();
    getSearchListResult("");
    renderSearchNames();

    renderCategoryOptions();
}


// Final Add Task Buttons - Clear and Create Task ------------------------------------

function deleteForm(){
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
    let taskKey = "";
    let nextTaskId = -1;
    let newTask = null;

    if (checkRequiredFields()){
        newTask = createTask();
        nextTaskId = await getTaskCounter();
        taskKey = "task_" + nextTaskId;
        path = "/tasks/" + taskKey;
        await setData(newTask, path);
        await increaseTaskCounter(nextTaskId);
        deleteForm();
    }
    // TODO: Weiterleitung auf Board Seite
}


function checkAndEnableButton(){
    let createButtonRef = document.getElementById("create_task_button");
    if (simpleCheckRequiredFields()){
        createButtonRef.disabled = false;
    }
    else {
        createButtonRef.disabled = true;
    }
}


function createTask(status = 0){
    const newTask = createNewTaskObject();
    newTask.title = getTitle();
    newTask.description = getDescription();
    newTask.duedate = getDueDate();
    newTask.priority = currentPriority;
    newTask.category = currentCategory;
    newTask.assignedPersons = getAssignedPersons();
    newTask.subtasks = getSubtasks();
    newTask.status = status;
    return newTask;
}

function createNewTaskObject(){
    return {
        "title": "",
        "description": "",
        "duedate": "",
        "priority": "",
        "assignedPersons": {},
        "category": "",
        "subtasks": {}
    };
}

function getAssignedPersons(){
    let assignedPersons = {};
    for (let personIdx = 0; personIdx < assignedToList.length; personIdx++) {
        if (assignedToList[personIdx]){
            let personKey = "contact_" + personIdx;
            
            assignedPersons[personKey] = personIdx;
        }
    }
    return assignedPersons;
}

