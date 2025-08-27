// Priority Selection -------------------------------------------------------------------

let currentPriority = "medium";
let currentCategory = "";

function setGlobalPriority(element, priority){
    clearPriorityButtons("all");

    element.disabled = true;
    element.classList.replace(priority + "_color_default", priority + "_color_click");
    element.children[0].classList.remove("priority_btn_c_txt_default");

    currentPriority = priority;
}

function setPriorityButtonDefault(buttons, mode = "all"){
    let id = -1;

    for (let buttonIdx = 0; buttonIdx < buttons.length; buttonIdx++) {
        id = buttons[buttonIdx].id;

        buttons[buttonIdx].disabled = false;

        buttons[buttonIdx].classList.replace(id + "_color_click", id + "_color_default");
        buttons[buttonIdx].classList.remove("priority_button_shadow_click");
        buttons[buttonIdx].children[0].classList.add("priority_btn_c_txt_default");
    }

    if (mode == "default"){
        document.getElementById("medium").classList.replace("medium_color_default", "medium_color_click");
        document.getElementById("medium").children[0].classList.remove("priority_btn_c_txt_default");
        currentPriority = "medium";
    }
}

function clearPriorityButtons(mode = "all"){
    let priorityButtonsRef = document.getElementsByClassName("priority_button");
    setPriorityButtonDefault(priorityButtonsRef, mode);    
}