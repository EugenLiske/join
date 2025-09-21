// Priority Selection -------------------------------------------------------------------


function setIconPriority(priority){
    return "../assets/img/icons/task/priorities/" + priority + "_white.svg";
}

function setDefaultIconPriority(priority){
    let source = "../assets/img/icons/task/priorities/" + priority;
    if (priority == "low"){
        source += "_green.svg";
    }
    else if (priority == "medium"){
        source += "_yellow.svg";
    }
    else if (priority == "urgent"){
        source += "_red.svg";
    }
    else {
        source += "_white.svg";
    }
    return source;
}

function setPriorityButtonDefault(buttons, mode = "all"){
    setAllButtonInactive(buttons);

    if (mode == "default"){
        setMediumButtonDefault();
    }
}


function setAllButtonInactive(buttons){
    let id = -1;
    for (let buttonIdx = 0; buttonIdx < buttons.length; buttonIdx++) {
        id = buttons[buttonIdx].id;

        buttons[buttonIdx].disabled = false;

        buttons[buttonIdx].classList.replace(id + "_color_click", id + "_color_default");
        buttons[buttonIdx].classList.remove("priority_button_shadow_click");
        buttons[buttonIdx].children[0].classList.add("priority_btn_c_txt_default");
        buttons[buttonIdx].children[1].src = setDefaultIconPriority(id);
    }    
}


function setMediumButtonDefault(){
    document.getElementById("medium").classList.replace("medium_color_default", "medium_color_click");
    document.getElementById("medium").children[0].classList.remove("priority_btn_c_txt_default");
    document.getElementById("medium").children[1].src = setIconPriority("medium");
}


function clearPriorityButtons(mode = "all"){
    let priorityButtonsRef = document.getElementsByClassName("priority_button");
    setPriorityButtonDefault(priorityButtonsRef, mode);    
}