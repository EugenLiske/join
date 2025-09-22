
// --- Board - Task Card -------------------------------------------------------------------------------------------------------
// Contacts have already been loaded from the board when displaying.

function getCategory(category){
    return getCategoryLabelTemplate(category)
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


function buildAssignedToTemplate(task){
    if (task["assignedPersons"]){
        let htmlContainer = `<ul id="task_assigned_to" class="bct_assigned_to_list">`;
        const assignedPersonsList = task["assignedPersons"];
        htmlContainer += getHTMLTemplateFromContactInfo(assignedPersonsList, "icon", true, "li");
        return htmlContainer + `</ul>`;
    }
    return "<ul></ul>";
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


// --- Task Overlay -----------------------------------------------------------------
// Contacts have already been loaded from the board when displaying.


async function displayTaskOverlay(taskId){
    setCurrentTask(taskId);
    showAnimationOverlay("overlay_task", "overlay_task_container");
    renderCurrentTask();
    toggleScrollBehaviorOfBody('hidden');
}


// Display Task

function renderCurrentTask(){
    const task = getCurrentTask();
    const taskKeys = Object.keys(task);
    if (taskKeys.includes("title")) document.getElementById("task_title").innerText = task.title;
    if (taskKeys.includes("description")) document.getElementById("task_description").innerText = task.description;
    if (taskKeys.includes("duedate")) document.getElementById("duedate").innerText = changeDateFormat2(task.duedate);
    if (taskKeys.includes("priority")) displayPriority(task["priority"]);
    if (taskKeys.includes("assignedPersons")) {displayPersonIconsAndName(task["assignedPersons"])} else {document.getElementById("task_overlay_assigned_to").innerHTML = ""};
    if (taskKeys.includes("category")) displayCategory(task["category"]);
    if (taskKeys.includes("subtasks")) {displaySubtasks(task["subtasks"])} else {document.getElementById("subtask_list").innerHTML = ""};
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


function displayPersonIconsAndName(assignedPersonsList){
    const listContainerRef = document.getElementById("task_overlay_assigned_to");
    listContainerRef.innerHTML = getHTMLTemplateFromContactInfo(assignedPersonsList, "icon_and_name", false);
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


// Events

function findSubtaskAndToggleCheckbox(idx){
    const task = getCurrentTask();
    const keys = Object.keys(task.subtasks);
    const subtask = task.subtasks[keys[idx]];
    subtask.status = !subtask.status;
    document.getElementById("checkbox_" + idx).src = getCheckboxSubtask(subtask.status);
}


function getCheckboxSubtask(status){
    return status ? "../assets/img/icons/task/checkbox_tick_dark.svg" : "../assets/img/icons/task/checkbox.svg";
}


async function saveSubtaskChanges(){
    const task = getCurrentTask();
    if (task["subtasks"]){
        await setData(task["subtasks"], "/tasks/task_" + task.id + "/subtasks");
        updateProgressbar(task);
    }
    return true;
}


function updateProgressbar(task){
    const progressbarRef = document.getElementById("progressbar_" + task.id);
    const values = countArchievedSubtasks(task["subtasks"]);
    let percent = values.counter/values.amount*100;
    progressbarRef.style = "width: " + percent + "%";
    if (percent == 100){
        progressbarRef.classList.replace("subtasks_outstanding", "all_subtasks_completed");
    } else {
        progressbarRef.classList.replace("all_subtasks_completed", "subtasks_outstanding");
    }
    const progressTextRef = document.getElementById("progress_text_" + task.id);
    progressTextRef.innerText = values.counter + "/" + values.amount + " Subtasks";
}


async function deleteCurrentTask(){
    const task = getCurrentTask();
    toggleOverlay("overlay_task");
    resetAnimation("overlay_task", "overlay_task_container");
    deleteTaskFromArray(task.id)
    deleteTaskFromFirebase(task.id);
    document.getElementById("task_card_" + task.id).remove();
}


function deleteTaskFromArray(taskId) {
    const tasks = getBoardAllTasks();
    const taskIdx = tasks.findIndex(task => task.id === taskId);
    if (taskIdx !== -1) {
        tasks.splice(taskIdx, 1);
    }
}


function openEditTaskOverlay(){
    displayEditTaskOverlay(getCurrentTask().id);
}


function getHTMLTemplateFromContactInfo(assignedPersonsList, selection = "icon", limited = false, container = "div"){
    let htmlContainer = "";
    let counter = 0;
    for (const personKey in assignedPersonsList) {
        const person = searchAssignedPersonInContacts(assignedPersonsList[personKey]);
        if (person){
            if (!limited || counter < 3){
                htmlContainer += assignedToTemplateSelector(selection, person, container);
            }
            counter++;
        }
    }        
    return htmlContainer + getAssignedToPlaceholder(counter, 3, limited, container);
}


function searchAssignedPersonInContacts(assignedPersonId){
    const contacts = getBoardContacts();
    for (const key in contacts) {
        const contact = contacts[key];
        if (assignedPersonId == contact.id) {
            return contact;
        }
    }
    return null;
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


function getCategoryNumber(category){
    return ["User Story", "Technical Task"].indexOf(category);
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
