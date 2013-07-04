function getSequentialState() {
	var $checkboxes = $('input[type=checkbox]');

	var result = [];
	$checkboxes.each(function() {
		var checked = $(this).attr('checked') != "";
		result.push(checked);
	});
	return result;
}

