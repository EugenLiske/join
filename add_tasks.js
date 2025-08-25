
let currentPriority = "medium";
let currentCategory = "";

let nameSearchList = [];
let nameSearchListResult = [];
let assignedToList = [];

const categories = ["Technical Task", "User Story"];

let nextSubtaskId = 0;

let newTask = {
    "title": "",
    "description": "",
    "duedate": "",
    "priority": "",
    "assignedPersons": [],
    "category": "",
    "subtasks": []
}

const monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Initial Function -----------------------------------------------------------------

function initAddTask(){
    getNameSearchList();
    getSearchListResult("");
    initAssignedToList();
    renderNames();
    renderCategoryOptions();
}

function getNameSearchList(){
    for (let personIdx = 0; personIdx < persons.length; personIdx++) {
        nameSearchList.push(persons[personIdx].name);
    }
}

function initAssignedToList(){
    assignedToList = [];
    for (let personIdx = 0; personIdx < persons.length; personIdx++) {
        assignedToList.push(false);
    }
}

// Priority Selection -------------------------------------------------------------------

function setGlobalPriority(element, priority){
    clearPriorityButtons("all");

    element.disabled = true;
    element.classList.replace(priority + "_color_default", priority + "_color_click");

    currentPriority = priority;
}

function setButtonDefault(buttons, mode = "all"){
    let id = -1;

    for (let buttonIdx = 0; buttonIdx < buttons.length; buttonIdx++) {
        id = buttons[buttonIdx].id;

        buttons[buttonIdx].disabled = false;

        buttons[buttonIdx].classList.replace(id + "_color_click", id + "_color_default");
        buttons[buttonIdx].classList.remove("priority_button_shadow_click");
    }

    if (mode == "default"){
        document.getElementById("medium").classList.replace("medium_color_default", "medium_color_click");
        currentPriority = "medium";
    }
}

function clearPriorityButtons(mode = "all"){
    let priorityButtonsRef = document.getElementsByClassName("priority_button");
    setButtonDefault(priorityButtonsRef, mode);    
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
    
    // Reset selected persons
    document.getElementById("selected_persons").innerHTML = "";

    // Reset searchlist
    document.getElementById("selection").innerHTML = "";
    initAssignedToList();
    nameSearchListResult = [];
    renderNames();

    // Show button and hide input
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
    currentCategory = "";
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

// Final Add Task Buttons - Clear and Create Task 

function deleteForm(){
    document.getElementById("task_title_input").value = "";
    document.getElementById("task_description_input").value = "";
    document.getElementById("task_deadline_input").value = "";
    clearPriorityButtons("default");
    clearAssignedToInputArea();
    clearCategoryInput();
    clearSubtasksInputArea();
}

function clearTask(){
    newTask = {
    "title": "",
    "description": "",
    "duedate": "",
    "priority": "",
    "assignedPersons": [],
    "category": "",
    "subtasks": []
    };
}

function checkAndCreateTask(){
    console.log("hello");
    checkDueDate();

    if (checkRequiredFields()){
        createTask();
        tasks.push(newTask);
    }
    
    // Weiterleitung auf Board Seite
    // Hinweise geben
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
    let assignedPersons = [];
    for (let personIdx = 0; personIdx < assignedToList.length; personIdx++) {
        if (assignedToList[personIdx]){
            assignedPersons.push(personIdx);
        }
    }
    return assignedPersons;
}









// Entertaste um Subtask zu erstellen
// Prüfung... Subtask muss gefüllt sein

















