let userProfileModal = document.getElementById("userProfileModal");
let inputSearchbar = document.getElementById("inputSearchbar");
let modalHeader = document.querySelector(".modal-header");
let usersListRow = document.getElementById("usersList");
let modalTitle = document.querySelector(".modal-title");
let modalBody = document.querySelector(".modal-body");
let btnSearch = document.getElementById("btnSearch");
let pagesUl = document.getElementById("pagesUl");
let form = document.querySelector("#form");
let params = Object.keys(users_data[0]);
let numberOfCardsPerPage = 6;
let lastUsers = users_data;
let currentPage = 1;
let inputSearchBarValue;

function formPreventFromRefresh(event) {
	event.preventDefault();
}

function userProfileModalCreator(data) {
	const targetUser = users_data.find((user) => user.id == data);
	modalTitle.innerText = targetUser.first_name + " " + targetUser.last_name;
	modalBody.innerHTML = `
    <div class="row p-3">
        <div class="col p-3">
            <p>Id: ${targetUser.id}</p>
            <p>Email: ${targetUser.email}</p>
            <p>First Name: ${targetUser.first_name}</p>
            <p>Last Name: ${targetUser.last_name}</p>
        </div>
        <div class="col"><img src="${targetUser.localImagePlace}" class="card-img-top my-2 rounded-3 text-center col-6 h-75"></img>
    </div>`;
}

function userCardMaker(user) {
	user.localImagePlace = `./images/${user["id"]}-image.jpg`;
	return `<div class="col-md-4 col-sm-6 my-1">
                <div class="card px-2 shadow h-100">
                     <img src="${user.localImagePlace}" class="card-img-top my-2 rounded-3">
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
                    Profile</button>
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
	const filteredUsers = users_data.filter((item) => {
		for (const param of params) {
			if (param === "avatar") continue;
			if (String(item[param]).toLowerCase().includes(value.trim().toLowerCase()))
				return true;
		}
	});
	currentPage = 1;
	if (!filteredUsers.length) {
		usersListRow.innerHTML = `<h1 style="color:red;">Unfortunately Nothing found!!</h1>`;
		pagesUl.innerHTML = "";
		return;
	}
	lastUsers = filteredUsers;
	renderUsersList(lastUsers);
}

btnSearch.addEventListener("click", function () {
	searchInUsers(inputSearchBarValue);
});

inputSearchbar.addEventListener("keyup", function (e) {
	inputSearchBarValue = inputSearchbar.value;
	if (inputSearchBarValue === "") {
		lastUsers = users_data;
		currentPage = 1;
		renderUsersList(lastUsers);
	}
	if (e.key === "Enter") searchInUsers(inputSearchBarValue);
});

function pageLinksCreator(users_data) {
	let pageNumber = Math.ceil(users_data.length / numberOfCardsPerPage);
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
