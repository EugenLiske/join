
/**
 * Returns the HTML template string for a subtask list item including normal and edit modes.
 *
 * @param {string} input - The text content of the subtask.
 * @param {number|string} subtaskId - The unique identifier of the subtask.
 * @returns {string} HTML string representing the subtask element.
 */
function getSubtaskTemplate(input, subtaskId){
    return `<!-- normal -->
            <li id="subtask_element_${subtaskId}" class="subtask_bulletpoint" ondblclick="openEditMode(${subtaskId})">
                <span id="subtask_${subtaskId}">${input}</span>
                <div class="subtask_icon_wrapper pad_8">
                    <svg onclick="deleteSubtask(event, '${subtaskId}')" height="16" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="currentColor"/>
                    </svg>
                    <div class="icon_separator_subtask"></div>
                    <svg onclick="openEditMode(${subtaskId})" height="16" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.14453 17H3.54453L12.1695 8.375L10.7695 6.975L2.14453 15.6V17ZM16.4445 6.925L12.1945 2.725L13.5945 1.325C13.9779 0.941667 14.4487 0.75 15.007 0.75C15.5654 0.75 16.0362 0.941667 16.4195 1.325L17.8195 2.725C18.2029 3.10833 18.4029 3.57083 18.4195 4.1125C18.4362 4.65417 18.2529 5.11667 17.8695 5.5L16.4445 6.925ZM14.9945 8.4L4.39453 19H0.144531V14.75L10.7445 4.15L14.9945 8.4Z" fill="currentColor"/>
                    </svg>                                                
                </div>
                <!-- edit -->
                <div id="edit_mode_${subtaskId}" class="edit_subtask edit_overlay d_none">
                    <input id="edit_subtask_input_${subtaskId}" class="edit_subtask_input" type="text" value="${input}">
                    <div class="subtask_icon_wrapper pad_8">
                        <svg onclick="deleteSubtask(event, '${subtaskId}')" height="16" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.14453 18C2.59453 18 2.1237 17.8042 1.73203 17.4125C1.34036 17.0208 1.14453 16.55 1.14453 16V3C0.861198 3 0.623698 2.90417 0.432031 2.7125C0.240365 2.52083 0.144531 2.28333 0.144531 2C0.144531 1.71667 0.240365 1.47917 0.432031 1.2875C0.623698 1.09583 0.861198 1 1.14453 1H5.14453C5.14453 0.716667 5.24036 0.479167 5.43203 0.2875C5.6237 0.0958333 5.8612 0 6.14453 0H10.1445C10.4279 0 10.6654 0.0958333 10.857 0.2875C11.0487 0.479167 11.1445 0.716667 11.1445 1H15.1445C15.4279 1 15.6654 1.09583 15.857 1.2875C16.0487 1.47917 16.1445 1.71667 16.1445 2C16.1445 2.28333 16.0487 2.52083 15.857 2.7125C15.6654 2.90417 15.4279 3 15.1445 3V16C15.1445 16.55 14.9487 17.0208 14.557 17.4125C14.1654 17.8042 13.6945 18 13.1445 18H3.14453ZM3.14453 3V16H13.1445V3H3.14453ZM5.14453 13C5.14453 13.2833 5.24036 13.5208 5.43203 13.7125C5.6237 13.9042 5.8612 14 6.14453 14C6.42786 14 6.66536 13.9042 6.85703 13.7125C7.0487 13.5208 7.14453 13.2833 7.14453 13V6C7.14453 5.71667 7.0487 5.47917 6.85703 5.2875C6.66536 5.09583 6.42786 5 6.14453 5C5.8612 5 5.6237 5.09583 5.43203 5.2875C5.24036 5.47917 5.14453 5.71667 5.14453 6V13ZM9.14453 13C9.14453 13.2833 9.24037 13.5208 9.43203 13.7125C9.6237 13.9042 9.8612 14 10.1445 14C10.4279 14 10.6654 13.9042 10.857 13.7125C11.0487 13.5208 11.1445 13.2833 11.1445 13V6C11.1445 5.71667 11.0487 5.47917 10.857 5.2875C10.6654 5.09583 10.4279 5 10.1445 5C9.8612 5 9.6237 5.09583 9.43203 5.2875C9.24037 5.47917 9.14453 5.71667 9.14453 6V13Z" fill="#2A3647"/>
                        </svg>                                             
                        <div class="icon_separator_subtask" style="border-right: 1px solid #D1D1D1"></div>
                        <svg onclick="saveAndCloseEditMode(event, ${subtaskId})" width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.69474 9.15L14.1697 0.675C14.3697 0.475 14.6072 0.375 14.8822 0.375C15.1572 0.375 15.3947 0.475 15.5947 0.675C15.7947 0.875 15.8947 1.1125 15.8947 1.3875C15.8947 1.6625 15.7947 1.9 15.5947 2.1L6.39474 11.3C6.19474 11.5 5.96141 11.6 5.69474 11.6C5.42807 11.6 5.19474 11.5 4.99474 11.3L0.694738 7C0.494738 6.8 0.398905 6.5625 0.407238 6.2875C0.415572 6.0125 0.519738 5.775 0.719738 5.575C0.919738 5.375 1.15724 5.275 1.43224 5.275C1.70724 5.275 1.94474 5.375 2.14474 5.575L5.69474 9.15Z" fill="#2A3647"/>
                        </svg>
                    </div>
                </div>
            </li>`;
}


/**
 * Generates a user icon template with background color and initials.
 *
 * @param {string} color - The background color of the icon.
 * @param {string} initials - The initials to display.
 * @param {string} [container="div"] - The HTML container tag (e.g., "div", "span").
 * @returns {string} HTML string for the assigned-to icon.
 */
function getAssignedToIconTemplate(color, initials, container = "div"){
    return `<${container} class="person_icon" style="background-color: ${color}">
                ${initials}
            </${container}>`;
}


/**
 * Returns an HTML list element template for a selectable contact in the "Assigned To" dropdown.
 *
 * @param {string} selectedDesignClass - The CSS class to apply when selected.
 * @param {number} personIdx - The index of the person in the contacts list.
 * @param {string} personkey - The key of the person in the contacts object.
 * @param {boolean} checked - Whether the person is currently selected.
 * @param {Object} contacts - The contacts object containing contact data.
 * @returns {string} HTML string for the contact list element.
 */
function getListElementTemplate(selectedDesignClass, personIdx, personkey, checked, contacts){
    return `<li onclick="selectPerson(this, ${personIdx})" class="${selectedDesignClass}">
                <div class="person_info">
                    ${getAssignedToIconTemplate(contacts[personkey].avatarColor, generateInitials(contacts[personkey].name))}
                    ${contacts[personkey].name}
                </div>
                <img src="${getCheckboxImg(checked)}">
            </li>`;
}


/**
 * Returns an HTML list element template for an assigned person.
 *
 * @param {Object} person - The person object.
 * @param {string} person.name - The name of the person.
 * @param {string} person.avatarColor - The color of the avatar icon.
 * @returns {string} HTML string for the assigned person list item.
 */
function assignedToListElementTemplate(person){
    return `<li>
                ${getAssignedToIconTemplate(person.avatarColor, generateInitials(person.name))}
                <span>${person.name}</span>
            </li>`;
}


/**
 * Generates the HTML for the "OK" button used to update tasks.
 *
 * @returns {string} HTML string for the OK button element.
 */
function getOKButtonTemplate(){
    return `<button 
                id="update_task_button" 
                class="button_filled button_check" 
                onclick="updateTaskAndGoBack()"
            >
                Ok
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.61905 9.15L14.0941 0.675C14.2941 0.475 14.5316 0.375 14.8066 0.375C15.0816 0.375 15.3191 0.475 15.5191 0.675C15.7191 0.875 15.8191 1.1125 15.8191 1.3875C15.8191 1.6625 15.7191 1.9 15.5191 2.1L6.31905 11.3C6.11905 11.5 5.88572 11.6 5.61905 11.6C5.35239 11.6 5.11905 11.5 4.91905 11.3L0.619055 7C0.419055 6.8 0.323221 6.5625 0.331555 6.2875C0.339888 6.0125 0.444055 5.775 0.644055 5.575C0.844055 5.375 1.08155 5.275 1.35655 5.275C1.63155 5.275 1.86905 5.375 2.06905 5.575L5.61905 9.15Z" fill="white"/>
                </svg>
            </button>`
}


/**
 * Returns an HTML template for a subtask list item with a checkbox.
 *
 * @param {Object} subtask - The subtask object.
 * @param {string} subtask.description - The description of the subtask.
 * @param {string} subtask.status - The completion status of the subtask.
 * @param {number} idx - The index of the subtask in the list.
 * @returns {string} HTML string for the subtask list item.
 */
function subtaskListElementTemplate(subtask, idx){
    return `<li onclick="findSubtaskAndToggleCheckbox(${idx})">
                <img id="checkbox_${idx}" class="checkbox_tick" src="${getCheckboxSubtask(subtask.status)}" alt="">
                <span>${subtask.description}</span>
            </li>`;
}


/**
 * Builds the drag-and-drop menu template based on the current task column.
 *
 * @param {string} column - The current kanban column of the task ("to_do", "in_progress", "await_feedback", "done").
 * @param {number} taskId - The ID of the task.
 * @returns {string} HTML string representing the menu options.
 */
function buildDragAndDropMenu(column, taskId){

    if (column === "to_do"){
        return getDragOrDropMenuTemplate("arrow_downward.svg", "In progress", "in_progress", taskId);
    }
    if (column === "in_progress"){
        return getDragOrDropMenuTemplate("arrow_upward.svg", "To do", "to_do", taskId) + getDragOrDropMenuTemplate("arrow_downward.svg", "Await feedback", "await_feedback", taskId);
    }
    if (column === "await_feedback"){
        return getDragOrDropMenuTemplate("arrow_upward.svg", "In progress", "in_progress", taskId) + getDragOrDropMenuTemplate("arrow_downward.svg", "Done", "done", taskId);
    }
    if (column === "done"){
        return getDragOrDropMenuTemplate("arrow_upward.svg", "Await feedback", "await_feedback", taskId);
    }
}


/**
 * Generates a menu item for drag-and-drop task movement.
 *
 * @param {string} icon - The icon filename (e.g., "arrow_downward.svg").
 * @param {string} text - The label of the menu option.
 * @param {string} column - The target kanban column.
 * @param {number} taskId - The ID of the task to move.
 * @returns {string} HTML string for the drag-and-drop menu item.
 */
function getDragOrDropMenuTemplate(icon, text, column, taskId){
    return `<li onclick="moveTaskWithMenu(event, '${column}', ${taskId})">
                <img class="drag_and_drop_icon" src="../assets/img/icons/task/${icon}">
                ${text}
            </li>`;
}


/**
 * Generates the HTML for a task card used in the kanban board.
 *
 * @param {Object} task - The task object containing task information.
 * @returns {string} HTML string for the task card element.
 */
function getTaskCardTemplate(task){
    return `<article
                id="task_card_${task['id']}"
                draggable="true"
                ondragstart="startDragging(${task['id']}, event)"
                ondragend="endDragging(event)"     
                class="board_card"
                onclick="displayTaskOverlay(${task['id']})"
            >
                
                    <div class="task_card_header">
                        ${getCategory(task['category'])}  
                        <div class="drag_and_drop_menu_wrapper">  
                            <img onclick="openDragAndDropMenu(event, ${task['id']})" class="drag_and_drop_mobile" src="../assets/img/icons/task/drag_and_drop_mobile.svg"> 
 
                        </div>       
                    </div>
                    <menu id="drag_and_drop_menu_${task['id']}" class="drag_and_drop_menu_mobile d_none">
                        <span>Move to</span>
                        <ul class="drag_and_drop_buttons">
                            ${buildDragAndDropMenu(task['kanbanBoardColumn'], task['id'])}
                        </ul>
                    </menu>   

                    <h4 id="bct_title">${task['title']}</h4>
                    ${buildDescriptionContainer(task)}
                
                    
                    <div class="subtask_wrapper">
                        ${buildSubtaskProgressbar(task)}
                    
                    </div>
                
                <div class="bct_footer">
                    ${buildAssignedToTemplate(task)}

                    <img class="board_card_priority" src="../assets/img/icons/task/priorities/${getPriorityIcon(task["priority"])}" alt="Priority">
                </div>
            </article> `;
}


/**
 * Generates the progress bar HTML for a task based on completed subtasks.
 *
 * @param {number} taskId - The ID of the task.
 * @param {number} numberSubtasksCompleted - Number of completed subtasks.
 * @param {number} numberSubtasks - Total number of subtasks.
 * @param {string} progressbarColor - CSS class for the progress bar color.
 * @returns {string} HTML string containing the progress bar and text.
 */
function getProgressbarTemplate(taskId, numberSubtasksCompleted, numberSubtasks, progressbarColor, dNoneClass){
    return `<div id="progress_container_${taskId}" class="progress_container ${dNoneClass}">
                <div class="progress_bar ${progressbarColor}" id="progressbar_${taskId}" style="width: ${numberSubtasksCompleted/numberSubtasks*100}%"></div>
            </div>
            <span id="progress_text_${taskId}" class="${dNoneClass}">${numberSubtasksCompleted}/${numberSubtasks} Subtasks</span>`;
}


/**
 * Creates a list element for a category selection dropdown.
 *
 * @param {string} category - The name of the category.
 * @returns {string} HTML string for the category list item.
 */
function getCategorySelectionListElementTemplate(category){
    return `<li onclick="setCategorySelection('${category}'); checkAndEnableButton();">${category}</li>`
}


/**
 * Returns an HTML template representing the priority of a task.
 *
 * @param {string} priority - The task priority ("urgent", "medium", "low").
 * @returns {string} HTML string for the priority label and icon.
 */
function getPriorityTemplate(priority){
    return `<span>${firstLetterUpperCase(priority)}</span><img src="../assets/img/icons/task/priorities/${getPriorityIcon(priority)}" alt="Priority Icon ${priority}">`;

}


/**
 * Generates a colored label for a task category.
 *
 * @param {string} category - The name of the task category.
 * @returns {string} HTML string for the category label.
 */
function getCategoryLabelTemplate(category){
    return `<span class="category category_bg_color${getCategoryNumber(category)}">${category}</span>`;
}


/**
 * Returns a shortened version of the task description.
 *
 * @param {string} description - The full description text.
 * @returns {string} HTML paragraph element with the shortened text.
 */
function getShortDescriptionTemplate(description){
    return `<p id="bct_description">${shortenText(description, 40)}</p>`;
}

