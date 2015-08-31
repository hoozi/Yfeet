/**
 * @author: hulei
 * @build : 2013-08-05
 * @NAME  : mapConfig
 */
(function($,window){
	$.getDate = function(datetime, num) {
		if (datetime) {
			datetime = datetime.split("-");
			var day = new Date(datetime[0], datetime[1] - 1, datetime[2]);
		} else {
			var day = new Date();
		}
		var newday = new Date();
		newday.setTime(day.getTime() + num * 1000 * 60 * 60 * 24);
		var m = newday.getMonth() + 1;
		var d = newday.getDate();
		return newday.getFullYear() + "-" + (m < 10 ? "0" + m: m) + "-" + (d < 10 ? "0" + d: d);
	};
	
	$.fn.timeSilder = function(options) {
		var opt = $.extend({}, {
			prev:".prev",
			next:".next",
			addTime:".add_date"
		}, options);
		var bAdd = true;
	}
	
})(jQuery,window);