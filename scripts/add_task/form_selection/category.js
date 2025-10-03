
function getCurrentCategory(){
    return document.getElementById("category_selection").innerText;
}


function renderCategoryOptions(){
    let categoryOptionsRef = document.getElementById("category_options");
    let optionList = "";
    const categories = ["User Story", "Technical Task"];

    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
        if (!checkCategorySelection(categories[catIdx])){
            optionList += getCategorySelectionListElementTemplate(categories[catIdx]);
        }
    }
    categoryOptionsRef.innerHTML = optionList;
}


/**
 * Checks if the currently selected category matches the provided category.
 *
 * @param {string} category - The category to check against the current selection.
 * @returns {boolean} True if the selected category matches the provided category, otherwise false.
 */
function checkCategorySelection(category){
    let categoryButtonRef = document.getElementById("category_selection");
    let choice = categoryButtonRef.innerText;
    return choice === category;
}


/**
 * Updates the category selection button text to display the selected category.
 *
 * @param {string} category - The name of the category to display on the selection button.
 */
function showCategorySelection(category){
    let categoryButtonRef = document.getElementById("category_selection");
    categoryButtonRef.innerText = category;
}


function clearCategoryInput(){
    document.getElementById("category_selection").innerText = "Select task category";
    document.getElementById("category_options").classList.add("d_none");
}