
/**
 * Fetches contacts using the getContacts function, extracts their names, and returns them as an array.
 *
 * @async
 * @returns {Promise<string[]>} A promise that resolves to an array of contact names. Returns an empty array if no contacts are found.
 */
async function initContactSearchList(){
    const contacts = await getContacts();
    if (!contacts) return [];
    const names = Object.values(contacts).map(c => c.name);
    return names;
}


/**
 * Initializes an array of boolean flags for assigned persons.
 * Each flag corresponds to a person in the provided names array and is initially set to false.
 *
 * @param {string[]} names - An array of person names to assign flags for.
 * @returns {boolean[]} An array of boolean flags, all initialized to false.
 */
function initAssignedPersons(names){
    return Array(names.length).fill(false);
}


/**
 * Searches for contacts in the provided name list that include the given input string (case-insensitive).
 *
 * @param {string} input - The search string to look for within the contact names.
 * @param {string[]} nameList - An array of contact names to search through.
 * @returns {number[]} An array of indices representing the positions in nameList where the contact name includes the input string.
 */
function getContactNameSearchIndices(input, nameList){
    let searchResult = [];
    const lowerInput = input.toLowerCase();
    for (let personIdx = 0; personIdx < nameList.length; personIdx++) {
        if (nameList[personIdx].toLowerCase().includes(lowerInput)){
            searchResult.push(personIdx);
        }
    }
    return searchResult;
}


/**
 * Renders a dropdown search list of contacts for assignment selection.
 *
 * @param {number[]} searchedPersons - Array of indices representing the filtered/search-matched persons.
 * @param {boolean[]} assignedList - Array indicating whether each person is currently assigned (true) or not (false).
 * @param {Object} contacts - Object containing all available contacts, keyed by unique identifiers.
 */
function createContactDropDownSearchList(searchedPersons, assignedList, contacts){
    if (contacts){
        let personSelectionRef = document.getElementById("selection");
        let selection = "";
        let contactKeys = Object.keys(contacts);
        
        for (let searchIdx = 0; searchIdx < searchedPersons.length; searchIdx++) {
            selection += createContactDropDownSearchListElement(searchedPersons, assignedList, searchIdx, contacts, contactKeys);
        }
        personSelectionRef.innerHTML = selection;        
    }

}


/**
 * Creates a dropdown list element for a contact in the "Assigned To" search list.
 *
 * @param {number[]} searchedPersons - Array of indices representing the filtered/search-matched persons.
 * @param {boolean[]} assignedList - Array indicating whether each person is currently assigned (true) or not (false).
 * @param {number} searchIdx - Index in the searchedPersons array for the current person.
 * @param {Object} contacts - Object containing contact data, keyed by contactKeys.
 * @param {string[]} contactKeys - Array of keys to access contacts in the contacts object.
 * @returns {string} The HTML string for the dropdown list element if the contact has a valid id, otherwise an empty string.
 */
function createContactDropDownSearchListElement(searchedPersons, assignedList, searchIdx, contacts, contactKeys){
    const personIdx = searchedPersons[searchIdx];
    const assignedTo = assignedList[personIdx];
    const selectedDesignClass = assignedTo == true ? "person_selected" : "";

    if (contacts[contactKeys[personIdx]].id !== undefined && contacts[contactKeys[personIdx]].id !== null){
        return getListElementTemplate(selectedDesignClass, personIdx, "contact_" + contacts[contactKeys[personIdx]].id, assignedTo, contacts);
    }   
    return ""; 
}


/**
 * Returns the fourth child node (index 3) of the given parent element, 
 * which is assumed to be a checkbox element.
 *
 * @param {HTMLElement} parent - The parent DOM element containing the checkbox.
 * @returns {Node} The checkbox node at index 3 of the parent's childNodes.
 */
function getCheckbox(parent){
    return parent.childNodes[3];
}


/**
 * Toggles the checkbox image source based on the checked state.
 *
 * @param {boolean} checked - Indicates whether the checkbox is checked.
 * @param {HTMLImageElement} checkbox - The image element representing the checkbox.
 */
function toggleCheckbox(checked, checkbox){
    checkbox.src = getCheckboxImg(checked);
}


/**
 * Returns the file path of the checkbox image based on the checked state.
 *
 * @param {boolean} checked - Indicates whether the checkbox is checked.
 * @returns {string} The file path to the appropriate checkbox image.
 */
function getCheckboxImg(checked){
    return checked ? "../assets/img/icons/task/checkbox_tick.svg" : "../assets/img/icons/task/checkbox.svg";
}


function togglePersonIconsList(){
    document.getElementById("selected_persons").classList.toggle("d_none");
}


/**
 * Renders a list of person icons representing assigned contacts into the DOM element with the ID "selected_persons".
 * Displays up to three assigned contacts as icons, and if there are more than three, adds a "+ N" icon to indicate additional assignments.
 *
 * @param {boolean[]} assignedList - The list of assigned contact identifiers.
 * @param {Object} contacts - The list of all contact objects.
 */
function renderPersonIconsList(assignedList, contacts){
    const selectedPersonContainer = document.getElementById("selected_persons");

    const firstThreeAssignments = {"counter": 0, "htmlTemplate": ""};
    getFirstThreeAssignments(firstThreeAssignments, assignedList, contacts);
    
    if (firstThreeAssignments.counter > 3){
        firstThreeAssignments.htmlTemplate += getAssignedToIconTemplate("grey", "+ " + (firstThreeAssignments.counter-3));
    }
    selectedPersonContainer.innerHTML = firstThreeAssignments.htmlTemplate;
}


/**
 * Updates the `firstThreeAssignments` object by incrementing its counter and appending HTML templates
 * for up to the first three assigned contacts from the `assignedList`. For each assigned contact,
 * it generates an icon template using the contact's avatar color and initials.
 *
 * @param {Object} firstThreeAssignments - An object containing a `counter` (number) and `htmlTemplate` (string) property.
 * @param {boolean[]} assignedList - An array indicating which contacts are assigned (true) or not (false).
 * @param {Object} contacts - An object where keys are contact identifiers and values are contact objects with at least `avatarColor` and `name` properties.
 */
function getFirstThreeAssignments(firstThreeAssignments, assignedList, contacts){
    const contactsKeys = Object.keys(contacts);
    
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

