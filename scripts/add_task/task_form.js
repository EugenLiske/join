// Alle Funktionen die direkt über das Formular ausgeführt werden


let contactListNames = []; //list with all names from contacts
let idxOfSearchedContacts = []; //list of idx of persons containing the search text
let assignedPersons = []; //list with boolean - one entry for a person from the search list; if the person contains the search text, then true, otherwise false

let nextSubtaskId = 0;

let formContacts = null;

function getContactListNames(){
    return contactListNames;
}

function getSearchedContacts(){
    return idxOfSearchedContacts;
}

function getAssigned(){
    return assignedPersons;
}

function getFormContacts(){
    return formContacts;
}

function setSubtaskId(subtaskId){
    nextSubtaskId = subtaskId;
}

// EventListener -------------------------------------------------------------------

document.addEventListener('click', function(event) {
    closeDropDownAssignedToSelection(event);
    closeDropDownCategorySelection(event);
});


// Initial Function -----------------------------------------------------------------

async function initTaskForm(){
    formContacts = await getContacts();
    contactListNames = await initContactSearchList();
    assignedPersons = initAssignedPersons(contactListNames);
    
    idxOfSearchedContacts = getContactSearchResult("", contactListNames);
    createContactDropDownSearchList(idxOfSearchedContacts, assignedPersons, formContacts);

    renderCategoryOptions();
    nextSubtaskId = 0;
}


// Specific Functions Task From ---------------------------------------------------


function toggleDropDownSelection(listId, iconId){
    document.getElementById(listId).classList.toggle("d_none");
    toggleDropDownIcon(listId, iconId);
}


// Priority
function togglePriorityButtons(element, priority){
    clearPriorityButtons("all");

    element.disabled = true;
    element.classList.replace(priority + "_color_default", priority + "_color_click");
    element.children[0].classList.remove("priority_btn_c_txt_default");
    element.children[1].src = setIconPriority(priority);
}

// Assigned to
function toggleButtonAndInputElement(){
    document.getElementById("task_assignedto_button").classList.toggle("d_none");
    document.getElementById("task_assignedto_input").classList.toggle("d_none");

    toggleDropDownSelection('selection', 'drop_down_persons');
    togglePersonIconsList();
}


function startNameSearch(){
    let input = document.getElementById("task_assignedto_input").value;
    idxOfSearchedContacts = getContactSearchResult(input, contactListNames);
    createContactDropDownSearchList(idxOfSearchedContacts, assignedPersons, formContacts);
    document.getElementById("selection").classList.remove("d_none");
    toggleDropDownIcon("task_assignedto_input", "drop_down_persons");
}


function selectPerson(element, personIdx){
    element.classList.toggle("person_selected");

    let checkbox = getCheckbox(element);
    let checked = element.classList.contains("person_selected");
    toggleCheckbox(checked, checkbox);
    assignedPersons[personIdx] = checked;
    renderPersonIconsList(assignedPersons, formContacts);
}


function clearAssignedToInputArea(){
    clearPersonIcons();
    assignedPersons = initAssignedPersons(formContacts);
    idxOfSearchedContacts = getContactSearchResult("", contactListNames);
    createContactDropDownSearchList(idxOfSearchedContacts, assignedPersons, formContacts);
    defaultAssignedInput();
}


function getAssignedPersons(){
    let assigned = {};
    let personsKeys = Object.keys(formContacts);
    for (let personIdx = 0; personIdx < assignedPersons.length; personIdx++) {
        if (assignedPersons[personIdx]){
            let personKey = "contact_" + formContacts[personsKeys[personIdx]].id;
            
            assigned[personKey] = formContacts[personsKeys[personIdx]].id;
        }
    }
    return assigned;
}

// Category
function setCategorySelection(category){
    showCategorySelection(category);
    renderCategoryOptions();
}

// Subtasks
function addSubtaskOrToggleIcons(event){
    if (event.key === 'Enter' && document.getElementById("subtask_input").value.length > 0) {
        addSubtaskToList();
    }
    else {
        toggleDeleteAndAddIcons();
    }
}


function addSubtaskToList(){
    let inputSubtask = document.getElementById("subtask_input");
    let input = inputSubtask.value;
    let subtasksContainer = document.getElementById("subtasks_container");
    subtasksContainer.innerHTML += getSubtaskTemplate(input, nextSubtaskId);
    nextSubtaskId++;
    inputSubtask.value = "";
    toggleDeleteAndAddIcons();
}


function cancelSubtask(){
    let inputSubtask = document.getElementById("subtask_input");
    inputSubtask.value = "";
    toggleDeleteAndAddIcons();
}


function deleteSubtask(event, subtaskID) {
    event.stopPropagation();
    
    document.getElementById("subtask_element_" + subtaskID).remove();
}


function openEditMode(subtaskID){
    document.getElementById("edit_mode_" + subtaskID).classList.remove("d_none");
}


function saveAndCloseEditMode(event, subtaskID){
    event.stopPropagation();

    let input = document.getElementById("edit_subtask_input_" + subtaskID).value;
    document.getElementById("subtask_" + subtaskID).innerText = input;
    document.getElementById("edit_mode_" + subtaskID).classList.add("d_none");
}

// Create Task or Ok Button

function checkAndEnableButton(mode = "add_task"){
    let createButtonRef = document.getElementById("create_task_button");
    if (checkRequiredFieldsToEnableButton(mode)){
        createButtonRef.disabled = false;
    }
    else {
        createButtonRef.disabled = true;
    }
}


function deleteTaskForm(kind = "add"){
    if (kind === "add")
        document.getElementById("add_task_form").innerHTML = "";
    else if (kind === "edit"){
        document.getElementById("edit_task_form").innerHTML = "";
    }
}
