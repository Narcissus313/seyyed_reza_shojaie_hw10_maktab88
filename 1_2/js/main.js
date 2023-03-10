let userProfileModal = document.getElementById("userProfileModal");
let newUserModal = $("#newUserModal");
let inputSearchbar = document.getElementById("inputSearchbar");
let newUserModalContent = $("#newUserModal .modal-content");
let modalHeader = document.querySelector(".modal-header");
let usersListRow = document.getElementById("usersList");
let btnSearch = document.getElementById("btnSearch");
let pagesUl = document.getElementById("pagesUl");
let form = document.querySelector("#form");
let modalContent = $(".modal-content");
let modal = $(".modal");
let btnEdit;
let btnDelete;
let btnUpdate;
let inputSearchBarValue;
let numberOfCardsPerPage = 6;
let currentPage = 1;
let usersData = fetchUserData();
let lastUsers = usersData;
let newId = calculateNewId();

function calculateNewId() {
	let ids = usersData.map((user) => user.id);
	let max = Math.max.apply({}, ids);
	return max + 1;
}

function fetchUserData() {
	let users = [];
	for (let i = 1; i < 3; i++) {
		$.ajax({
			url: `https://reqres.in/api/users?page=${i}`,
			type: "GET",
			data: {
				name: "reza",
			},
			success: (response) => {
				users.push(...response.data);
			},
			async: false,
		});
	}
	return users;
}

function formPreventFromRefresh(event) {
	event.preventDefault();
}

function validateEmail(email) {
	for (const user of usersData) {
		if (user.email === email) return false;
	}
	return true;
}

function fieldRegexChecker(user = null) {
	const nameRegex = /[a-zA-Z\s]+/;
	const emailRegex = /^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
	if (!!user) {
		if (
			!nameRegex.test($("#creationModal-fnameInput").val().trim()) ||
			!nameRegex.test($("#creationModal-lnameInput").val().trim())
		) {
			alert("invalid first name or last name. just letters and space");
			return false;
		} else if (
			user.email != $("#creationModal-emailInput").val() &&
			!validateEmail($("#creationModal-emailInput").val())
		) {
			alert("Email exists. choose another one");
			return false;
		} else if (
			!emailRegex.test($("#creationModal-emailInput").val().trim())
		) {
			alert("Email is wrong");
			return false;
		}
		return true;
	}
	if (
		!nameRegex.test($("#creationModal-fnameInput").val().trim()) ||
		!nameRegex.test($("#creationModal-lnameInput").val().trim())
	) {
		alert("invalid first name or last name. just letters and space");
		return false;
	} else if (!validateEmail($("#creationModal-emailInput").val())) {
		alert("Email exists. choose another one");
		return false;
	} else if (!emailRegex.test($("#creationModal-emailInput").val().trim())) {
		alert("Email is wrong");
		return false;
	}
	return true;
}

function newUserCreator() {
	newUserModalContent.html(`
		<div class="modal-header">
            <h5 class="modal-title text-primary mt-2">New User</h5>
        </div>
		<div class="modal-body p-0">
			<div class="row p-3">
				<div class="col p-3">
					<div class="mb-3">
						<label for="creationModal-fnameInput" class="form-label">Firstname *</label>
						<input type="text" class="form-control" id="creationModal-fnameInput" value=""/>
					</div>
					<div class="mb-3">
						<label for="creationModal-lnameInput" class="form-label">Lastname *</label>
						<input type="text" class="form-control" id="creationModal-lnameInput" value=""/>
					</div>
					<div class="mb-3">
						<label for="creationModal-emailInput" class="form-label">Email *</label>
						<input type="email" class="form-control" id="creationModal-emailInput" value=""/>
					</div>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-success px-4" id="btnCreateConfirm">Create</button>
		</div>`);
	btnCreateConfirm = $("#btnCreateConfirm");
	btnCreateConfirm.on("click", function () {
		let newUser = {};
		newUser.id = newId;
		if (fieldRegexChecker()) {
			newUser.first_name = $("#creationModal-fnameInput").val();
			newUser.last_name = $("#creationModal-lnameInput").val();
			newUser.email = $("#creationModal-emailInput").val();
			newUser.avatar = "";
			usersData.push(newUser);
			newId++;
			renderUsersList(usersData);
			newUserModal.modal("hide");
		}
	});
}

function userProfileModalCreator(data) {
	const targetUser = usersData.find((user) => user.id == data);

	modalContent.html(`
		<div class="modal-header">
            <h5 class="modal-title text-primary mt-2">${targetUser.first_name} ${targetUser.last_name}</h5>
        </div>
		<div class="modal-body p-0">
			<div class="row p-3">
				<div class="col p-3">
					<p>Id: ${targetUser.id}</p>
					<p>First Name: ${targetUser.first_name}</p>
					<p>Last Name: ${targetUser.last_name}</p>
					<p>Email: ${targetUser.email}</p>
				</div>
				<div class="col">
					<img src="${targetUser.localImagePlace}" class="card-img-top my-2 rounded-3 text-center col-6 h-75"></img>
				</div>
			</div>
		</div>
		<div class="modal-footer">
			<button type="button" class="btn btn-warning px-4" id="btnEdit">Edit</button>
			<button type="button" class="btn btn-danger px-4 d-none" id="btnDelete">Delete</button>
			<button type="button" class="btn btn-primary px-4 d-none" id="btnUpdate">Update</button>
			<button type="button" class="btn btn-secondary px-4" data-bs-dismiss="modal">Close</button>
		</div>`);
	let modalBody = $(".modal-body");
	btnEdit = $("#btnEdit");
	btnDelete = $("#btnDelete");
	btnUpdate = $("#btnUpdate");
	btnEdit.on("click", () => {
		btnUpdate.removeClass("d-none");
		btnDelete.removeClass("d-none");
		btnEdit.addClass("d-none");
		// console.log(modalBody);
		modalBody.html(`
		<div class="modal-body">
			<!-- firstname input -->
			<div class="mb-3">
				<label for="creationModal-fnameInput" class="form-label">Firstname *</label>
				<input type="text" class="form-control" id="creationModal-fnameInput" value="${targetUser.first_name}"/>
			</div>
			<!-- lastname input -->
			<div class="mb-3">
				<label for="creationModal-lnameInput" class="form-label">Lastname *</label>
				<input type="text" class="form-control" id="creationModal-lnameInput" value="${targetUser.last_name}"/>
			</div>
			<!-- email input -->
			<div class="mb-3">
				<label for="creationModal-emailInput" class="form-label">Email *</label>
				<input type="email" class="form-control" id="creationModal-emailInput" value="${targetUser.email}"/>
			</div>
    	</div>
		`);
	});
	btnUpdate.on("click", () => {
		let target = usersData.find((user) => user.id === targetUser.id);

		if (fieldRegexChecker(targetUser)) {
			target.first_name = $("#creationModal-fnameInput").val();
			target.last_name = $("#creationModal-lnameInput").val();
			target.email = $("#creationModal-emailInput").val();
			renderUsersList(usersData);
			modal.modal("hide");
		}
	});
	btnDelete.on("click", () => {
		if (confirm("Are you sure you want to delete the user?")) {
			usersData.splice(usersData.indexOf(targetUser), 1);
			renderUsersList(usersData);
			modal.modal("hide");
		}
	});
}

function userCardMaker(user) {
	user.localImagePlace = `./images/${user["id"]}-image.jpg`;
	return `
	<div class="col-lg-4 ol-md-6 col-sm-6 ">
		<div class=" my-1 p-4">
		<div class="card px-2 shadow h-100">
			<img src="${user.localImagePlace}" class="card-img-top mb-2 px-3 rounded-3 mt-4">
			<h5 class="card-title my-3 text-center fw-bold">${user.first_name} ${user.last_name}</h5>
			<ul class="list-group list-group-flush h-25 fs-6">
				<li class="list-group-item p-2">id: ${user.id}</li>
				<li class="list-group-item p-2">email: ${user.email}</li>
			</ul>
			<button
				onclick='userProfileModalCreator(${user.id})'
				class="btn btn-primary my-3"
				data-bs-toggle="modal" data-bs-target="#userProfileModal"
				>
				Profile
			</button>
		</div>
	</div>
	</div>`;
}

function usersListGenerator(userList) {
	let cards = "";
	for (
		let i = currentPage * numberOfCardsPerPage - numberOfCardsPerPage;
		i < currentPage * numberOfCardsPerPage;
		i++
	) {
		if (!userList[i]) return cards;
		cards += userCardMaker(userList[i]);
	}
	return cards;
}

function renderUsersList(customUsers) {
	usersListRow.innerHTML = "";
	usersListRow.innerHTML += usersListGenerator(customUsers);
	pageLinksCreator(customUsers);
}
function searchInUsers(value) {
	const filteredUsers = usersData.filter((item) => {
		for (const param of Object.keys(usersData[0])) {
			if (param === "avatar") continue;
			if (
				String(item[param])
					.toLowerCase()
					.includes(value.trim().toLowerCase())
			)
				return true;
		}
	});
	currentPage = 1;
	if (!filteredUsers.length) {
		usersListRow.innerHTML = `<h1 style="color:red;">Unfortunately Nothing found!!</h1>`;
		pagesUl.innerHTML = "";
		return;
	}
	let lastUsers = filteredUsers;
	renderUsersList(lastUsers);
}

btnSearch.addEventListener("click", () => searchInUsers(inputSearchBarValue));

inputSearchbar.addEventListener("keyup", function (e) {
	inputSearchBarValue = inputSearchbar.value;
	if (inputSearchBarValue === "") {
		lastUsers = usersData;
		currentPage = 1;
		renderUsersList(lastUsers);
	}
	if (e.key === "Enter") searchInUsers(inputSearchBarValue);
});

function pageLinksCreator(usersData) {
	let pageNumber = Math.ceil(usersData.length / numberOfCardsPerPage);
	pagesUl.innerHTML = "";
	for (let i = 1; i < pageNumber + 1; i++) {
		pagesUl.innerHTML += `<li class="page-item ${
			i == currentPage ? "active" : ""
		}"><a class="page-link" href="#">${i}</a></li>`;
	}
}

pagesUl.addEventListener("click", function (e) {
	for (let i = 0; i < pagesUl.children.length; i++) {
		pagesUl.children[i].className = "page-item";
	}
	e.target.parentElement.className += " active";
	currentPage = +e.target.innerText;
	renderUsersList(lastUsers);
});

form.addEventListener("submit", formPreventFromRefresh);
renderUsersList(lastUsers);
