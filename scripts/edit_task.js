
// --- Task Edit Overlay --------------------------------------------------------------------------
// Contacts have already been loaded from the board when displaying.

async function displayEditTaskOverlay(taskId){
    document.getElementById("add_task_form").innerHTML = "";
    await includeAddTaskForm("edit_task_form");
    await getTaskFromDB(taskId);
    await initAddTask();

    manipulateTaskForm();

    setTaskFormData();
    toggleScrollBehaviorOfBody('hidden');

    toggleOverlay('overlay_task');
    toggleOverlay('overlay_edit_task');
}



function manipulateTaskForm(){
    document.getElementById("add_task_footer").innerHTML = getOKButtonTemplate();
    hideRequiredSymole();
    document.getElementById("category_wrapper").classList.add("d_none");
    changeCSSClasses("task_input_area", "edit_task_input_area");
    changeCSSClasses("task_separator", "edit_task_separator");
    changeCSSClasses("add_task_footer", "edit_add_task_footer");
    document.getElementById("task_title_input").onkeyup = "checkAndEnableButton('edit_task')";
    document.getElementById("task_deadline_input").onkeyup = "checkAndEnableButton('edit_task')";
}

function changeCSSClasses(oldCSSClass, newCSSClass){
    const elementsRef = document.getElementsByClassName(oldCSSClass);
    elementsRef[0].classList.replace(oldCSSClass, newCSSClass);
}

function hideRequiredSymole(){
    const symbols = document.getElementsByClassName("required_symbole");
    for (let symbolIdx = 0; symbolIdx < symbols.length; symbolIdx++) {
        symbols[symbolIdx].classList.add("d_none");
    }
}


function setTaskFormData(){
    const taskKeys = Object.keys(currentTask);
    if (taskKeys.includes("title")) document.getElementById("task_title_input").value = currentTask.title;
    if (taskKeys.includes("description")) document.getElementById("task_description_input").value = currentTask.description;
    if (taskKeys.includes("duedate")) document.getElementById("task_deadline_input").value = changeDateFormat2(currentTask.duedate);
    if (taskKeys.includes("priority")) setPrioritySelection(currentTask.priority);
    if (taskKeys.includes("assignedPersons")) setAssignedToSelection(currentTask.assignedPersons);
    if (taskKeys.includes("subtasks")) setSubtasksList(currentTask.subtasks);
}


function setPrioritySelection(priority){
    const priorityButtonRef = document.getElementById(priority);
    setGlobalPriority(priorityButtonRef, priority);
}


function setAssignedToSelection(assignedPersons){
    const personKeys = Object.keys(persons);
    const assignedKeys = Object.keys(assignedPersons);

    const searchHTMLList = document.getElementById("selection").children;

    for (let personKeyIdx = 0; personKeyIdx < personKeys.length; personKeyIdx++) {

        searchHTMLList[personKeyIdx].classList.remove("person_selected");  

        for (let assignedKeyIdx = 0; assignedKeyIdx < assignedKeys.length; assignedKeyIdx++) {
            if (assignedPersons[assignedKeys[assignedKeyIdx]] == persons[personKeys[personKeyIdx]].id){
                assignedToList[personKeyIdx] = true;    
                selectPerson(searchHTMLList[personKeyIdx], personKeyIdx);         
                break;
            }
        }   
    }
}


function setSubtasksList(subtasks){
    const subtaskKeys = Object.keys(subtasks);

    for (let keyIdx = 0; keyIdx < subtaskKeys.length; keyIdx++) {
        document.getElementById("subtask_input").value = subtasks[subtaskKeys[keyIdx]].description;
        addSubtaskToList();
    }
}


async function updateTaskAndGoBack(){
    if (checkRequiredFields("edit_task")){
        const formContent = getFormContent();
        await saveFormContentInDB(formContent);
        updateTask(currentTask.id, formContent);
        updateTaskCardAtBoard(currentTask.id);
        goBack();
    }
}

async function saveFormContentInDB(formContent) {
    for (const [key, value] of Object.entries(formContent)) {
        await setData(value, `/tasks/task_${currentTask.id}/${key}`);
    }
}


function goBack(){
    displayTaskOverlay(currentTask.id);
    toggleOverlay('overlay_edit_task');    
}
