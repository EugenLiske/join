// Assigned To Selection ------------------------------------------------------------------
// Initial Functions


function initContactSearchList(contacts){
    contactListNames = [];
    const keys = Object.keys(contacts);
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        contactListNames.push(contacts[keys[keyIdx]].name);
    }
}


function initAssignedPersons(contacts){
    assignedPersons = [];
    const keys = Object.keys(contacts);
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        assignedPersons.push(false);
    }
}


// Event Listener

function closeDropDownAssignedToSelection(event){
    const containerAssignedTo = document.getElementById('selection_container_assignedto');
    if (containerAssignedTo && !containerAssignedTo.contains(event.target)) {
        if (!document.getElementById('selection').classList.contains("d_none")){
            toggleInputElement();
        }
    }    
}


// Selection

function startNameSearch(){
    let input = document.getElementById("task_assignedto_input").value;
    getContactSearchResult(input);
    createContactDropDownSearchList();
    document.getElementById("selection").classList.remove("d_none");
    toggleDropDownIcon("task_assignedto_input", "drop_down_persons");
}


function getContactSearchResult(input){
    idxOfSearchedContacts = [];
    for (let personIdx = 0; personIdx < contactListNames.length; personIdx++) {
        if (contactListNames[personIdx].toLowerCase().includes(input.toLowerCase())){
            idxOfSearchedContacts.push(personIdx);
        }
    }
}


function createContactDropDownSearchList(){
    let personSelectionRef = document.getElementById("selection");
    let selection = "";
    let personIdx = 0;
    let assignedTo = false;
    let selectedDesignClass = "";
    let personKeys = Object.keys(persons);
    
    for (let resultIdx = 0; resultIdx < idxOfSearchedContacts.length; resultIdx++) {
        personIdx = idxOfSearchedContacts[resultIdx];
        assignedTo = assignedPersons[personIdx];
        selectedDesignClass = assignedTo == true ? "person_selected" : "";
        if (persons[personKeys[personIdx]].id !== undefined && persons[personKeys[personIdx]].id !== null){
            selection += getListElementTemplate2(selectedDesignClass, personIdx, "contact_" + persons[personKeys[personIdx]].id, assignedTo);
        }
    }
    personSelectionRef.innerHTML = selection;
}


function selectPerson(element, personIdx){
    element.classList.toggle("person_selected");

    let checkbox = getCheckbox(element);
    let checked = element.classList.contains("person_selected");
    toggleCheckbox(checked, checkbox);
    assignedPersons[personIdx] = checked;
    renderAssignedToList();
}


function getCheckbox(parent){
    return parent.childNodes[3];
}


function toggleCheckbox(checked, checkbox){
    if (checked){
        checkbox.src = "../assets/img/icons/task/checkbox_tick.svg";
    }
    else{
        checkbox.src = "../assets/img/icons/task/checkbox.svg";
    }
}


function getCheckboxImg(checked){
    return checked ? "../assets/img/icons/task/checkbox_tick.svg" : "../assets/img/icons/task/checkbox.svg";
}


function toggleSelectionList(listId, iconId){
    document.getElementById(listId).classList.toggle("d_none");
    toggleDropDownIcon(listId, iconId);
}


function hideSelectionList(listId, iconId){
    document.getElementById(listId).classList.add("d_none");
    toggleDropDownIcon(listId, iconId);
}


function toggleDropDownIcon(inputId, iconId){
    let selectionRef = document.getElementById(inputId);
    let dropDownRef = document.getElementById(iconId);

    if (selectionRef.classList.contains("d_none")){
        dropDownRef.src="../assets/img/icons/drop_down/arrow.svg";
    }
    else{
        dropDownRef.src="../assets/img/icons/drop_down/arrow_close.svg";
    }
}


function toggleInputElement(){
    document.getElementById("task_assignedto_button").classList.toggle("d_none");
    document.getElementById("task_assignedto_input").classList.toggle("d_none");

    toggleSelectionList('selection', 'drop_down_persons');
    togglePersonSelection();
}


function togglePersonSelection(){
    document.getElementById("selected_persons").classList.toggle("d_none");
}


function renderAssignedToList(){
    let selectedPersonContainer = document.getElementById("selected_persons");

    let firstThreeAssignments = {"counter": 0, "htmlTemplate": ""};
    getFirstThreeAssignments2(firstThreeAssignments);
    
    if (firstThreeAssignments.counter > 3){
        firstThreeAssignments.htmlTemplate += getAssignedToIconTemplate("grey", "+ " + (firstThreeAssignments.counter-3));
    }
    selectedPersonContainer.innerHTML = firstThreeAssignments.htmlTemplate;
}


function getFirstThreeAssignments(firstThreeAssignments){
    for (let persIdx = 0; persIdx < assignedPersons.length; persIdx++) {
        if (assignedPersons[persIdx]){
            firstThreeAssignments.counter++;
            if (firstThreeAssignments.counter <= 3){
                firstThreeAssignments.htmlTemplate += getAssignedToIconTemplate(persons[persIdx].color, persons[persIdx].initials);
            }
        }
    }
}


function getFirstThreeAssignments2(firstThreeAssignments){
    let personsKeys = Object.keys(persons);
    
    for (let persIdx = 0; persIdx < assignedPersons.length; persIdx++) {
        if (assignedPersons[persIdx]){
            firstThreeAssignments.counter++;
            if (firstThreeAssignments.counter <= 3){
                firstThreeAssignments.htmlTemplate += getAssignedToIconTemplate(persons[personsKeys[persIdx]].avatarColor, generateInitials(persons[personsKeys[persIdx]].name));
            }
            
        }
    }
}


function clearAssignedToInputArea(contacts){
    
    document.getElementById("selected_persons").innerHTML = "";
    document.getElementById("selected_persons").classList.remove("d_none");

    initAssignedPersons(contacts);
    getContactSearchResult("");
    createContactDropDownSearchList();

    document.getElementById("task_assignedto_button").classList.remove("d_none");
    document.getElementById("task_assignedto_input").classList.add("d_none");
}