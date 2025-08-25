

function checkRequiredFields(){
    return checkTitle() && checkDueDate() && checkCategory();
}


// Check Title -----------------------------------------------------------------------

function checkTitle(){
    return document.getElementById("task_title_input").value.length > 0;
}


// Check Category --------------------------------------------------------------------

function checkCategory(){
    let choice = document.getElementById("category_selection").innerText;
    return categories.indexOf(choice) >= 0 ? true : false;
}


// Check Date -------------------------------------------------------------------------

function checkDueDate(){
    let dueDate = document.getElementById("task_deadline_input").value;
    return dateValidation(dueDate);
}

function dateValidation(date) {

    if (!checkDateFormat(date)) return false;

    let strDateArr = date.split("/");
    let intDateArr = getIntDate(strDateArr);

    return checkDate(intDateArr[0], intDateArr[1], intDateArr[2]);
}

function checkDate(day, month, year){
    return checkNumberInterval(day, month, year) && isDateInFuture(day, month, year);
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
    const thisMonth = d.getFullYear();
    const thisDay = d.getFullYear();

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

function changeDateFormat(date){
    return date.replace("/", "-");
}
