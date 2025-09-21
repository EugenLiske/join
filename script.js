let login = false;

function toggleMenu() {
    const menu = document.getElementById('side_menu');
    menu.classList.toggle('open');
}


function toggleOverlay(htmlId){
    const overlay = document.getElementById(htmlId);
    overlay.classList.toggle("d_none");
}


function showAnimationOverlay(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    overlay.classList.toggle("d_none");
    const overlayContent = document.getElementById(containerId);
    setTimeout(() => {
        overlay.classList.add('active');
        overlayContent.classList.add('active');    
    }, 50);

}


function hideAnimationOverlay(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    const overlayContent = document.getElementById(containerId);
    setTimeout(() => {
        overlay.classList.remove('active');
        overlayContent.classList.remove('active');          
    }, 50);
    setTimeout(() => {
        overlay.classList.toggle("d_none");
    }, 1000)
}


function resetAnimation(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    const overlayContent = document.getElementById(containerId);
    overlay.classList.remove('active');
    overlayContent.classList.remove('active');       
}


function setAnimtion(wrapperId, containerId){
    const overlay = document.getElementById(wrapperId);
    const overlayContent = document.getElementById(containerId);
    overlay.classList.add('active');
    overlayContent.classList.add('active');       
}

function initNavAndHeaderPage(page){
    initNavigation(page);
}

function initNavAndHeaderPageExternal(page){
    initNavigationExternal(page);
}



function getElementWithId(objects, getId) {
    if (!objects) return -1;
    const objectKeys = Object.keys(objects);
    for (let keyIdx = 0; keyIdx < objectKeys.length; keyIdx++) {
        if (getId == getIdFromObjectKey(objectKeys[keyIdx])){
            return objects[objectKeys[keyIdx]];
        }
    }

    return -1;
}

function getElementWithId2(objectArray, getId) {
    if (!objectArray) return -1;
    for (let arrayIdx = 0; arrayIdx < objectArray.length; arrayIdx++) {
        if (getId == objectArray[arrayIdx].id){            
            return objectArray[arrayIdx];
        }
    }
    return -1;
}


function getIdFromObjectKey(key){
    let splitKey = key.split("_");
    return splitKey[splitKey.length - 1];
}


function objectFound(object){
    if (object == -1)
    {
        console.warn("Object doesn't exist!");
        return false;
    }
    return true;
}


function changeDateFormat(date){
    let splitDate = date.split("/");
    let reverseDate = splitDate.reverse();
    return reverseDate.join("-");
}


function changeDateFormat2(date){
    const splitDate = date.split("-");
    splitDate.reverse();
    return splitDate.join("/");
}


function firstLetterUpperCase(word) {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}


function toggleScrollBehaviorOfBody(mode = ""){
    document.body.style.overflow = mode;
}