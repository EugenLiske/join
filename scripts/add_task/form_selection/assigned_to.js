// Assigned To Selection ------------------------------------------------------------------
// Initial Functions


async function initContactSearchList(){
    const contacts = await getContacts();
    let names = [];
    const keys = Object.keys(contacts);
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        names.push(contacts[keys[keyIdx]].name);
    }
    return names;
}


function initAssignedPersons(names){
    let flags = [];

    for (let nameIdx = 0; nameIdx < names.length; nameIdx++) {
        flags.push(false);
    }
    return flags;
}


// Event Listener

function closeDropDownAssignedToSelection(event){
    const containerAssignedTo = document.getElementById('selection_container_assignedto');
    if (containerAssignedTo && !containerAssignedTo.contains(event.target)) {
        if (!document.getElementById('selection').classList.contains("d_none")){
            toggleButtonAndInputElement();
        }
    }    
}


// Selection

function getContactSearchResult(input, nameList){
    let searchResult = [];
    for (let personIdx = 0; personIdx < nameList.length; personIdx++) {
        if (nameList[personIdx].toLowerCase().includes(input.toLowerCase())){
            searchResult.push(personIdx);
        }
    }
    return searchResult;
}

// Drop Down - Initial

function createContactDropDownSearchList(searchedPersons, assignedList, contacts){
    let personSelectionRef = document.getElementById("selection");
    let selection = "";
    let contactKeys = Object.keys(contacts);
    
    for (let searchIdx = 0; searchIdx < searchedPersons.length; searchIdx++) {
        selection += createContactDropDownSearchListElement(searchedPersons, assignedList, searchIdx, contacts, contactKeys);
    }
    personSelectionRef.innerHTML = selection;
}


function createContactDropDownSearchListElement(searchedPersons, assignedList, searchIdx, contacts, contactKeys){
    const personIdx = searchedPersons[searchIdx];
    const assignedTo = assignedList[personIdx];
    const selectedDesignClass = assignedTo == true ? "person_selected" : "";

    if (contacts[contactKeys[personIdx]].id !== undefined && contacts[contactKeys[personIdx]].id !== null){
        return getListElementTemplate2(selectedDesignClass, personIdx, "contact_" + contacts[contactKeys[personIdx]].id, assignedTo, contacts);
    }   
    return false; 
}

// Drop Down - Selection


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


function togglePersonIconsList(){
    document.getElementById("selected_persons").classList.toggle("d_none");
}


function renderPersonIconsList(assignedList, contacts){
    let selectedPersonContainer = document.getElementById("selected_persons");

    let firstThreeAssignments = {"counter": 0, "htmlTemplate": ""};
    getFirstThreeAssignments(firstThreeAssignments, assignedList, contacts);
    
    if (firstThreeAssignments.counter > 3){
        firstThreeAssignments.htmlTemplate += getAssignedToIconTemplate("grey", "+ " + (firstThreeAssignments.counter-3));
    }
    selectedPersonContainer.innerHTML = firstThreeAssignments.htmlTemplate;
}


function getFirstThreeAssignments(firstThreeAssignments, assignedList, contacts){
    let contactsKeys = Object.keys(contacts);
    
    for (let persIdx = 0; persIdx < assignedList.length; persIdx++) {
        if (assignedList[persIdx]){
            firstThreeAssignments.counter++;
            if (firstThreeAssignments.counter <= 3){
                firstThreeAssignments.htmlTemplate += getAssignedToIconTemplate(contacts[contactsKeys[persIdx]].avatarColor, generateInitials(contacts[contactsKeys[persIdx]].name));
            }
        }
    }
}


function clearPersonIcons(){
    document.getElementById("selected_persons").innerHTML = "";
    document.getElementById("selected_persons").classList.remove("d_none");
}


function defaultAssignedInput(){
    document.getElementById("task_assignedto_button").classList.remove("d_none");
    document.getElementById("task_assignedto_input").classList.add("d_none");    
}



// function getFirstThreeAssignments(firstThreeAssignments){
//     for (let persIdx = 0; persIdx < assignedPersons.length; persIdx++) {
//         if (assignedPersons[persIdx]){
//             firstThreeAssignments.counter++;
//             if (firstThreeAssignments.counter <= 3){
//                 firstThreeAssignments.htmlTemplate += getAssignedToIconTemplate(persons[persIdx].color, persons[persIdx].initials);
//             }
//         }
//     }
// }