function getParallelState() {

	var $concurrent = $('input[type=checkbox]');
	
	$concurrent.bind('click', function(event) {
	});

	var concurrent = $concurrent.map(function() {
		return $(this).attr('checked') != "";
	}).get();

	return concurrent;
}