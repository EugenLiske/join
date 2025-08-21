
let currentPriority = null;

let nameSearchListResult = [];
let nameSearchList = [];

const categries = ["Technical Task", "User Story"];

function initAddTask(){
    getNameSearchList();
    getSearchListResult("");
    renderNames();
}

function getNameSearchList(){
    for (let personIdx = 0; personIdx < persons.length; personIdx++) {
        nameSearchList.push(persons[personIdx].name);
    }
}

function startNameSearch(){
    let input = document.getElementById("task_assignedto_input").value;
    getSearchListResult(input);
    renderNames();
    document.getElementById("selection").classList.remove("d_none");
    toggleDropDownIcon();
}

function toggleDropDownIcon(){
    let selectionRef = document.getElementById("selection");
    let dropDownRef = document.getElementById("drop_down_persons");

    if (selectionRef.classList.contains("d_none")){
        dropDownRef.src="./assets/img/icons/drop_down/arrow.svg";
    }
    else{
        dropDownRef.src="./assets/img/icons/drop_down/arrow_close.svg";
    }
}

function getSearchListResult(input){
    nameSearchListResult = [];
    for (let personIdx = 0; personIdx < nameSearchList.length; personIdx++) {
        if (nameSearchList[personIdx].toLowerCase().includes(input.toLowerCase())){
            nameSearchListResult.push(personIdx);
        }
    }
}

function setGlobalPriority(element, priority){
    let priorityButtonsRef = document.getElementsByClassName("priority_button");
    setButtonDefault(priorityButtonsRef);

    element.disabled = true;
    element.classList.replace(priority + "_color_default", priority + "_color_click");

    currentPriority = priority;
}

function setButtonDefault(buttons){
    let id = -1;

    for (let buttonIdx = 0; buttonIdx < buttons.length; buttonIdx++) {
        id = buttons[buttonIdx].id;

        buttons[buttonIdx].disabled = false;

        buttons[buttonIdx].classList.replace(id + "_color_click", id + "_color_default");
        buttons[buttonIdx].classList.remove("priority_button_shadow_click");
    }
}

function renderNames(){
    let personSelectionRef = document.getElementById("selection");
    let selection = "";
    for (let resultIdx = 0; resultIdx < nameSearchListResult.length; resultIdx++) {
        selection += getListElementTemplate(persons[nameSearchListResult[resultIdx]]);
    }
    personSelectionRef.innerHTML = selection;

}

function getListElementTemplate(person){
    return `<li onclick="selectPerson(this)">
                <div class="person_info">
                    <div class="person_icon" style="background-color: ${person.color}">
                        ${person.initials}
                    </div>
                        ${person.name}
                </div>
                <img src="./assets/img/icons/task/checkbox.svg">
            </li>`;
}

function selectPerson(element){
    element.classList.toggle("person_selected");

    let checkbox = getCheckbox(element);
    toggleCheckbox(element.classList.contains("person_selected"), checkbox);    
}

function toggleCheckbox(checked, checkbox){
    if (checked){
        checkbox.src = "./assets/img/icons/task/checkbox_tick.svg";
    }
    else{
        checkbox.src = "./assets/img/icons/task/checkbox.svg";
    }
}

function getCheckbox(parent){
    return parent.childNodes[3];
}

function toggleSelectionList(){
    document.getElementById("selection").classList.toggle("d_none");
    toggleDropDownIcon();
}