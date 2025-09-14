


const clickHandlers = [
    { selector: '#login_initials', handler: toggleMenu },
    { selector: '#logout', handler: logoutUser },
    { selector: '#task_assignedto_button', handler: toggleInputElement },
    { selector: '#drop_down_persons', handler: toggleInputElement },
    { selector: '#category_selection', handler: () => toggleSelectionList('category_options', 'drop_down_categories') },
    { selector: '#drop_down_categories', handler: () => toggleSelectionList('category_options', 'drop_down_categories') },
    { selector: '#cancel_subtask', handler: cancelSubtask },
    { selector: '#add_subtask', handler: addSubtask },
    // etc...
];


document.addEventListener('click', (event) => {
    for (let { selector, handler } of clickHandlers) {
        if (event.target.closest(selector)) {
            handler(event);
            return;
        }
    }

    handlePriorityClicks(event);
    handlePersonSelection(event);
    handleCategorySelection(event);
    handleSubtaskActions(event);
});


function handlePriorityClicks(event){
    const priorities = ["urgent", "medium", "low"];

    priorities.forEach(priority => {
        if(handlePriorityClick(event.target, priority)) return;
    });

}

function handlePriorityClick(child, priority){
    const finalTarget = child.closest("#" + priority);
    if (finalTarget) {
        setGlobalPriority(finalTarget, priority);
        return true;
    }
    return false;
}

function handlePersonSelection(event){
    const selectionParent = event.target.closest('#selection');
    if (selectionParent) {
        if (event.target.parentNode === selectionParent) {
            selectPerson(event.target, event.target.id);
        } else {
            const directChild = Array.from(selectionParent.children).find(child => child.contains(event.target));
            if (directChild) {
                selectPerson(directChild, directChild.id);
            }
        }
    }

}