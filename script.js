export let login = true;   //for mobile view

export function loginSetter(value){
    login = value;
}




function toggleOverlay(htmlId){
    const overlay = document.getElementById(htmlId);
    overlay.classList.toggle("d_none");
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


function changeDateFormat2(date){
    const splitDate = date.split("-");
    splitDate.reverse();
    return splitDate.join("/");
}