
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

function getTaskLocal(taskId){
    currentTaskKey = "task_" + taskId;
    currentTask = tasks[currentTaskKey];
}


function renderCurrentTask(){
    const taskKeys = Object.keys(currentTask);
    if (taskKeys.includes("title")) document.getElementById("task_title").innerText = currentTask.title;
    if (taskKeys.includes("description")) document.getElementById("task_description").innerText = currentTask.description;
    if (taskKeys.includes("duedate")) document.getElementById("dueDate").innerText = changeDateFormat2(currentTask.duedate);
    if (taskKeys.includes("priority")) displayPriority(currentTask["priority"]);
    // displayAssignedToPersons(currentTask["assignedTo"]);
    if (taskKeys.includes("category")) displayCategory(currentTask["category"]);
    if (taskKeys.includes("subtasks")) displaySubtasks(currentTask["subtasks"]);
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
    let priorityHTML = "";

    if (priority === "urgent"){
        priorityHTML = '<span>Urgent</span><img src="../assets/img/icons/task/priorities/urgent_red.svg" alt="">';
    }
    else if (priority === "medium"){
        priorityHTML = '<span>Medium</span><img src="../assets/img/icons/task/priorities/medium_yellow.svg" alt="">';
    }
    else if (priority === "low"){
        priorityHTML = '<span>Low</span><img src="../assets/img/icons/task/priorities/low_green.svg" alt="">';
    }

    priorityRef.innerHTML = priorityHTML;
}


function displayAssignedToPersons(assignedToList){
    const keys = Object.keys(assignedToList);
    let id = -1;
    const listContainerRef = document.getElementById("task_assigned_to");
    listContainerRef.innerHTML = "";
    for (let keyIdx = 0; keyIdx < keys.length; keyIdx++) {
        id = assignedToList[assignedToList[keyIdx]];
        // get id
        // get contact with id
        // listContainerRef.innerHTML += assignedToListElementTemplate(person);
    }
}


function assignedToListElementTemplate(person){
    return `<li>
                <div class="person_icon" style="background-color: ${person.color}">
                    ${person.initials}
                </div>
                    ${person.name}
            </li>`;
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


function subtaskListElementTemplate(subtask, idx){
    return `<li onclick="toggleCheckbox(${idx})">
                <img id="checkbox_${idx}" class="checkbox_tick" src="${getCheckbox(subtask.status)}" alt="">
                <span>${subtask.description}</span>
            </li>`;
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
    tasks[currentTaskKey]["subtasks"] = currentTask["subtasks"];
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