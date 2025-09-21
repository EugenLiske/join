// Subtasks ---------------------------------------------------------------------------------

function toggleDeleteAndAddIcons(){
    let inputSubtask = document.getElementById("subtask_input");
    let input = inputSubtask.value;

    if (input.length > 0){
        document.getElementById("subtask_icons").classList.remove("d_none");
    }
    else{
        document.getElementById("subtask_icons").classList.add("d_none");
    }  
}


function clearSubtasksInputArea(){
    document.getElementById("subtasks_container").innerHTML = "";
    document.getElementById("subtask_input").value = "";
}