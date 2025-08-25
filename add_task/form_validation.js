

function checkRequiredFields(){
    let isCorrectTitle = checkTitle();
    let isCorrectDueDate = checkDueDate();
    let isCorrectCategory = checkCategory();

    return isCorrectTitle && isCorrectDueDate && isCorrectCategory;
}

function removeOrAddWarning(element, warningId, isCorrect, message){
    toggleInputErrorDesign(element, isCorrect);
    toggleWarning(warningId, isCorrect, message);
}

function toggleInputErrorDesign(element, isCorrect){
    isCorrect ? element.classList.remove("taskerror") : element.classList.add("taskerror");
}

function toggleWarning(htmlId, isCorrect, message){
    let messageRef = document.getElementById(htmlId);
    isCorrect ? messageRef.classList.add("d_none") : messageRef.classList.remove("d_none");
    setWarningMessage(messageRef, message);
}

function setWarningMessage(container, message){
    container.innerText = message;
}

function resetWarning(){
    removeOrAddWarning(document.getElementById("task_title_input"), "warning_title", true, "This field is required!");
    removeOrAddWarning(document.getElementById("task_deadline_input"), "warning_deadline", true, 0); 
    removeOrAddWarning(document.getElementById("category_selection"), "warning_category", true, "This field is required!");    
}

// Check Title -----------------------------------------------------------------------

function checkTitle(){
    let titleInputRef = document.getElementById("task_title_input");
    let isCorrect = titleInputRef.value.length > 0;
    removeOrAddWarning(titleInputRef, "warning_title", isCorrect, "This field is required!");

    return isCorrect;
}

// Check Category --------------------------------------------------------------------

function checkCategory(){
    let categoryButtonRef = document.getElementById("category_selection");
    let choice = categoryButtonRef.innerText;
    let isCorrect = categories.indexOf(choice) >= 0 ? true : false;
    removeOrAddWarning(categoryButtonRef, "warning_category", isCorrect, "This field is required!");

    return isCorrect;
}


// Check Date -------------------------------------------------------------------------

function checkDueDate(){
    let dueDateRef = document.getElementById("task_deadline_input");
    let errorNumber = dateValidation(dueDateRef.value);
    let isCorrect = errorNumber == 0 ? true : false;
    removeOrAddWarning(dueDateRef, "warning_deadline", isCorrect, getDateWarning(errorNumber));
    return isCorrect;
}


function getDateWarning(errorNumber){
    let message = "";
    switch (errorNumber) {
        case 1:
            message = "This field is required!";
            break;
        case 2:
            message = "The date must be entered in the correct format dd/mm/yyyy!";
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

function dateValidation(date) {
    if (date.length <= 0) return 1;
    if (!checkDateFormat(date)) return 2;

    let strDateArr = date.split("/");
    let intDateArr = getIntDate(strDateArr);

    return checkDate(intDateArr[0], intDateArr[1], intDateArr[2]);
}

function checkDate(day, month, year){
    if (!checkNumberInterval(day, month, year)) return 3;
    if (!isDateInFuture(day, month, year)) return 4;
    return 0;
}

function isLeapYear(year){
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

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
    return day >= 1 && day <= monthMaxDays[month];
}

function checkDateFormat(date){
    const pattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    return pattern.test(date);
}

function getIntDate(strDateArr){
    return [parseInt(strDateArr[0], 10), parseInt(strDateArr[1], 10), parseInt(strDateArr[2], 10)];
}

