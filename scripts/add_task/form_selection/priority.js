
/**
 * Returns the file path to the priority icon based on the given priority level.
 *
 * @param {string} priority - The priority level ("high", "medium", "low").
 * @returns {string} The relative path to the corresponding priority icon SVG file.
 */
function setIconPriority(priority){
    return "../assets/img/icons/task/priorities/" + priority + "_white.svg";
}


/**
 * Returns the file path for the priority icon based on the given priority level.
 *
 * @param {string} priority - The priority level ("low", "medium", "urgent", or any other string).
 * @returns {string} The file path to the corresponding priority icon image.
 */
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


/**
 * Resets the state of priority buttons to their default appearance.
 * 
 * @param {string} [mode="all"] - Determines which priority buttons to reset. Defaults to "all".
 */
function clearPriorityButtons(mode = "all"){
    let priorityButtonsRef = document.getElementsByClassName("priority_button");
    setPriorityButtonDefault(priorityButtonsRef, mode);    
}


/**
 * Sets the default state for priority buttons.
 * Deactivates all buttons and, if the mode is "default", sets the medium priority button to its default state.
 *
 * @param {HTMLElement[]} buttons - An array of button elements representing priority options.
 * @param {string} [mode="all"] - The mode for setting the default state. If "default", sets the medium button as default.
 */
function setPriorityButtonDefault(buttons, mode = "all"){
    setAllButtonInactive(buttons);

    if (mode == "default"){
        setMediumButtonDefault();
    }
}


/**
 * Resets the state of all priority buttons to inactive/default.
 * 
 * Iterates through the provided button elements, enabling them,
 * restoring their default color classes, removing active shadow effects,
 * resetting text color, and updating their icon to the default state.
 *
 * @param {HTMLButtonElement[]} buttons - Array of button elements representing priority options.
 */
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
