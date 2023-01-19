// https://reqres.in/api/users/2
let selectedOption;
function resetTextFields() {
	$("#text-area-get").val("");
	$(".get img").attr("src", "");
	$("#status").val("");
	$("#div-response-body textarea").val("");
}
function contentTypeGetter(xhr) {
	let content = xhr ? xhr.getResponseHeader("content-type") : null;
	return content == null ? "No Content" : content;
}
function statusPartWriter(statusCode, xhr) {
	$("#status").val(
		String(statusCode) +
			" - content type: (( " +
			contentTypeGetter(xhr) +
			" ))"
	);
}
function tryParseJSONObject(jsonString) {
	try {
		let obj = JSON.parse(jsonString);
		if (obj && typeof obj === "object") {
			return obj;
		}
	} catch (e) {}

	return false;
}
$("#status").attr("disabled", "disabled");
$("#div-response-body textarea").attr("disabled", "disabled");
$("#div-json-body textarea").attr("disabled", "disabled");
$("#select-method").click(function () {
	selectedOption = $("#select-method").find(":selected").val();
	switch (selectedOption) {
		case "GET":
			$(".get").removeClass("d-none");
			$(".post").addClass("d-none");
			break;
		case "POST":
			resetTextFields();
			$(".get").addClass("d-none");
			$(".post").removeClass("d-none");
			break;
		default:
			$(".get").addClass("d-none");
			$(".post").addClass("d-none");
			break;
	}
});
$("#btn-get-json").click(function () {
	if (selectedOption === "GET") {
		resetTextFields();
		let url = $("input.form-control").val();
		let statusCode;
		if (!url) {
			alert("no url");
			return;
		}

		$.ajax({
			url: url,
			type: "GET",
			data: {
				name: "reza",
				age: 34,
			},
			success: (response) => {
				resetTextFields();
				$("#text-area-get").val(
					JSON.stringify(response["data"], undefined, 4)
				);
				$(".get img").attr("src", response["data"]["avatar"]);
			},
		})
			.done(function (data, textStatus, xhr) {
				contentTypeGetter(xhr);
				statusCode = textStatus == "success" ? "200" : null;
				statusPartWriter(statusCode, xhr);
			})
			.fail(function (data, textStatus, xhr) {
				contentTypeGetter(xhr);
				resetTextFields();
				statusCode = String(data.status);
				console.log("statusCode: ", statusCode);
				if (statusCode == "0") {
					$("#div-json-body textarea").val("Connection error!!");
					return;
				}
				statusPartWriter(statusCode, xhr);
				$("#text-area-get").val("Page Not Found!");
				$(".get img").attr("src", "");
			});
	} else if (selectedOption === "POST") {
		resetTextFields();
		let url = $("input.form-control").val();
		let statusCode;
		if (!url) {
			alert("no url");
			return;
		}
		let requestBodyData = tryParseJSONObject(
			$("#div-request-body textarea").val()
		);
		if (!requestBodyData) {
			alert("Not a valid JSON input!");
			return;
		}
		$.ajax({
			url: url,
			type: "POST",
			data: requestBodyData,
			success: (response) => {
				resetTextFields();
				$("#div-response-body textarea").val(
					JSON.stringify(response, undefined, 4)
				);
			},
		})
			.done(function (data, textStatus, xhr) {
				contentTypeGetter(xhr);
				statusCode = textStatus == "success" ? "200" : null;
				statusPartWriter(statusCode, xhr);
			})
			.fail(function (data, textStatus, xhr) {
				contentTypeGetter(xhr);
				resetTextFields();
				statusCode = data.status;
				if (statusCode === "0")
					$("#div-response-body textarea").val("Connection error");

				statusPartWriter(statusCode, xhr);
				$("#text-area-get").val("Page Not Found!");
				$(".get img").attr("src", "");
			});
	} else alert("choose a method");
});
