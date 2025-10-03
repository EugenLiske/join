const monthMaxDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];


/**
 * Checks whether all required fields are filled correctly to enable the submit button.
 *
 * @param {string} mode - The mode of the task form ("add_task" or "edit").
 * @returns {boolean} - True if all required fields are valid, otherwise false.
 */
function checkRequiredFieldsToEnableButton(mode = "add_task"){
    return checkTitle(false) && simpleCheckDuedate() && (mode === "add_task" ? checkCategory(false) : true);
}


/**
 * Validates all required fields with warning display if needed.
 *
 * @param {string} mode - The mode of the task form ("add_task" or "edit").
 * @returns {boolean} - True if all validations pass, otherwise false.
 */
function checkRequiredFields(mode = "add_task"){
    let isCorrectTitle = checkTitle();
    let isCorrectDuedate = checkDuedate();
    let isCorrectCategory = true;
    if (mode == "add_task"){
        isCorrectCategory = checkCategory();
    }

    return isCorrectTitle && isCorrectDuedate && isCorrectCategory;
}


function resetWarning(){
    removeOrAddWarning(document.getElementById("task_title_input"), "warning_title", true, "This field is required!");
    removeOrAddWarning(document.getElementById("task_deadline_input"), "warning_deadline", true, 0); 
    removeOrAddWarning(document.getElementById("category_selection"), "warning_category", true, "This field is required!");    
}


/**
 * Adds or removes warning messages and input styling based on validation result.
 *
 * @param {HTMLElement} element - The input element to highlight/unhighlight.
 * @param {string} warningId - The ID of the warning message container.
 * @param {boolean} isCorrect - Whether the field is valid.
 * @param {string} message - The warning message to display if invalid.
 */
function removeOrAddWarning(element, warningId, isCorrect, message){
    toggleInputErrorDesign(element, isCorrect);
    toggleWarning(warningId, isCorrect, message);
}


/**
 * Adds or removes a CSS class to visually indicate input validity.
 *
 * @param {HTMLElement} element - The input element to highlight/unhighlight.
 * @param {boolean} isCorrect - Whether the field is valid.
 */
function toggleInputErrorDesign(element, isCorrect){
    isCorrect ? element.classList.remove("taskerror") : element.classList.add("taskerror");
}


/**
 * Shows or hides a warning message based on validation result.
 *
 * @param {string} htmlId - The ID of the warning message element.
 * @param {boolean} isCorrect - Whether the field is valid.
 * @param {string} message - The warning message to set.
 */
function toggleWarning(htmlId, isCorrect, message){
    let messageRef = document.getElementById(htmlId);
    isCorrect ? messageRef.classList.add("d_none") : messageRef.classList.remove("d_none");
    messageRef.innerText = message;
}


// Check Title -----------------------------------------------------------------------

/**
 * Validates the task title field.
 *
 * @param {boolean} [setWarning=true] - Whether to show a warning message if invalid.
 * @returns {boolean} - True if the title is not empty, false otherwise.
 */
function checkTitle(setWarning = true){
    let titleInputRef = document.getElementById("task_title_input");
    let isCorrect = titleInputRef.value.length > 0;
    if (setWarning) removeOrAddWarning(titleInputRef, "warning_title", isCorrect, "This field is required!");
    return isCorrect;
}


// Check Category --------------------------------------------------------------------

/**
 * Validates the selected task category.
 *
 * @param {boolean} [setWarning=true] - Whether to show a warning message if invalid.
 * @returns {boolean} - True if a valid category is selected, false otherwise.
 */
function checkCategory(setWarning = true){
    let categoryButtonRef = document.getElementById("category_selection");
    let choice = categoryButtonRef.innerText;
    let isCorrect = ["User Story", "Technical Task"].indexOf(choice) >= 0 ? true : false;
    if (setWarning) removeOrAddWarning(categoryButtonRef, "warning_category", isCorrect, "This field is required!");

    return isCorrect;
}


// Check Date -------------------------------------------------------------------------

/**
 * Checks if the due date field is not empty.
 *
 * @returns {boolean} - True if a value is entered, false otherwise.
 */
function simpleCheckDuedate(){
    let duedateRef = document.getElementById("task_deadline_input");  
    let isCorrect = duedateRef.value.length > 0;

    return isCorrect;
}


/**
 * Validates the due date field including format and logical correctness.
 *
 * @returns {boolean} - True if the date is valid, false otherwise.
 */
function checkDuedate(){
    let duedateRef = document.getElementById("task_deadline_input");
    let errorNumber = dateValidation(duedateRef.value);
    let isCorrect = errorNumber == 0 ? true : false;
    removeOrAddWarning(duedateRef, "warning_deadline", isCorrect, getDateWarning(errorNumber));
    
    return isCorrect;
}


/**
 * Returns the appropriate warning message for a given date error code.
 *
 * @param {number} errorNumber - The code representing the validation error.
 * @returns {string} - The corresponding warning message.
 */
function getDateWarning(errorNumber){
    let message = "";
    switch (errorNumber) {
        case 1:
            message = "This field is required!";
            break;
        case 2:
            message = "Enter date as dd/mm/yyyy!";
            break;
        case 3:
            message = "This date does not exist!";
            break;
        case 4:
            message = "The date must be in the future!"
            break;
        default:
            message = ""
            break;
    }
    return message;
}


/**
 * Validates a date string and returns an error code.
 *
 * @param {string} date - The date string in dd/mm/yyyy format.
 * @returns {number} - Error code (0 = valid, 1–4 = various errors).
 */
function dateValidation(date) {
    if (date.length <= 0) return 1;
    if (!checkDateFormat(date)) return 2;

    let strDateArr = date.split("/");
    let intDateArr = getIntDate(strDateArr);

    return checkDate(intDateArr[0], intDateArr[1], intDateArr[2]);
}


/**
 * Validates that the date is real and in the future.
 *
 * @param {number} day - Day of the date.
 * @param {number} month - Month of the date.
 * @param {number} year - Year of the date.
 * @returns {number} - Error code (0 = valid, 3 = invalid date, 4 = date not in future).
 */
function checkDate(day, month, year){
    if (!checkNumberInterval(day, month, year)) return 3;
    if (!isDateInFuture(day, month, year)) return 4;
    
    return 0;
}


/**
 * Determines whether the given year is a leap year.
 *
 * @param {number} year - The year to check.
 * @returns {boolean} - True if it's a leap year, false otherwise.
 */
function isLeapYear(year){
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}


/**
 * Checks if the given day, month, and year form a valid date.
 *
 * @param {number} day - Day of the date.
 * @param {number} month - Month of the date.
 * @param {number} year - Year of the date.
 * @returns {boolean} - True if the date is valid, false otherwise.
 */
function checkNumberInterval(day, month, year){
    if (checkYear(year)){
        if (checkMonth(month)){
            if (month == 2){
                setFebruaryDays(year);
            }
            if (checkDay(day, month)){
                return true;
            }
        }
    }
    return false;
}


/**
 * Checks if the given date is in the future compared to today.
 *
 * @param {number} day - Day of the date.
 * @param {number} month - Month of the date.
 * @param {number} year - Year of the date.
 * @returns {boolean} - True if the date is in the future, false otherwise.
 */
function isDateInFuture(day, month, year){
    const d = new Date();
    const thisYear = d.getFullYear();
    const thisMonth = d.getMonth();
    const thisDay = d.getDay();
 
    return (year > thisYear || (year == thisYear && (month > thisMonth || (month == thisMonth && day >= thisDay))));
}


function checkYear(year){
    return year >= 1 && year <= 2100;
}


function checkMonth(month){
    return month >= 1 && month <= 12;
}


function setFebruaryDays(year){
    monthMaxDays[1] = isLeapYear(year) ? 29 : 28;
}


function checkDay(day, month){
    return day >= 1 && day <= monthMaxDays[month - 1];
}


/**
 * Checks whether a date string matches the format dd/mm/yyyy.
 *
 * @param {string} date - The date string to validate.
 * @returns {boolean} - True if the format is valid, false otherwise.
 */
function checkDateFormat(date){
    const pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return pattern.test(date);
}


function getIntDate(strDateArr){
    return [parseInt(strDateArr[0], 10), parseInt(strDateArr[1], 10), parseInt(strDateArr[2], 10)];
}

