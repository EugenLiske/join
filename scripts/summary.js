
let currentUser = null;

const summaryContent = {
    "toDo": 0,
    "done": 0,
    "urgent": 0,
    "deadline": null,
    "tasks": 0,
    "inProgress": 0,
    "awaitingFeedback": 0
};


/**
 * Initializes the summary view by loading user data, initializing navigation,
 * displaying welcome message, retrieving tasks, calculating statistics, and updating the UI.
 */
async function initSummary(){
    getCurrentUserData();
    initNavigation("summary");  //include.js
    displayWelcomeOnScreen();

    const summaryTasks = await getAllTasks();   //task_db_connection.js
    
    calculateInformation(summaryTasks);
    displaySummaryOnScreen();
}


/**
 * Retrieves the current user information from session storage
 * and stores it in the global variable `currentUser`.
 */
function getCurrentUserData(){
    currentUser = {
        "login": sessionStorage.getItem("login"),
        "role": sessionStorage.getItem("role"),
        "name": sessionStorage.getItem("name")
    }
}


/**
 * Displays a personalized welcome message on both desktop and mobile views,
 * if user information is available.
 */
function displayWelcomeOnScreen(){
    if (currentUser) {
        createWelcomeText("welcome_text", "welcome_name", currentUser.name);
        createWelcomeText("welcome_text_mobile", "welcome_name_mobile", currentUser.name);   
    }
    mobileWelcome();
}


/**
 * Shows a temporary mobile welcome screen (if on small screens) and disables/enables body scrolling.
 * Also resets the login flag in session storage.
 */
function mobileWelcome() {
    if (currentUser.login){
        const welcomeRef = document.getElementById("welcome_mobile");
        toggleBodyScrollBehavior("hidden");
        if (window.innerWidth <= 950) {
            welcomeRef.classList.add("welcome_show");

            setTimeout(() => {
                welcomeRef.classList.remove("welcome_show");
                toggleBodyScrollBehavior("auto");
            }, 4000);
        }
        sessionStorage.setItem("login", false);
    }
}


/**
 * Enables or disables scrolling of the body element.
 * 
 * @param {string} status - "hidden" to disable scroll, "auto" to enable scroll.
 */
function toggleBodyScrollBehavior(status){
    const bodyRef = document.getElementById("body");
    bodyRef.style.overflow = status;
}


/**
 * Creates and writes a personalized welcome text based on user role.
 * 
 * @param {string} textId - The html element ID where the greeting text will be placed.
 * @param {string} nameId - The html element ID where the user's name will be inserted.
 * @param {string} name - The user's name to display.
 */
function createWelcomeText(textId, nameId, name){
    if (currentUser.role === "guest"){
        writeWelcomeText(textId, "Good morning!", nameId, name);
    } else {
        writeWelcomeText(textId, "Good morning,", nameId, name);
    }
}


/**
 * Writes the given greeting text and name into specified DOM elements.
 * 
 * @param {string} textId - HTML Element ID for the greeting message.
 * @param {string} text - The greeting message text.
 * @param {string} nameId - HTML Element ID for the user's name.
 * @param {string} name - The user's name to insert.
 */
function writeWelcomeText(textId, text, nameId, name){
    document.getElementById(textId).innerText = text;
    document.getElementById(nameId).innerText = name;    
}


/**
 * Calculates and updates the summary information (like task counts and earliest deadline)
 * based on the list of tasks.
 * 
 * @param {Object} summaryTasks - An object containing all task data.
 */
function calculateInformation(summaryTasks) {
    let earliestDeadline = null;
    
    Object.values(summaryTasks).forEach(task => {
        countTasks(task);
        countUrgentTask(task);
        earliestDeadline = checkLatestDeadline(earliestDeadline, task);
    });

    summaryContent.deadline = earliestDeadline;
    summaryContent.tasks = Object.keys(summaryTasks).length;
}


/**
 * Compares and returns the earlier of two task deadlines.
 * 
 * @param {string|null} latestTask - The current earliest deadline.
 * @param {Object} task - The current task object to compare.
 * @returns {string|null} The earliest deadline found so far.
 */
function checkLatestDeadline(latestTask, task){
    const date = task["duedate"];
    const status = task["kanbanBoardColumn"];

    if ((status === "to_do" || status === "in_progress" || status === "await_feedback") && date) {
        if (!latestTask || new Date(date) < new Date(latestTask)) {
            latestTask = date;
        }
    }
    return latestTask;
}


/**
 * Increments the count of urgent tasks in the summary, excluding those already marked as "done".
 * 
 * @param {Object} task - A task object to evaluate.
 */
function countUrgentTask(task){
    const priority = task["priority"];
    const status = task["kanbanBoardColumn"];

    if(priority == "urgent" && status != "done"){
        summaryContent.urgent += 1;
    }
}


/**
 * Increments task counters in the summary based on their status.
 * 
 * @param {Object} task - A task object to evaluate.
 */
function countTasks(task){
    const status = task["kanbanBoardColumn"];
    if (status === "to_do") {
        summaryContent.toDo += 1;
    } else if (status === "in_progress") {
        summaryContent.inProgress += 1;
    } else if (status === "await_feedback") {
        summaryContent.awaitingFeedback += 1;
    } else if (status === "done") {
        summaryContent.done += 1;
    }
}


/**
 * Displays the calculated summary data (task counts, deadline) in the corresponding UI elements.
 */
function displaySummaryOnScreen(){
    const summaryKey = Object.keys(summaryContent);
    let htmlRef = null;

    for (let keyIdx = 0; keyIdx < summaryKey.length; keyIdx++) {
        htmlRef = document.getElementById("amount_" + summaryKey[keyIdx]);
        
        if (summaryKey[keyIdx] === "deadline"){
            htmlRef.innerText = convertDateInFull(summaryContent[summaryKey[keyIdx]]);
        }
        else{
            htmlRef.innerText = summaryContent[summaryKey[keyIdx]];
        }
    }
}


/**
 * Converts a date string into a readable long-format date (e.g., "October 6, 2025").
 * Returns "-" if the date is invalid or missing.
 * @param {string|null} date - The date string (yyyy-mm-dd) to convert.
 * @returns {string} A formatted date string or "-" if invalid.
 */
function convertDateInFull(date) {
    let dateObject = null;
    const format = { year: 'numeric', month: 'long', day: 'numeric' };

    if (!date) return "-";

    dateObject = new Date(date);

    if (isNaN(dateObject)) return "-";

    return dateObject.toLocaleDateString('en-US', format);
}


function openKanbanBoard(){
    window.location.href = "board.html";
}
