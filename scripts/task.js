
// --- Task Overlay --------------------------------------------------------------
// Contacts have already been loaded from the board when displaying.


async function displayTaskOverlay(taskId){
    await getTaskFromDB(taskId);
    // getTaskLocal(taskId);
    toggleOverlay("overlay_task");
    renderCurrentTask();
}


// function getTaskLocal(taskId){
//     // currentTaskKey = "task_" + taskId;
//     console.log(taskId);
    
//     console.log(allTasks[taskId]);
    
//     currentTask = allTasks[taskId];
// }


function renderCurrentTask(){
    const taskKeys = Object.keys(currentTask);
    if (taskKeys.includes("title")) document.getElementById("task_title").innerText = currentTask.title;
    if (taskKeys.includes("description")) document.getElementById("task_description").innerText = currentTask.description;
    if (taskKeys.includes("duedate")) document.getElementById("dueDate").innerText = changeDateFormat2(currentTask.duedate);
    if (taskKeys.includes("priority")) displayPriority(currentTask["priority"]);
    if (taskKeys.includes("assignedPersons")) {displayAssignedToPersons(currentTask["assignedPersons"])} else {document.getElementById("task_overlay_assigned_to").innerHTML = ""};
    if (taskKeys.includes("category")) displayCategory(currentTask["category"]);
    if (taskKeys.includes("subtasks")) {displaySubtasks(currentTask["subtasks"])} else {document.getElementById("subtask_list").innerHTML = ""};
}


function displayCategory(category){
    let number = getCategoryNumber(category);
    const categoryRef = document.getElementById("task_category");
    categoryRef.classList = "category";
    categoryRef.classList.add("category_bg_color" + number);
    categoryRef.innerText = category;
}


function displayPriority(priority){
    const priorityRef = document.getElementById("task_priority");
    priorityRef.innerHTML = getPriorityTemplate(priority);
}


function displayAssignedToPersons(assignedPersons){
    const listContainerRef = document.getElementById("task_overlay_assigned_to");
    listContainerRef.innerHTML = getAssignedPersonsHTML(assignedPersons, "icon_and_name", false);
}


function displaySubtasks(subtasks){
    const keys = Object.keys(subtasks);
    const listContainerRef = document.getElementById("subtask_list");
    let subtask = null;

    listContainerRef.innerHTML = "";
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        subtask = subtasks[keys[keyIdx]];
        listContainerRef.innerHTML += subtaskListElementTemplate(subtask, keyIdx);
    }    
}


function getCheckboxSubtask(status){
    return status ? "../assets/img/icons/task/checkbox_tick_dark.svg" : "../assets/img/icons/task/checkbox.svg";
}


function toggleCheckboxSubtask(idx){
    const keys = Object.keys(currentTask.subtasks);
    const subtask = currentTask.subtasks[keys[idx]];
    subtask.status = !subtask.status;
    document.getElementById("checkbox_" + idx).src = getCheckboxSubtask(subtask.status);
}


function saveChangesLocal(){
    return true;
    // if (!tasks[currentTaskKey]["subtasks"]) return;
    // tasks[currentTaskKey]["subtasks"] = currentTask["subtasks"];
    // save Changes in DB
}


function deleteCurrentTask(){
    toggleOverlay("overlay_task");
    delete tasks[currentTaskKey];
    console.log(tasks);
    // save Changes in DB
}


function editCurrentTask(){
    console.log("Open edit!");
    // Open edit
}


// --- Board - Task Card -------------------------------------------------------------------------------------------------------

// Ausgewählte max. 3 ausgewählte Personen anzeigen
// Container existiert noch nicht
function buildAssignedToTemplate(task){
    if (task["assignedPersons"]){
        let htmlContainer = `<ul id="task_assigned_to" class="bct_assigned_to_list">`;
        const assignedPersons = task["assignedPersons"];
        htmlContainer += getAssignedPersonsHTML(assignedPersons, "icon", true);
        return htmlContainer + `</ul>`;

    }
    return "<ul></ul>";
}



function getCategory(category){
    return getCategoryLabelTemplate(category)
}


function getCategoryNumber(category){
    return ["User Story", "Technical Task"].indexOf(category);
}


function getPriorityIcon(priority){
    if (priority == "urgent"){
        return "urgent_red.svg";
    }
    if (priority == "medium"){
        return "medium_yellow.svg";
    }
    return "low_green.svg";
}

function buildDescriptionContainer(task){
    if(task["description"]){
        return getShortDescriptionTemplate(task['description']);
    }
    return "";
}


function shortenText(text, limit) {
    if (text.length <= limit) return text;
    let cut = text.slice(0, limit);
    
    if (/\S/.test(text[limit])) {
        cut = cut.replace(/\s+\S*$/, '');
    }
    return cut.trim() + '...';
}

function buildSubtaskProgressbar(task){
    if (task["subtasks"]){
        const subtasks = task["subtasks"];
        const values = countArchievedSubtasks(subtasks);
        return getProgressbarTemplate(values.counter, values.amount);
    }
    return "";
}

function countArchievedSubtasks(subtasks){
    let subtaskKeys = Object.keys(subtasks);
    let subtasksAmount = subtaskKeys.length;
    let counter = 0;
    for (let index = 0; index < subtasksAmount; index++) {
        if (subtasks[subtaskKeys[index]].status){
            counter++;
        }
    }
    return {"amount": subtasksAmount, "counter": counter};
}


// --- Globale Funktionen -----------------------------------------------------------------------------------------

function searchAssignedPersonInContacts(assignedPersonId){
    for (const key in persons) {
        const contact = persons[key];
        if (assignedPersonId == contact.id) {
            return contact;
        }
    }
    return null;
}


function getAssignedPersonsHTML(assignedPersons, selection = "icon", limited = false){
    let htmlContainer = "";
    let counter = 0;
    for (const personKey in assignedPersons) {
        const assignedPerson = searchAssignedPersonInContacts(assignedPersons[personKey]);
        if (assignedPerson){
            if (!limited || counter < 3){
                htmlContainer += assignedToTemplateSelector(selection, assignedPerson);
            }
            counter++;
        }
    }        
    return htmlContainer + getAssignedToPlaceholder(counter, 3, limited);
}


function assignedToTemplateSelector(selection, person){
    if (selection === "icon"){
        return getAssignedToIconTemplate(person.avatarColor, generateInitials(person.name));
    }
    if (selection === "icon_and_name"){
        return assignedToListElementTemplate(person);
    }
    if (selection === "")
    return "";
}


function getAssignedToPlaceholder(counter, limit, limited = true){
    if (limited && counter >= limit){
        return getAssignedToIconTemplate("grey", "+ " + (counter - 3));
    }
    return "";
}
// Archiv ---------------------------------------------------------------------------------------------------------

// function getTaskLocal(taskId){
//     currentTaskKey = "task_" + taskId;
//     currentTask = tasks[currentTaskKey];
// }

// function searchAssignedPersonInContacts(assignedPersonId){
//     const contactKeys = Object.keys(persons);
//     let contact = null;
//     for (let contactKeyIdx = 0; contactKeyIdx < contactKeys.length; contactKeyIdx++) {
//         contact = persons[contactKeys[contactKeyIdx]];
//         if (assignedPersonId == contact.id){ 
//             return contact;
//         }
//     }     
//     return null;
// }