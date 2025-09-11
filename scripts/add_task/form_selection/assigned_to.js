// Assigned To Selection ------------------------------------------------------------------
// Initial Functions

function getNameSearchList(){
    for (let personIdx = 0; personIdx < persons.length; personIdx++) {
        nameSearchList.push(persons[personIdx].name);
    }
}


function getNameSearchList2(){
    const keys = Object.keys(persons);
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        nameSearchList.push(persons[keys[keyIdx]].name);
    }
}


function initAssignedToList(){
    assignedToList = [];
    for (let personIdx = 0; personIdx < persons.length; personIdx++) {
        assignedToList.push(false);
    }
}


function initAssignedToList2(){
    const keys = Object.keys(persons);
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        assignedToList.push(false);
    }
}


// Event Listener

function closeDropDownAssignedToSelection(event){
    const containerAssignedTo = document.getElementById('selection_container_assignedto');
    if (!containerAssignedTo.contains(event.target)) {
        if (!document.getElementById('selection').classList.contains("d_none")){
            toggleInputElement();
        }
    }    
}


// Selection

function startNameSearch(){
    let input = document.getElementById("task_assignedto_input").value;
    getSearchListResult(input);
    renderSearchNames();
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


function renderSearchNames(){
    let personSelectionRef = document.getElementById("selection");
    let selection = "";
    let personIdx = 0;
    let assignedTo = false;
    let selectedDesignClass = "";
    let personKeys = Object.keys(persons);

    // Iteriert über Namen aus dem Suchergebnis
    for (let resultIdx = 0; resultIdx < nameSearchListResult.length; resultIdx++) {
        personIdx = nameSearchListResult[resultIdx];
        assignedTo = assignedToList[personIdx];
        selectedDesignClass = assignedTo == true ? "person_selected" : "";
        selection += getListElementTemplate2(selectedDesignClass, personIdx, "contact_" + persons[personKeys[personIdx]].id, assignedTo);
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
        firstThreeAssignments.htmlTemplate += getAssignedToTemplate("grey", "+ " + (firstThreeAssignments.counter-3));
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


function getFirstThreeAssignments2(firstThreeAssignments){
    let personsKeys = Object.keys(persons);
    
    for (let persIdx = 0; persIdx < assignedToList.length; persIdx++) {
        if (assignedToList[persIdx]){
            firstThreeAssignments.counter++;
            if (firstThreeAssignments.counter <= 3){
                firstThreeAssignments.htmlTemplate += getAssignedToTemplate(persons[personsKeys[persIdx]].avatarColor, generateInitials(persons[personsKeys[persIdx]].name));
            }
        }
    }
}


function clearAssignedToInputArea(){
    
    document.getElementById("selected_persons").innerHTML = "";
    document.getElementById("selected_persons").classList.remove("d_none");

    initAssignedToList();
    getSearchListResult("");
    renderSearchNames();

    document.getElementById("task_assignedto_button").classList.remove("d_none");
    document.getElementById("task_assignedto_input").classList.add("d_none");
}