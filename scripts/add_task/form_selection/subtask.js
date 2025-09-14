import {
    getSubtaskTemplate
} from "../templates.js"

// Subtasks ---------------------------------------------------------------------------------

export let nextSubtaskId = 0;

export function addTaskOrToggleIcons(event){
    if (event.key === 'Enter' && document.getElementById("subtask_input").value.length > 0) {
        addSubtask();
    }
    else {
        toggleIcons();
    }
}


function toggleIcons(){
    let inputSubtask = document.getElementById("subtask_input");
    let input = inputSubtask.value;

    if (input.length > 0){
        document.getElementById("subtask_icons").classList.remove("d_none");
    }
    else{
        document.getElementById("subtask_icons").classList.add("d_none");
    }  
}


export function openEditMode(subtaskID){
    document.getElementById("edit_mode_" + subtaskID).classList.remove("d_none");
}


export function addSubtask(){
    let inputSubtask = document.getElementById("subtask_input");
    let input = inputSubtask.value;
    let subtasksContainer = document.getElementById("subtasks_container");
    subtasksContainer.innerHTML += getSubtaskTemplate(input);
    nextSubtaskId++;
    inputSubtask.value = "";
    toggleIcons();
}


export function cancelSubtask(){
    let inputSubtask = document.getElementById("subtask_input");
    inputSubtask.value = "";
    toggleIcons();
}


export function deleteSubtask(event, subtaskID) {
    event.stopPropagation();
    
    document.getElementById("subtask_element_" + subtaskID).remove();
}


export function saveAndCloseEditMode(event, subtaskID){
    event.stopPropagation();

    let input = document.getElementById("edit_subtask_input_" + subtaskID).value;
    document.getElementById("subtask_" + subtaskID).innerText = input;
    document.getElementById("edit_mode_" + subtaskID).classList.add("d_none");
}


function clearSubtasksInputArea(){
    document.getElementById("subtasks_container").innerHTML = "";
    document.getElementById("subtask_input").value = "";
}