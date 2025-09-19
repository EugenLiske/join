// --- SUMMARY -------------------------------------------------------------------------------------------------------------------------------------

let currentUser = null;

let summaryContent = {
    "toDo": 0,
    "done": 0,
    "urgent": 0,
    "deadline": null,
    "tasks": 0,
    "inProgress": 0,
    "awaitingFeedback": 0
};

async function initSummary(){
    getCurrentUserData();
    initNavigation("summary");

    displayWelcomeOnScreen();

    await getAllTasks();
    
    calculateInformation();
    displaySummaryOnScreen();
}


function getCurrentUserData(){
    currentUser = {
        "login": sessionStorage.getItem("login"),
        "role": sessionStorage.getItem("role"),
        "name": sessionStorage.getItem("name")
    }
}


function displayWelcomeOnScreen(){
    if (currentUser) {
        createWelcomeText("welcome_text", "welcome_name", currentUser.name);
        createWelcomeText("welcome_text_mobile", "welcome_name_mobile", currentUser.name);   
    }
    mobileWelcome();
}


function mobileWelcome() {
    if (currentUser.login){
        const welcomeRef = document.getElementById("welcome_mobile");

        if (window.innerWidth <= 950) {
            welcomeRef.classList.add("welcome_show");

            setTimeout(() => {
                welcomeRef.classList.remove("welcome_show");
            }, 2000);
        }
        sessionStorage.setItem("login", false);
    }

}

function createWelcomeText(textId, nameId, name){
    if (currentUser.role === "guest"){
        writeWelcomeText(textId, "Good morning!", nameId, name);
    } else { //Normal User
        writeWelcomeText(textId, "Good morning,", nameId, name);
    }
}

function writeWelcomeText(textId, text, nameId, name){
        document.getElementById(textId).innerText = text;
        document.getElementById(nameId).innerText = name;    
}

function calculateInformation() {
    let latestTask = null;
    let taskKeys = Object.keys(tasks);

    summaryContent.tasks = taskKeys.length;

    for (let taskIdx = 0; taskIdx < taskKeys.length; taskIdx++) {
        let task = tasks[taskKeys[taskIdx]];
        countTasks(task);
        countUrgentTask(task);
        latestTask = checkLatestDeadline(latestTask, task);
    }

    summaryContent.deadline = latestTask;
}

function checkLatestDeadline(latestTask, task){
    let date = task["duedate"];
    let status = task["kanbanBoardColumn"];

    if ((status == "to_do" || status == "in_progress" || status == "await_feedback") && date) {
        if (!latestTask || new Date(date) < new Date(latestTask)) {
            latestTask = date;
        }
    }
    return latestTask;
}

function countUrgentTask(task){
    let priority = task["priority"];
    let status = task["kanbanBoardColumn"];

    if(priority == "urgent" && status != "done"){
        summaryContent.urgent += 1;
    }
}

function countTasks(task){
    let status = task["kanbanBoardColumn"];
    if (status == "to_do") {
        summaryContent.toDo += 1;
    } else if (status == "in_progress") {
        summaryContent.inProgress += 1;
    } else if (status == "await_feedback") {
        summaryContent.awaitingFeedback += 1;
    } else if (status == "done") {
        summaryContent.done += 1;
    }
}


// Diplay Data ----------------------------------------------------------------------

function displaySummaryOnScreen(){
    let summaryKey = Object.keys(summaryContent);
    let htmlRef = null;

    for (let keyIdx = 0; keyIdx < summaryKey.length; keyIdx++) {
        htmlRef = document.getElementById("amount_" + summaryKey[keyIdx]);
        
        if (summaryKey[keyIdx] === "deadline"){
            htmlRef.innerText = convertDateFormat(summaryContent[summaryKey[keyIdx]]);
        }
        else{
            htmlRef.innerText = summaryContent[summaryKey[keyIdx]];
        }
    }
}

function convertDateFormat(date) {
    let dateObject = null;
    const format = { year: 'numeric', month: 'long', day: 'numeric' };

    if (!date){
        return "-";
    } 

    dateObject = new Date(date);

    if (isNaN(dateObject)){
        return "-";
    }

    return dateObject.toLocaleDateString('en-US', format);
}

