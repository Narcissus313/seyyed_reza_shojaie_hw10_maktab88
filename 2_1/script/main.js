let nameRegex = /^[a-z\s]{3,30}$/i; //letters, nums and underline
let emailRegex = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
let passwordRegex =
	/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/; //letters(lowerCase and upperCase, numbers and special characters)

let firstNameInputField = $("#floatingInputInvalidFirstName");
let firstErrorField = $("#labelErrorFirstName");
let lastNameInputField = $("#floatingInputInvalidLastName");
let lastErrorField = $("#labelErrorLastName");
let emailField = $("#floatingInputInvalidEmail");
let emailErrorField = $("#labelErrorEmail");
let passwordInputField = $("#floatingInputInvalidPassword");
let passwordErrorField = $("#labelErrorPassword");
let btnSubmit = $("#btnSubmit");
let formCondition = true;

const fieldErrorShower = (regexPattern, inputFild, errorField) => {
	if (!regexPattern.test(inputFild.val())) {
		inputFild.addClass("is-invalid");
		errorField.removeClass("d-none");
		formCondition = false;
	} else {
		inputFild.removeClass("is-invalid");
		errorField.addClass("d-none");
	}
};

btnSubmit.on("click", () => {
	formCondition = true;
	fieldErrorShower(nameRegex, firstNameInputField, firstErrorField);
	fieldErrorShower(nameRegex, lastNameInputField, lastErrorField);
	fieldErrorShower(emailRegex, emailField, emailErrorField);
	fieldErrorShower(passwordRegex, passwordInputField, passwordErrorField);
	if (!!formCondition) alert("good !!");
});

firstNameInputField.on("input", () => {
	firstNameInputField.removeClass("is-invalid");
	firstErrorField.addClass("d-none");
});
lastNameInputField.on("input", () => {
	lastNameInputField.removeClass("is-invalid");
	lastErrorField.addClass("d-none");
});
emailField.on("input", () => {
	emailField.removeClass("is-invalid");
	emailErrorField.addClass("d-none");
});
passwordInputField.on("input", () => {
	passwordInputField.removeClass("is-invalid");
	passwordErrorField.addClass("d-none");
});
