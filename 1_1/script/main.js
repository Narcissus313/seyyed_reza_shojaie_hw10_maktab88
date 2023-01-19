// https://reqres.in/api/users/2
let selectedOption;
function resetTextFields() {
	$("#text-area-get").val("");
	$(".get img").attr("src", "");
	$("#status").val("");
}
function contentTypeGetter(xhr) {
	let content = xhr ? xhr.getResponseHeader("content-type") : null;
	return content == null ? "No Content" : content;
}
$("#status").attr("disabled", "disabled");
$("#select-method").click(function () {
	selectedOption = $("#select-method").find(":selected").val();
	if (selectedOption === "GET") {
		$(".get").removeClass("d-none");
		$(".post").addClass("d-none");
	} else if (selectedOption === "POST") {
		$(".get").addClass("d-none");
		$(".post").removeClass("d-none");
	} else {
		$(".get").addClass("d-none");
		$(".post").addClass("d-none");
	}
});
$("#btn-get-json").click(function () {
	if (selectedOption === "GET") {
		resetTextFields();
		let url = $("input.form-control").val();
		let statusCode;
		if (!!url) {
			$.ajax({
				url: url,
				type: "GET",
				data: {
					name: "reza",
					age: 34,
				},
				success: (response, status, xhr) => {
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
					$("#status").val(
						String(statusCode) +
							" - content type: (( " +
							contentTypeGetter(xhr) +
							" ))"
					);
				})
				.fail(function (data, textStatus, xhr) {
					contentTypeGetter(xhr);
					resetTextFields();
					statusCode = data.status;
					$("#status").val(
						String(statusCode) +
							" - content type: (( " +
							contentTypeGetter(xhr) +
							" ))"
					);
					$("#text-area-get").val("Page Not Found!");
					$(".get img").attr("src", "");
				});
		} else alert("no url");
	} else alert("choose a method");
});
