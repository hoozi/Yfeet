jQuery.extend({
	regex: {
		'require': /.*/,
		'email': /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		'phone': /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/,
		'mobile': /^((\(\d{2,3}\))|(\d{3}\-))?(13|15|18)\d{9}$/,
		'url': /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/,
		'currency': /^\d+(\.\d+)?$/,
		'number': /^\d+$/,
		'zip': /^[1-9]\d{5}$/,
		'qq': /^[1-9]\d{4,12}$/,
		'integer': /^[-\+]?\d+$/,
		'double': /^[-\+]?\d+(\.\d+)?$/,
		'english': /^[A-Za-z]+$/,
		'string': /^[A-Za-z_]+[0-9_a-zA-Z]*$/,
		'ip': /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/,
		'card': /^(\d{14}|\d{17})(\d|[xX])$/,
		'birth': /^\d{4}.{1}\d{1,2}.{1}\d{1,2}/,
		'method': /^[A-Za-z_]+[0-9_a-zA-Z]*(\:|：).+$/,
		'username': /^[A-Za-z_]+[0-9_a-zA-Z]*[0-9a-zA-Z]+$/
	},
	match: function(value, name, flags) {
		var pattern = this.regex[name] ? this.regex[name] : 'require';
		var reg = new RegExp(pattern, flags);
		return reg.test(value);
	},
	rand: function(min, max) {
		var Range = max - min;
		var Rand = Math.random();
		return (min + Math.round(Rand * Range));
	},
	setcookie: function(name, value, expire) {
		expire = expire > 0 ? expire: 0;
		var exp = new Date();
		exp.setTime(exp.getTime() + expire * 24 * 60 * 60 * 1000);
		document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
	},
	getcookie: function(name) {
		var arr,
		reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
		if (arr = document.cookie.match(reg)) return unescape(arr[2]);
		else
		 return null;
	},
	delcookie: function(name) {
		var exp = new Date();
		exp.setTime(exp.getTime() - 1);
		var cval = $.getcookie(name);
		if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
	},
	int: function(value) {
		return parseInt(value);
	},
	float: function(value) {
		return parseFloat(value);
	},
	isnull: function(input) {
		return $.trim($(input).val()) == '';
	},
	eq: function(input1, input2) {
		var value1 = $.trim($(input1).val());
		var value2 = $.trim($(input2).val());
		return value1 == value2;
	},
	scrollBottom: function() {
		var winHeight = $(window).height();
		var docHeight = $(document).height();
		if (docHeight > winHeight) {
			var top = document.body.scrollTop ? document.body.scrollTop: document.documentElement.scrollTop;
			if (top >= docHeight - winHeight) return true;
		}
		return false;
	},
	checkbox: function(o, container, v) {
		if ($(o).attr('checked') == true || v) $(container + ' input[type=checkbox]').attr('checked', true);
		else if ($(o).attr('checked') == false || !v) $(container + ' input[type=checkbox]').attr('checked', false);
	},
	getFileName: function(path) {
		path = path.split("/");
		var l = path.length;
		if (l > 1) return path[l - 1];
		else return path[0];
	},
	getFileExt: function(file) {
		file = file.split(".");
		var l = file.length;
		if (l > 1) return '.' + file[l - 1];
		else return - 1;
	},
	getFileExtCls: function(ext) {
		var uploadifyExts = ['ac3', 'ai', 'aiff', 'ani', 'asf', 'au', 'avi', 'bat', 'bin', 'bmp', 'bup', 'cab', 'cal', 'cat', 'cur', 'dat', 'dcr', 'der', 'dic', 'dll', 'doc', 'docx', 'dvd', 'dwg', 'dwt', 'font', 'gif', 'hlp', 'hst', 'html', 'ico', 'ifo', 'inf', 'ini', 'java', 'jif', 'jpg', 'log', 'm4a', 'mmf', 'mmm', 'mov', 'mp2', 'mp2v', 'mp3', 'mp4', 'mpeg', 'msp', 'pdf', 'png', 'ppt', 'pptx', 'psd', 'ra', 'rar', 'reg', 'rtf', 'theme', 'tiff', 'tlb', 'ttf', 'txt', 'vod', 'wav', 'wam', 'wmv', 'wpl', 'wri', 'xls', 'xlsx', 'xml', 'xsl', 'zip'];
		ext = ext.toLowerCase().substr(1);
		if (jQuery.inArray(ext, uploadifyExts) != '-1') return ext + ".png";
		else
		 return "default.gif";
	},
	parseJson: function(data) {
		return eval('(' + data + ')');
	},
	strip_tags: function(str) {
		return str.replace(/<.*?>/g, "");
	},
	getDate: function(datetime, num) {
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
	},
	getNextTimed: function(timed, n) {
		timed = timed.split(" ");
		var tmp1 = timed[0].split("-");
		var tmp2 = timed[1].split(":");
		var day = new Date(tmp1[0], tmp1[1] - 1, tmp1[2], tmp2[0], tmp2[1], tmp2[2]);
		var newday = new Date();
		newday.setTime(day.getTime() + n * 1000 * 60 * 60);
		var h = newday.getHours();
		var m = newday.getMinutes();
		return (h < 10 ? '0' + h: h) + ":" + (m < 10 ? '0' + m: m);
	}
});
jQuery.fn.extend({
	check: function(name) {
		return jQuery.match(jQuery.trim($(this).val()), name);
	},
	getDate: function(num, text) {
		return jQuery.getDate(text ? jQuery(this).val() : jQuery(this).html(), num);
	},
	rpcWith: function(input, find, replace, force) {
		if (jQuery(this).children('option').length) {
			if (jQuery.trim(jQuery(this).val())) {
				var r = jQuery.trim(jQuery(this).children('option:selected').html());
				r = r ? r: jQuery.trim(jQuery(this).val())
			}
		} else {
			var r = jQuery.trim(jQuery(this).val());
		}
		if (r) {
			if (find) {
				replace = replace ? replace: '';
				r = r.replace(find, replace);
			}
			var v = jQuery.trim(jQuery(input).val());
			jQuery(input).val(force ? r: (v ? v: r));
		}
	},
	delConfirm: function(msg) {
		msg = msg ? msg: '您确实要删除该数据吗？';
		var i = confirm(msg);
		if (i) {
			var url = $(this).attr("href") ? $(this).attr("href") : ($(this).attr("rel") ? $(this).attr("rel") : $(this).attr("alt"));
			window.location.href = url;
		}
		return false;
	},
	remain: function(maxLength, container) {
		var value = jQuery.trim(jQuery(this).val());
		var len = value.length;
		if (len > 0) {
			if (len > maxLength) {
				var remainLength = 0;
				jQuery(this).val(value.substring(0, maxLength));
			} else
			 var remainLength = maxLength - len;
		} else
		 var remainLength = maxLength;
		if (container) {
			jQuery(container).html(remainLength);
		}
		return remainLength;
	},
	removeUpload: function(varname, tbimg, muilt) {
		var $p = $(this).parent();
		if (!muilt) {
			if ($p.siblings().length <= 0) {
				var html = tbimg ? "<input type='hidden' name='" + tbimg + "'>": "";
				$p.parent().html("<input type='hidden' name='" + varname + "'>" + html);
			}
		}
		$p.remove();
	}
});