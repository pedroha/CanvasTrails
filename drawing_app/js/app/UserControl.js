function getConcurrentState() {
	var $checkboxes = $('input[type=checkbox]');
	//$concurrent.bind('click', function(event) {
	//});

	var result = [];
	$checkboxes.each(function() {
		var unchecked = $(this).attr('checked') == "";
		result.push(unchecked);
	});
	return result;
}

function getSequentialState() {
	var $checkboxes = $('input[type=checkbox]');

	var result = [];
	$checkboxes.each(function() {
		var checked = $(this).attr('checked') != "";
		result.push(checked);
	});
	return result;
}

