var editBtn = document.getElementById('editBtn');
var cancelEditBtn = document.querySelector('#cancelEditBtn');
var editUserForm = document.getElementById("editUserForm");
var additionalFormFieldsDiv = editUserForm.querySelector("#additionalFields");
var formInputFieldsArr = [...editUserForm.querySelectorAll("input")];
var roleSelect = editUserForm.querySelector("select[id='selectRole']");

editBtn.addEventListener('click', (event) => {
    event.preventDefault();

    formInputFieldsArr.forEach(field => {
        field.removeAttribute("disabled")
    });
    roleSelect.removeAttribute('disabled');
    additionalFormFieldsDiv.classList.remove('collapse');
    editBtn.classList.add("collapse");
})

cancelEditBtn.addEventListener('click', (event) => {
    event.preventDefault();

    formInputFieldsArr.forEach(field => {
        field.setAttribute("disabled", 'true')
    });
    roleSelect.setAttribute('disabled', 'true');
    additionalFormFieldsDiv.classList.add('collapse');
    editBtn.classList.remove("collapse");
})
