
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
    currentPage = "summary";
    mobileWelcome();
    await getAllTasks();
    calculateInformation();
    displaySummaryOnScreen();
    displayWelcomeOnScreen();
    
}

function mobileWelcome() {
    if (login){
        const welcomeRef = document.getElementById("welcome_mobile");

        if (window.innerWidth <= 950) {
            welcomeRef.classList.add("welcome_show");

            setTimeout(() => {
                welcomeRef.classList.remove("welcome_show");
            }, 2000);
        }
        login = false;
    }

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
    let status = task["status"];

    if ((status == 0 || status == 1 || status == 2) && date) {
        if (!latestTask || new Date(date) < new Date(latestTask)) {
            latestTask = date;
        }
    }
    return latestTask;
}

function countUrgentTask(task){
    let priority = task["priority"];
    let status = task["status"];

    if(priority == "urgent" && status != 3){
        summaryContent.urgent += 1;
    }
}

function countTasks(task){
    let status = task["status"];

    if (status == 0) {
        summaryContent.toDo += 1;
    } else if (status == 1) {
        summaryContent.inProgress += 1;
    } else if (status == 2) {
        summaryContent.awaitingFeedback += 1;
    } else if (status == 3) {
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


function displayWelcomeOnScreen(){
    const welcomeNameRef = document.getElementById("welcome_name");

    if (currentUser.role === "user"){
        welcomeNameRef.innerText = currentUser.name;
    }
}