
let contactListNames = [];
let idxOfSearchedContacts = [];
let assignedPersons = [];

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


/**
 * Global click event listener.
 * 
 * Closes any open dropdowns related to:
 * - Assigned persons selection
 * - Category selection
 * 
 * @param {MouseEvent} event - The click event object.
 */
document.addEventListener('click', function(event) {
    closeDropDownAssignedToSelection(event);
    closeDropDownCategorySelection(event);
});


function closeDropDownCategorySelection(event){
    const containerCategory = document.getElementById('selection_container_category');
    if (containerCategory && !containerCategory.contains(event.target)) {
        hideSelectionList('category_options', 'drop_down_categories')
    }        
}


/**
 * Hides the selection list by adding the "d_none" class to the element with the given listId,
 * and toggles the dropdown icon associated with the list.
 *
 * @param {string} listId - The ID of the selection list element to hide.
 * @param {string} iconId - The ID of the dropdown icon element to toggle.
 */
function hideSelectionList(listId, iconId){
    document.getElementById(listId).classList.add("d_none");
    toggleDropDownIcon(listId, iconId);
}


function closeDropDownAssignedToSelection(event){
    const containerAssignedTo = document.getElementById('selection_container_assignedto');
    if (containerAssignedTo && !containerAssignedTo.contains(event.target)) {
        if (!document.getElementById('selection').classList.contains("d_none")){
            toggleButtonAndInputElement();
        }
    }    
}


/**
 * Initializes the task form.
 * 
 * - Loads contact data and initializes the assigned persons array.
 * - Creates the dropdown list for contact search results.
 * - Renders category options.
 * - Resets the subtask ID counter.
 * 
 * @async
 */
async function initTaskForm(){
    formContacts = await getContacts();
    contactListNames = await initContactSearchList();
    assignedPersons = initAssignedPersons(contactListNames);
    
    idxOfSearchedContacts = getContactNameSearchIndices("", contactListNames);
    createContactDropDownSearchList(idxOfSearchedContacts, assignedPersons, formContacts);

    renderCategoryOptions();
    nextSubtaskId = 0;
}


/**
 * Toggles the visibility of a dropdown and its associated icon.
 * 
 * @param {string} listId - The ID of the dropdown list element.
 * @param {string} iconId - The ID of the dropdown icon element to toggle.
 */
function toggleDropDownSelection(listId, iconId){
    document.getElementById(listId).classList.toggle("d_none");
    toggleDropDownIcon(listId, iconId);
}


/**
 * Toggles the priority selection for a task.
 * 
 * @param {HTMLElement} element - The button element that was clicked.
 * @param {string} priority - The selected priority (e.g., 'urgent', 'medium', 'low').
 */
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
    idxOfSearchedContacts = getContactNameSearchIndices(input, contactListNames);
    createContactDropDownSearchList(idxOfSearchedContacts, assignedPersons, formContacts);
    document.getElementById("selection").classList.remove("d_none");
    toggleDropDownIcon("task_assignedto_input", "drop_down_persons");
}


/**
 * Toggles the selection of a person in the assigned contacts list.
 * 
 * - Updates the checkbox and visual state of the element.
 * - Updates the `assignedPersons` array accordingly.
 * - Re-renders the list of selected person icons.
 * 
 * @param {HTMLElement} element - The HTML element representing the person.
 * @param {number} personIdx - The index of the person in the `assignedPersons` array.
 */
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
    idxOfSearchedContacts = getContactNameSearchIndices("", contactListNames);
    createContactDropDownSearchList(idxOfSearchedContacts, assignedPersons, formContacts);
    defaultAssignedInput();
}


/**
 * Returns an object containing the assigned persons for the current task.
 * 
 * - Iterates through the `assignedPersons` array.
 * - Maps assigned indices to their corresponding contact IDs.
 * 
 * @returns {Object} assigned - An object mapping contact keys to their IDs.
 */
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


/**
 * Sets the selected category and updates the UI accordingly.
 * 
 * @param {string} category - The selected category.
 */
function setCategorySelection(category){
    showCategorySelection(category);
    renderCategoryOptions();
}


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
    const input = inputSubtask.value;
    if (input.trim().length > 0){
        let subtasksContainer = document.getElementById("subtasks_container");
        subtasksContainer.innerHTML += getSubtaskTemplate(input, nextSubtaskId);
        nextSubtaskId++;
        inputSubtask.value = "";
        toggleDeleteAndAddIcons();        
    }
}


function cancelSubtask(){
    let inputSubtask = document.getElementById("subtask_input");
    inputSubtask.value = "";
    toggleDeleteAndAddIcons();
}


/**
 * Deletes a specific subtask element from the DOM.
 * 
 * @param {Event} event - The click event.
 * @param {number} subtaskID - The ID of the subtask to delete.
 */
function deleteSubtask(event, subtaskID) {
    event.stopPropagation();
    document.getElementById("subtask_element_" + subtaskID).remove();
}


/**
 * Enables edit mode for a specific subtask by showing the edit input field.
 * 
 * @param {number} subtaskID - The ID of the subtask to edit.
 */
function openEditMode(subtaskID){
    document.getElementById("edit_mode_" + subtaskID).classList.remove("d_none");
}


/**
 * Saves the edited subtask value and exits edit mode.
 * 
 * @param {Event} event - The event triggering the save action.
 * @param {number} subtaskID - The ID of the subtask being edited.
 */
function saveAndCloseEditMode(event, subtaskID){
    event.stopPropagation();

    let input = document.getElementById("edit_subtask_input_" + subtaskID).value;
    document.getElementById("subtask_" + subtaskID).innerText = input;
    document.getElementById("edit_mode_" + subtaskID).classList.add("d_none");
}


/**
 * Checks if all required fields are filled and enables or disables
 * the create task button accordingly.
 * 
 * @param {string} mode - The mode in which the form is used ("add_task" or "edit_task").
 */
function checkAndEnableButton(mode = "add_task"){
    let buttonId = mode === "add_task" ? "create_task_button" : "update_task_button";
    let createButtonRef = document.getElementById(buttonId);
    createButtonRef.disabled = checkRequiredFieldsToEnableButton(mode) ? false : true;
}


/**
 * Deletes the task form content based on the mode.
 * 
 * @param {string} kind - Specifies whether to delete the "add" or "edit" form.
 */
function deleteTaskForm(kind = "add"){
    if (kind === "add")
        document.getElementById("add_task_form").innerHTML = "";
    else if (kind === "edit"){
        document.getElementById("edit_task_form").innerHTML = "";
    }
}


/**
 * Toggles the dropdown icon based on the visibility of the selection element.
 *
 * @param {string} inputId - The html ID of the selection list element to hide.
 * @param {string} iconId - The html ID of the image element representing the dropdown icon.
 */
function toggleDropDownIcon(inputId, iconId){
    let selectionRef = document.getElementById(inputId);
    let dropDownRef = document.getElementById(iconId);
    dropDownRef.src = selectionRef.classList.contains("d_none") ? "../assets/img/icons/drop_down/arrow.svg" : "../assets/img/icons/drop_down/arrow_close.svg";
}