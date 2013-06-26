function getParallelState() {

	var $concurrent = $('input[type=checkbox]');
	//$concurrent.bind('click', function(event) {
	//});

	var result = [];
	$concurrent.each(function() {
		var checked = $(this).attr('checked') != "";
		result.push(checked);
	});
	return result;
}