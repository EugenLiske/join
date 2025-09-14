// --- Imports ----------------------------------------------------------------------------------

import { 
    initNavigation,
    toggleMenu,
    logoutUser,
    includeAddTaskForm
} from "../include.js";

import {
    loadContacts
} from "../temp_db/person_db.js";

import {
    initAssignedToList2,
    getNameSearchList2,
    getSearchListResult,
    renderSearchNames,
    toggleSelectionList,
    toggleInputElement,
    selectPerson,
    closeDropDownAssignedToSelection,
    startNameSearch
} from "../add_task/form_selection/assigned_to.js";

import {
    renderCategoryOptions,
    closeDropDownCategorySelection,
    setCategory
} from "../add_task/form_selection/category.js";

import {
    setGlobalPriority
} from "../add_task/form_selection/priority.js";

import {
    addTaskOrToggleIcons,
    cancelSubtask,
    addSubtask,
    deleteSubtask,
    openEditMode,
    saveAndCloseEditMode
} from "../add_task/form_selection/subtask.js";


// ----------------------------------------------------------------------------------------------



// --- EventListener ----------------------------------------------------------------------------

// document.addEventListener('click', function(event) {
//     closeDropDownAssignedToSelection(event);
//     closeDropDownCategorySelection(event);
// });


document.addEventListener("DOMContentLoaded", () => {
    initAddTaskGlobal();
})




document.addEventListener('click', (event) => {

    // if (event.target.id == "login_initials"){
    //     toggleMenu();
    // }
    // if (event.target.id == "logout"){
    //     logoutUser();
    // }
    // if (["urgent", "medium", "low"].includes(event.target.id)){
    //     setGlobalPriority(event.target, event.target.id);
    // }
    // if (["urgent", "medium", "low"].includes(event.target.parentNode.id)){
    //     setGlobalPriority(event.target.parentNode, event.target.parentNode.id);
    // }
    // if (["task_assignedto_button", "drop_down_persons"].includes(event.target.id)){
    //     toggleInputElement();
    // }
    // if (["category_selection", "drop_down_categories"].includes(event.target.id)){
    //     toggleSelectionList('category_options', 'drop_down_categories');
    // }
    // Prüft, ob ein übergeordnetes Element die id "selection" hat

    closeDropDownAssignedToSelection(event);
    
    const categoryParent = event.target.closest('#category_options');
    if (categoryParent) {
        // Prüft, ob event.target das direkte Kind von #selection ist
        if (event.target.parentNode === categoryParent) {
            setCategory(event.target.id);
        } else {
            // Holt das direkte Kind von #selection, das angeklickt wurde
            const directChild = Array.from(categoryParent.children).find(child => child.contains(event.target));
            if (directChild) {
                setCategory(directChild.id);
            }
        }
    }

    closeDropDownCategorySelection(event);
    // if (event.target.id == "cancel_subtask"){
    //     cancelSubtask();
    // }
    // if (event.target.id == "add_subtask"){
    //     addSubtask();
    // }

    let subtaskId = event.target.id.split("_");
    subtaskId = subtaskId[subtaskId.length - 1];    
    // if (["delete_subtask_" + subtaskId, "delete_edit_subtask_" + subtaskId].includes(event.target.id)){
    //     deleteSubtask(event, subtaskId);
    // }
    console.log(event.target);
    
    // Handle delete subtask for SVG elements (since closest doesn't work on SVG)
    let deleteSubtaskElement = event.target;
    while (deleteSubtaskElement && deleteSubtaskElement !== document) {
        if (
            deleteSubtaskElement.id === "delete_subtask_" + subtaskId ||
            deleteSubtaskElement.id === "delete_edit_subtask_" + subtaskId
        ) {
            deleteSubtask(event, subtaskId);
            break;
        }
        deleteSubtaskElement = deleteSubtaskElement.parentNode;
    }

    const subtaskOpenEditParent = event.target.closest("#open_edit_subtask_" + subtaskId);
    if (subtaskOpenEditParent) {
        // Prüft, ob event.target das direkte Kind von #selection ist
        openEditMode(subtaskId);
    }

    const subtaskSaveEditParent = event.target.closest("#save_edit_subtask_" + subtaskId);
    if (subtaskSaveEditParent) {
        // Prüft, ob event.target das direkte Kind von #selection ist
        saveAndCloseEditMode(event, subtaskId);
    }

});

document.addEventListener('dblclick', (event) => {
    let subtaskId = event.target.id.split("_");
    subtaskId = subtaskId[subtaskId.length - 1];    
    if (event.target.id == "subtask_element_" + subtaskId){
        openEditMode(subtaskId);
    }
});

document.addEventListener('keyup', (event) => {
    if (["task_title_input", "task_deadline_input"].includes(event.target.id)){
        checkAndEnableButton();
    }
    if (event.target.id == "task_assignedto_input"){
        startNameSearch();
    }
    if (event.target.id == "subtask_input"){
        addTaskOrToggleIcons(event);
    }
})

// --- Initial Function -------------------------------------------------------------------------

function initAddTaskGlobal(){
    initNavigation("add_task"); // important for displaying the navigation bar 
    includeAddTaskForm();
}


async function initAddTaskOverlay(){
    await includeAddTaskForm();
}


export async function initAddTask(){
    await loadContacts();
    
    initAssignedToList2();
    getNameSearchList2();
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
        displayToastMessage("add_task_overlay", "overlay_message", "../pages/board.html");
    }

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


async function createTask(status = 0){
    const newTask = createNewTaskObject();
    newTask.id = await getTaskCounter(); // Neu zwecks ID-Speicherung im Objekt
    newTask.title = getTitle();
    newTask.description = getDescription();
    newTask.duedate = getDueDate();
    newTask.priority = currentPriority;
    newTask.category = currentCategory;
    newTask.assignedPersons = getAssignedPersons2();
    newTask.subtasks = getSubtasks();
    newTask.status = status;
    newTask.kanbanBoardColumn = "to_do"; // Test für die Kanban-Spalte. Name "category" war vergeben.
    return newTask;
}


function createNewTaskObject(){
    return {
        "id": "", // Neu zwecks ID-Speicherung im Objekt
        "title": "",
        "description": "",
        "duedate": "",
        "priority": "",
        "assignedPersons": {},
        "category": "",
        "subtasks": {},
        "kanbanBoardColumn": "" // Test für die Kanban-Spalte. Name "category" war vergeben.
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


function getAssignedPersons2(){
    console.log(persons);
    
    let assignedPersons = {};
    let personsKeys = Object.keys(persons);
    for (let personIdx = 0; personIdx < assignedToList.length; personIdx++) {
        if (assignedToList[personIdx]){
            let personKey = "contact_" + persons[personsKeys[personIdx]].id;
            
            assignedPersons[personKey] = persons[personsKeys[personIdx]].id;
        }
    }
    return assignedPersons;
}

