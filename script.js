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


function displayToastMessage(overlayId, messageId, page = "") {
  const overlayRef = document.getElementById(overlayId);
  const messageRef = document.getElementById(messageId);
  
  overlayRef.classList.add("active");
  messageRef.classList.add("enter");
  setTimeout(function () {
    overlayRef.classList.remove("active");
    messageRef.classList.remove("enter");
    overlayRef.classList.add("leaving");
    if (page !== ""){
        setTimeout(function () {
        window.location.href = page;
        }, 300);        
    }
  }, 2700);
  overlayRef.classList.remove("leaving");
}

// Schließung des Overlays beim Klicken außerhalb des Overlays

function setupOverlayOutsideClickClose() {
  wireOverlayBackgroundClose('overlay_task', onTaskOverlayBackgroundClick);
  wireOverlayBackgroundClose('overlay_edit_task', onEditOverlayBackgroundClick);
}

function wireOverlayBackgroundClose(overlayId, onBackgroundClick) {
  const overlayElement = document.getElementById(overlayId);
  if (!overlayElement) return;

  overlayElement.onclick = function (event) {
    if (event.target === overlayElement) {
      onBackgroundClick();
    }
  };
}

function onTaskOverlayBackgroundClick() {
  saveSubtaskChanges();
  hideAnimationOverlay('overlay_task', 'overlay_task_container');
  toggleScrollBehaviorOfBody('');
}

function onEditOverlayBackgroundClick() {
  hideAnimationOverlay('overlay_edit_task', 'overlay_edit_task_container');
  resetAnimation('overlay_task', 'overlay_task_container');
  toggleScrollBehaviorOfBody('');
}