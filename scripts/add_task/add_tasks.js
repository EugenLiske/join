let contactListNames = []; //list with all names from contacts
let idxOfSearchedContacts = []; //list of idx of persons containing the search text
let assignedPersons = []; //list with boolean - one entry for a person from the search list; if the person contains the search text, then true, otherwise false

let nextSubtaskId = 0;

let kanbanColumn = "to_do";


// EventListener -------------------------------------------------------------------

document.addEventListener('click', function(event) {
    closeDropDownAssignedToSelection(event);
    closeDropDownCategorySelection(event);
});


// Initial Function -----------------------------------------------------------------

function initAddTaskGlobal(goalKanbanColumn = "to_do"){
    initNavigation("add_task"); // important for displaying the navigation bar 
    includeAddTaskForm();
    initAddTask();
    kanbanColumn = goalKanbanColumn;
}


async function initAddTaskOverlay(goalKanbanColumn = "to_do"){
    document.getElementById("edit_task_form").innerHTML = "";
    await includeAddTaskForm();
    initAddTask();
    kanbanColumn = goalKanbanColumn;
    toggleScrollBehaviorOfBody('hidden');
}


async function initAddTask(){
    await loadContacts();
    
    initAssignedPersons(persons);
    initContactSearchList(persons);
    getContactSearchResult("");
    createContactDropDownSearchList(contactListNames, idxOfSearchedContacts);

    renderCategoryOptions();
}


// Final Add Task Buttons - Clear and Create Task ------------------------------------

function deleteForm(){
    document.getElementById("task_title_input").value = "";
    document.getElementById("task_description_input").value = "";
    document.getElementById("task_deadline_input").value = "";
    clearPriorityButtons("default");
    clearAssignedToInputArea(persons);
    clearCategoryInput();
    renderCategoryOptions();
    clearSubtasksInputArea();

    resetWarning();
}


async function checkAndCreateTask(){ // hier kann man den Parameter für die verschiedenen Spalten als String übergeben
    let taskKey = "";
    let nextTaskId = -1;
    let newTask = null;
    

    if (checkRequiredFields()){
        newTask = await createTask(); // createTask ist async aufgrund der ID-Generierung
        nextTaskId = await getTaskCounter();
        taskKey = "task_" + nextTaskId;
        path = "/tasks/" + taskKey;
        await setData(newTask, path);
        await increaseTaskCounter(nextTaskId);
        displayToastMessage("overlay_container", "overlay_message", "../pages/board.html");
    }

}


function checkAndEnableButton(mode = "add_task"){
    let createButtonRef = document.getElementById("create_task_button");
    if (simpleCheckRequiredFields(mode)){
        createButtonRef.disabled = false;
    }
    else {
        createButtonRef.disabled = true;
    }
}


async function createTask(){
    return {
        "id": await getTaskCounter(), // Neu zwecks ID-Speicherung im Objekt
        "title": getTitle(),
        "description": getDescription(),
        "duedate": getDuedate(),
        "priority": currentPriority,
        "assignedPersons": getAssignedPersons2(),
        "category": currentCategory,
        "subtasks": getSubtasks(),
        "kanbanBoardColumn": kanbanColumn // Test für die Kanban-Spalte. Name "category" war vergeben.
    };
}

function getFormContent(){
    return {
        "title": getTitle(),
        "description": getDescription(),
        "duedate": getDuedate(),
        "priority": currentPriority,
        "assignedPersons": getAssignedPersons2(),
        "subtasks": getSubtasks(),
    };
}


function getAssignedPersons(){
    let assigned = {};
    for (let personIdx = 0; personIdx < assignedPersons.length; personIdx++) {
        if (assignedPersons[personIdx]){
            let personKey = "contact_" + personIdx;
            
            assigned[personKey] = personIdx;
        }
    }
    return assigned;
}


function getAssignedPersons2(){
    // console.log(persons);
    
    let assigned = {};
    let personsKeys = Object.keys(persons);
    for (let personIdx = 0; personIdx < assignedPersons.length; personIdx++) {
        if (assignedPersons[personIdx]){
            let personKey = "contact_" + persons[personsKeys[personIdx]].id;
            
            assigned[personKey] = persons[personsKeys[personIdx]].id;
        }
    }
    return assigned;
}

