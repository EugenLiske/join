
let currentPriority = null;
let currentCategory = "";

let nameSearchListResult = [];
let nameSearchList = [];

const categories = ["Technical Task", "User Story"];

let assignedToList = [];

let nextSubtaskId = 0;

let newTask = {
    "title": "",
    "description": "",
    "duedate": "",
    "priority": "",
    "assignedTo": {},
    "category": "",
    "subtasks": {}
}

// Initial Function -----------------------------------------------------------------

function initAddTask(){
    getNameSearchList();
    getSearchListResult("");
    renderNames();
    renderCategoryOptions();
}

function getNameSearchList(){
    for (let personIdx = 0; personIdx < persons.length; personIdx++) {
        nameSearchList.push(persons[personIdx].name);
    }
}

function initAssignedToList(){
    for (let personIdx = 0; personIdx < persons.length; personIdx++) {
        assignedToList.push(false);
    }
}

// Priority Selection -------------------------------------------------------------------

function setGlobalPriority(element, priority){
    clearPriorityButtons();

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

function clearPriorityButtons(){
    let priorityButtonsRef = document.getElementsByClassName("priority_button");
    setButtonDefault(priorityButtonsRef);    
}

// Assigned To Selection ------------------------------------------------------------------

function startNameSearch(){
    let input = document.getElementById("task_assignedto_input").value;
    getSearchListResult(input);
    renderNames();
    document.getElementById("selection").classList.remove("d_none");
    toggleDropDownIcon("task_assignedto_input", "drop_down_persons");
}

function getSearchListResult(input){
    nameSearchListResult = [];
    for (let personIdx = 0; personIdx < nameSearchList.length; personIdx++) {
        if (nameSearchList[personIdx].toLowerCase().includes(input.toLowerCase())){
            nameSearchListResult.push(personIdx);
        }
    }
}

function renderNames(){
    let personSelectionRef = document.getElementById("selection");
    let selection = "";
    let personIdx = 0;
    let assignedTo = false;
    let selectedDesignClass = "";

    for (let resultIdx = 0; resultIdx < nameSearchListResult.length; resultIdx++) {
        personIdx = nameSearchListResult[resultIdx];
        assignedTo = assignedToList[personIdx];
        selectedDesignClass = assignedTo == true ? "person_selected" : "";
        selection += getListElementTemplate(selectedDesignClass, personIdx, assignedTo);
    }
    personSelectionRef.innerHTML = selection;
}

function getListElementTemplate(selectedDesignClass, personIdx, checked){
    return `<li onclick="selectPerson(this, ${personIdx})" class="${selectedDesignClass}">
                <div class="person_info">
                    <div class="person_icon" style="background-color: ${persons[personIdx].color}">
                        ${persons[personIdx].initials}
                    </div>
                        ${persons[personIdx].name}
                </div>
                <img src="${getCheckboxImg(checked)}">
            </li>`;
}

function selectPerson(element, personIdx){
    element.classList.toggle("person_selected");

    let checkbox = getCheckbox(element);
    let checked = element.classList.contains("person_selected");
    toggleCheckbox(checked, checkbox);
    assignedToList[personIdx] = checked;
    renderAssignedToList();
}

function getCheckbox(parent){
    return parent.childNodes[3];
}

function toggleCheckbox(checked, checkbox){
    if (checked){
        checkbox.src = "./assets/img/icons/task/checkbox_tick.svg";
    }
    else{
        checkbox.src = "./assets/img/icons/task/checkbox.svg";
    }
}

function getCheckboxImg(checked){
    return checked ? "./assets/img/icons/task/checkbox_tick.svg" : "./assets/img/icons/task/checkbox.svg";
}

function toggleSelectionList(listId, iconId){
    document.getElementById(listId).classList.toggle("d_none");
    toggleDropDownIcon(listId, iconId);
}

function toggleDropDownIcon(inputId, iconId){
    let selectionRef = document.getElementById(inputId);
    let dropDownRef = document.getElementById(iconId);

    if (selectionRef.classList.contains("d_none")){
        dropDownRef.src="./assets/img/icons/drop_down/arrow.svg";
    }
    else{
        dropDownRef.src="./assets/img/icons/drop_down/arrow_close.svg";
    }
}

function toggleInputElement(){
    document.getElementById("task_assignedto_button").classList.toggle("d_none");
    document.getElementById("task_assignedto_input").classList.toggle("d_none");

    toggleSelectionList('selection', 'drop_down_persons');
}

function renderAssignedToList(){
    let selectedPersonContainer = document.getElementById("selected_persons");

    let firstThreeAssignments = {"counter": 0, "htmlTemplate": ""};
    getFirstThreeAssignments(firstThreeAssignments);
    
    if (firstThreeAssignments.counter > 3){
        firstThreeAssignments.htmlTemplate += getAssignedToTemplate("grey", "+" + (firstThreeAssignments.counter-3));
    }
    selectedPersonContainer.innerHTML = firstThreeAssignments.htmlTemplate;
}

function getAssignedToTemplate(color, initials){
    return `<div class="person_icon" style="background-color: ${color}">
                ${initials}
            </div>`;
}

function getFirstThreeAssignments(firstThreeAssignments){

    for (let persIdx = 0; persIdx < assignedToList.length; persIdx++) {
        if (assignedToList[persIdx]){
            firstThreeAssignments.counter++;
            if (firstThreeAssignments.counter <= 3){
                firstThreeAssignments.htmlTemplate += getAssignedToTemplate(persons[persIdx].color, persons[persIdx].initials);
            }
        }
    }
}

function clearAssignedToInputArea(){
    document.getElementById("selected_persons").innerHTML = "";
    document.getElementById("selection").innerHTML = "";
    document.getElementById("task_assignedto_button").classList.remove("d_none");
    document.getElementById("task_assignedto_input").classList.add("d_none");
}

// Category Selection ---------------------------------------------------------------------

function renderCategoryOptions(){
    let categoryOptionsRef = document.getElementById("category_options");
    let optionList = "";

    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
        if (!checkCategorySelection(categories[catIdx])){
            optionList += `<li onclick="setCategory('${categories[catIdx]}')">${categories[catIdx]}</li>`
        }
    }
    categoryOptionsRef.innerHTML = optionList;
}

function setCategory(category){
    currentCategory = category;
    showCategorySelection(category);
    renderCategoryOptions();
}

function checkCategorySelection(category){
    let categoryButtonRef = document.getElementById("category_selection");
    let choice = categoryButtonRef.innerText;
    return choice === category;
}

function showCategorySelection(category){
    let categoryButtonRef = document.getElementById("category_selection");
    categoryButtonRef.innerText = category;
}

function clearCategoryInput(){
    document.getElementById("category_selection").innerText = "Select task category";
    document.getElementById("category_options").classList.add("d_none");
}

// Subtasks ---------------------------------------------------------------------------------

function toggleIcons(){
    let inputSubtask = document.getElementById("subtask_input");
    let input = inputSubtask.value;

    if (input.length > 0){
        switchDisplayButtons("subtask_icon", "subtask_icons");
    }
    else{
        switchDisplayButtons("subtask_icons", "subtask_icon");
    }
}

function switchDisplayButtons(buttonIdAdd, buttonIdRemove){
    document.getElementById(buttonIdAdd).classList.add("d_none");
    document.getElementById(buttonIdRemove).classList.remove("d_none");
}

function openEditMode(subtaskID){
    document.getElementById("edit_mode_" + subtaskID).classList.remove("d_none");
}

function addSubtask(){
    let inputSubtask = document.getElementById("subtask_input");
    let input = inputSubtask.value;
    let subtasksContainer = document.getElementById("subtasks_container");
    subtasksContainer.innerHTML += getSubtaskTemplate(input);
    nextSubtaskId++;
    inputSubtask.value = "";
    toggleIcons();

}

function getSubtaskTemplate(input){
    return `<!-- normal -->
            <li id="subtask_element_${nextSubtaskId}" class="subtask_bulletpoint" ondblclick="openEditMode(${nextSubtaskId})">
                <span id="subtask_${nextSubtaskId}">${input}</span>
                <div class="subtask_icon_wrapper pad_8">
                    <svg onclick="deleteSubtask(event, '${nextSubtaskId}')" height="16" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="currentColor"/>
                    </svg>
                    <div class="icon_separator_subtask"></div>
                    <svg onclick="openEditMode(${nextSubtaskId})" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="currentColor"/>
                    </svg>                                                
                </div>
                <!-- edit -->
                <div id="edit_mode_${nextSubtaskId}" class="edit_subtask edit_overlay d_none">
                    <input id="edit_subtask_input_${nextSubtaskId}" class="edit_subtask_input" type="text" value="${input}">
                    <div class="subtask_icon_wrapper pad_8">
                        <svg onclick="deleteSubtask(event, '${nextSubtaskId}')" height="16" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
                        </svg>                                             
                        <div class="icon_separator_subtask" style="border-right: 1px solid #D1D1D1"></div>
                        <svg onclick="saveAndCloseEditMode(event, ${nextSubtaskId})" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
                        </svg>
                    </div>
                </div>
            </li>`;
}

function cancelSubtask(){
    let inputSubtask = document.getElementById("subtask_input");
    inputSubtask.value = "";
    toggleIcons();
}

function deleteSubtask(event, subtaskID) {
    event.stopPropagation();

    document.getElementById("subtask_element_" + subtaskID).remove();
}

function saveAndCloseEditMode(event, subtaskID){
    event.stopPropagation();

    let input = document.getElementById("edit_subtask_input_" + subtaskID).value;
    document.getElementById("subtask_" + subtaskID).innerText = input;
    document.getElementById("edit_mode_" + subtaskID).classList.add("d_none");
}

function clearSubtasksInputArea(){
    document.getElementById("subtasks_container").innerHTML = "";
    document.getElementById("subtask_input").value = "";
}


function deleteForm(){
    document.getElementById("task_title_input").value = "";
    document.getElementById("task_description_input").value = "";
    document.getElementById("task_deadline_input").value = "";
    clearPriorityButtons();
    clearAssignedToInputArea();
    clearCategoryInput();
    clearSubtasksInputArea();
}

