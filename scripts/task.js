
async function displayTaskOverlay(taskId){
    await getTaskFromDB(taskId);
    // getTaskLocal(taskId);

    toggleTaskOverlay();
    renderCurrentTask();
}

async function getTaskFromDB(taskId){
    await getAllTasks();
    currentTask = getElementWithId(tasks, taskId)
    if (!objectFound(currentTask)) return false;
    return true;
}

function toggleTaskOverlay(){
    document.getElementById("overlay_task").classList.toggle("d_none");
}

// function getTaskLocal(taskId){
//     currentTaskKey = "task_" + taskId;
//     currentTask = tasks[currentTaskKey];
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
    let number = categories.indexOf(category);
    const categoryRef = document.getElementById("task_category");
    removeCSSClassCategoryColor();
    categoryRef.classList.add("category_bg_color" + number);
    categoryRef.innerText = category;
}


function removeCSSClassCategoryColor(){
    const categoryRef = document.getElementById("task_category");
    let cssClass = "category_bg_color";
    for (let categoryNumber = 1; categoryNumber <= categories.length; categoryNumber++) {
        categoryRef.classList.remove(cssClass + categoryNumber);
    }
}


function displayPriority(priority){
    const priorityRef = document.getElementById("task_priority");
    // let priorityHTML = "";

    // if (priority === "urgent"){
    //     priorityHTML = '';
    // }
    // else if (priority === "medium"){
    //     priorityHTML = '<span>Medium</span><img src="../assets/img/icons/task/priorities/medium_yellow.svg" alt="">';
    // }
    // else if (priority === "low"){
    //     priorityHTML = '<span>Low</span><img src="../assets/img/icons/task/priorities/low_green.svg" alt="">';
    // }

    priorityRef.innerHTML = getPriorityTemplate(priority);
}



function displayAssignedToPersons(assignedPersons){
    const assignedKeys = Object.keys(assignedPersons);
    const personKeys = Object.keys(persons);

    const listContainerRef = document.getElementById("task_overlay_assigned_to");
    listContainerRef.innerHTML = "";
    for (let assignedKeyIdx = 0; assignedKeyIdx < assignedKeys.length; assignedKeyIdx++) {
        for (let personKeyIdx = 0; personKeyIdx < personKeys.length; personKeyIdx++) {
            if (assignedPersons[assignedKeys[assignedKeyIdx]] == persons[personKeys[personKeyIdx]].id){ 
                person = persons[personKeys[personKeyIdx]];
                listContainerRef.innerHTML += assignedToListElementTemplate(person);
                break;
            }
    
        }    
    }      
    console.log(listContainerRef.innerHTML);
    

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



function getCheckbox(status){
    return status ? "../assets/img/icons/task/checkbox_tick_dark.svg" : "../assets/img/icons/task/checkbox.svg";
}


function toggleCheckbox(idx){
    const keys = Object.keys(currentTask.subtasks);
    const subtask = currentTask.subtasks[keys[idx]];
    subtask.status = !subtask.status;
    document.getElementById("checkbox_" + idx).src = getCheckbox(subtask.status);
}


function saveChangesLocal(){
    return true;
    // if (!tasks[currentTaskKey]["subtasks"]) return;
    // tasks[currentTaskKey]["subtasks"] = currentTask["subtasks"];
    // save Changes in DB
}


function deleteCurrentTask(){
    toggleTaskOverlay();
    delete tasks[currentTaskKey];
    console.log(tasks);
    // save Changes in DB
}


function editCurrentTask(){
    console.log("Open edit!");
    // Open edit
}


// --- Board - Task Card -------------------------------------------------------------------------------------------------------


function buildAssignedToTemplate(task){
    if (task["assignedPersons"]){
        let htmlContainer = `<ul id="task_assigned_to" class="bct_assigned_to_list">`;
        const assignedPersons = task["assignedPersons"];
        htmlContainer += getAssignedPersonsHTML(assignedPersons);
        return htmlContainer + `</ul>`;

    }
    return "<ul></ul>";
}

function getAssignedPersonsHTML(assignedPersons){
    let htmlContainer = "";
    let counter = 0;
    for (const personKey in assignedPersons) {
        const assignedPerson = searchAssignedPersonInContacts(assignedPersons[personKey]);
        if (assignedPerson){
            if (counter < 3){
                htmlContainer += getAssignedToIconTemplate(assignedPerson.avatarColor, generateInitials(assignedPerson.name));
            }
            counter++;
        }
    }        

    return htmlContainer + getAssignedToPlaceholder(counter, 3);
}

function getAssignedToPlaceholder(counter, limit){
    if (counter >= limit){
        return getAssignedToIconTemplate("grey", "+ " + (counter - 3));
    }
    return "";
}

function searchAssignedPersonInContacts(assignedPersonId){
    const contactKeys = Object.keys(persons);
    let contact = null;
    for (let contactKeyIdx = 0; contactKeyIdx < contactKeys.length; contactKeyIdx++) {
        contact = persons[contactKeys[contactKeyIdx]];
        if (assignedPersonId == contact.id){ 
            return contact;
        }
    }     
    return null;
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
