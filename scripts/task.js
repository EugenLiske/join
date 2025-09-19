
// --- Task Overlay --------------------------------------------------------------
// Contacts have already been loaded from the board when displaying.


async function displayTaskOverlay(taskId){
    await getTaskFromDB(taskId);
    toggleOverlay("overlay_task");
    renderCurrentTask();
    toggleScrollBehaviorOfBody('hidden');
}


function renderCurrentTask(){
    const taskKeys = Object.keys(currentTask);
    if (taskKeys.includes("title")) document.getElementById("task_title").innerText = currentTask.title;
    if (taskKeys.includes("description")) document.getElementById("task_description").innerText = currentTask.description;
    if (taskKeys.includes("duedate")) document.getElementById("duedate").innerText = changeDateFormat2(currentTask.duedate);
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


function findSubtaskAndToggleCheckbox(idx){
    const keys = Object.keys(currentTask.subtasks);
    const subtask = currentTask.subtasks[keys[idx]];
    subtask.status = !subtask.status;
    document.getElementById("checkbox_" + idx).src = getCheckboxSubtask(subtask.status);
}


async function saveSubtaskChanges(){
    if (currentTask["subtasks"]){
        console.log(currentTask["subtasks"]);
        updateTask(currentTask.id, {"subtasks": currentTask["subtasks"]});
        await setData(currentTask["subtasks"], "/tasks/task_" + currentTask.id + "/subtasks");
        console.log(currentTask);
        updateProgressbar(currentTask.id);
        
    }
    return true;

}


function updateProgressbar(taskId){
    const progressbarRef = document.getElementById("progressbar_" + taskId);
    const values = countArchievedSubtasks(currentTask["subtasks"]);
    let percent = values.counter/values.amount*100;
    progressbarRef.style = "width: " + percent + "%";
    if (percent == 100){
        progressbarRef.classList.replace("subtasks_outstanding", "all_subtasks_completed");
    } else {
        progressbarRef.classList.replace("all_subtasks_completed", "subtasks_outstanding");
    }
    const progressTextRef = document.getElementById("progress_text_" + taskId);
    progressTextRef.innerText = values.counter + "/" + values.amount + " Subtasks";
}


async function deleteCurrentTask(){
    toggleOverlay("overlay_task");
    deleteTaskFromArray(currentTask.id)
    deleteTaskFromFirebase(currentTask.id);
    document.getElementById("task_card_" + currentTask.id).remove();
}



function editCurrentTask(){
    displayEditTaskOverlay(currentTask.id);
}


// --- Board - Task Card -------------------------------------------------------------------------------------------------------

// Ausgewählte max. 3 ausgewählte Personen anzeigen
// Container existiert noch nicht
function buildAssignedToTemplate(task){
    if (task["assignedPersons"]){
        let htmlContainer = `<ul id="task_assigned_to" class="bct_assigned_to_list">`;
        const assignedPersons = task["assignedPersons"];
        htmlContainer += getAssignedPersonsHTML(assignedPersons, "icon", true, "li");
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
        let progressbarColor = values.counter/values.amount == 1 ? "all_subtasks_completed" : "subtasks_outstanding";
        return getProgressbarTemplate(task.id, values.counter, values.amount, progressbarColor);
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


function getAssignedPersonsHTML(assignedPersons, selection = "icon", limited = false, container = "div"){
    let htmlContainer = "";
    let counter = 0;
    for (const personKey in assignedPersons) {
        const assignedPerson = searchAssignedPersonInContacts(assignedPersons[personKey]);
        if (assignedPerson){
            if (!limited || counter < 3){
                htmlContainer += assignedToTemplateSelector(selection, assignedPerson, container);
            }
            counter++;
        }
    }        
    return htmlContainer + getAssignedToPlaceholder(counter, 3, limited, container);
}


function assignedToTemplateSelector(selection, person, container = "div"){
    if (selection === "icon"){
        return getAssignedToIconTemplate(person.avatarColor, generateInitials(person.name), container);
    }
    if (selection === "icon_and_name"){
        return assignedToListElementTemplate(person);
    }
    if (selection === "")
    return "";
}


function getAssignedToPlaceholder(counter, limit, limited = true, container = "div"){
    if (limited && counter > limit){
        return getAssignedToIconTemplate("grey", "+ " + (counter - 3), container);
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