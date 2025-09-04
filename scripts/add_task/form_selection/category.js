// Category Selection ---------------------------------------------------------------------

const categories = ["Technical Task", "User Story"];


function closeDropDownCategorySelection(event){
    const containerCategory = document.getElementById('selection_container_category');
    if (!containerCategory.contains(event.target)) {
        hideSelectionList('category_options', 'drop_down_categories')
    }        

}


function renderCategoryOptions(){
    let categoryOptionsRef = document.getElementById("category_options");
    let optionList = "";

    for (let catIdx = 0; catIdx < categories.length; catIdx++) {
        if (!checkCategorySelection(categories[catIdx])){
            optionList += `<li onclick="setCategory('${categories[catIdx]}'); checkAndEnableButton();">${categories[catIdx]}</li>`
        }
    }
    categoryOptionsRef.innerHTML = optionList;
}


function setCategory(category){
    currentCategory = category;
    showCategorySelection(category);
    renderCategoryOptions();
}


function checkCategorySelection(category){
    let categoryButtonRef = document.getElementById("category_selection");
    let choice = categoryButtonRef.innerText;
    return choice === category;
}


function showCategorySelection(category){
    let categoryButtonRef = document.getElementById("category_selection");
    categoryButtonRef.innerText = category;
}


function clearCategoryInput(){
    document.getElementById("category_selection").innerText = "Select task category";
    document.getElementById("category_options").classList.add("d_none");
    currentCategory = "";
}