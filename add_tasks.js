let nameSearchList = [];
let nameSearchListResult = [];
let assignedToList = [];

let nextSubtaskId = 0;

let newTask = {
    "title": "",
    "description": "",
    "duedate": "",
    "priority": "",
    "assignedPersons": {},
    "category": "",
    "subtasks": {}
}


// EventListener -------------------------------------------------------------------

document.addEventListener('click', function(event) {
    closeDropDownAssignedToSelection(event);
    closeDropDownCategorySelection(event);
});


// Initial Function -----------------------------------------------------------------

function initAddTask(){
    initAssignedToList(); // all false -> set assigned to list default
    getNameSearchList(); // init search list with all names
    getSearchListResult(""); // set result list default
    renderSearchNames(); // render searchlist default

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
    clearTask();
}


function clearTask(){
    newTask = {
    "title": "",
    "description": "",
    "duedate": "",
    "priority": "",
    "assignedPersons": {},
    "category": "",
    "subtasks": {}
    };
}


async function checkAndCreateTask(){
    let taskKey = "";

    if (checkRequiredFields()){
        createTask();
        nextTaskId = await getTaskCounter();
        taskKey = "task_" + nextTaskId;
        path = "/tasks/" + taskKey;
        await setData(newTask, path);
        await increaseTaskCounter();
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


function createTask(){
    newTask.title = getTitle();
    newTask.description = getDescription();
    newTask.duedate = getDueDate();
    newTask.priority = currentPriority;
    newTask.category = currentCategory;
    newTask.assignedPersons = getAssignedPersons();
    newTask.subtasks = getSubtasks();
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


