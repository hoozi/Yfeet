document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.position.min.js"></script>');
document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.core.js"></script>');
document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.widget.js"></script>');
document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.mouse.js"></script>');
document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.draggable.js"></script>');
document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.droppable.js"></script>');
document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.resizable.min.js"></script>');
document.write('<script src="' + HTTP_HOST + 'ui/jquery.ui.sortable.min.js"></script>');
document.write('<script src="' + HTTP_HOST + 'date/WdatePicker.js"></script>');
var $TRAVEL_BOX = null; (function($, doc) {
	$.fn.edit = function(name, id, defaultValue, len) {
		if ($(this).children(".STATUS-EDITING").length <= 0) {
			$(this).find("*").remove();
			var value = $.trim($(this).text());
			$(this).html("<input class='STATUS-EDITING' type='text' value='" + value + "'>");
			$(this).find(".STATUS-EDITING").focus().blur(function() {
				var v = $.trim($(this).val());
				v = v == '' ? defaultValue: v;
				if (len > 0) {
					v = v.substr(0, len);
				}
				$(this).parent().html(v + "<input type='hidden' value='" + v + "' name='" + name + "' id='" + id + "'>");
			});
		}
	},
	$.fn.closeup = function() {
		$(this).find(".content").html("");
		$.unloading(true);
		$(this).animate({
			opacity: 0.35,
			width: "305px"
		},
		"slow",
		function() {
			$(this).hide();
		});
	},
	$.fn.setup = function(autosave) {
		if ($('#travel-list').find(".item").length <= 0) {
			tb_alert('您还没有选择任何景点哦');
			return false;
		}
		$(this).show().animate({
			opacity: 1,
			width: $(this).parent().width() - 120
		},
		"slow",
		function() {
			$(this).loading('正在载入数据，请稍候');
			$(this).find(".content").loadup(autosave);
		});
	},
	$.fn.loadup = function(autosave) {
		var $items = $(".container ul").clone().sorted({
			by: function(v) {
				var attr = $(v).attr("lang").split(":");
				return attr[1];
			}
		});
		var len = $items.length;
		if (len > 0) {
			$(this).html("<div style='height:100%;'></div>");
			var $div = $(this).find("div");
			var width = 0;
			var day = 1;
			$items.each(function(i) {
				$(this).find(".sort_tip,.del,.pos").remove();
				if ($(this).find("li").length > 0) {
					$(this).find("li").append("<div class='timer'>00:00</div>");
					var attr = $(this).attr("lang").split(":");
					var html = "<div class='viewlist'><div class='topbar'>" + "<font>第<b>" + day + "</b>天</font><span>" + attr[1] + "</span><a style='display:none' class='t_date'></a>" + "</div><div class='footer'><ul lang='" + attr[1] + "'>" + $(this).html() + "</ul></div></div>";
					$div.append(html);
					width += 306;
					day++;
				}
			});
			$div.width(width);
			if (autosave) {
				$(this).accept();
			} else {
				$(this).process();
			}
		} else {
			$.unloading();
		}
	},
	$.fn.process = function(callbak) {
		if ($(this).find(".item").length <= 0) {
			tb_alert('您还没有选择任何景点哦', 'info',
			function() {
				$TRAVEL_BOX.closeup();
			},
			false);
			$("#TB_alertRemove").remove();
			return false;
		}
		$TRAVEL_BOX.loading('行程优化中，请稍候');
		$.items = null;
		var $items = $(this).find("ul");
		$.items = $items;
		var len = $items.length;
		if (len > 0) {
			$($items[0]).orderView(0, callbak);
		} else {
			$.unloading();
		}
	},
	$.fn.autofix = function(i, viewhtml) {
		var len = $.items.length;
		if (i >= len) {
			var d = $.getDate($(this).attr("lang"), 1);
			var html = "<div class='viewlist'>" + "<div class='topbar'><font>第<b>" + (i + 1) + "</b>天</font><span>" + d + "</span></div>" + "<div class='footer'><ul lang='" + d + "'></ul></div>" + "</div>";
			var $parent = $('.content').children("div");
			$parent.width($parent.width() + 306);
			$parent.append(html);
			$.items = $('.content ul');
		}
		$($.items[i]).prepend(viewhtml);
	},
	$.fn.orderView = function(idx, callbak) {
		var _tmplen = $.items.length;
		if (idx >= _tmplen) {
			$._travelFn();
			$('.content ul').sortable('destroy').sortable({
				connectWith: ".content ul",
				placeholder: 'sort_replace',
				revert: true,
				cursor: 'move',
				start: function() {
					$(".content .footer").css("position", "");
				},
				stop: function() {
					$(".content .footer").css("position", "relative");
				}
			}).disableSelection();
			$(".content li").unbind().toggleDel();
			setTimeout(function() {
				$.unloading();
				if (typeof callbak != "undefined") typeof callbak == 'function' ? eval(callbak()) : eval(callbak());
			},
			500);
			return false;
		}
		var $parent = $(this);
		var today = $parent.attr("lang");
		var $list = $parent.find("li");
		var _length = $list.length;
		if (_length > 0) {
			var $newlist = $list.clone();
			var oriList = new Array;
			var posList = new Array;
			var leftList = new Array;
			$list.each(function(i) {
				var pos = $(this).position();
				posList[i] = pos.top;
				var keys = $(this).find(".right input").val();
				leftList[keys] = pos.left;
				oriList[keys] = pos.top;
			});
			$newlist = $newlist.sorted({
				by: function(v) {
					return $(v).find(".starttime").attr("alt");
				}
			});
			var totaltime = 0;
			var nexttime = null;
			$newlist.each(function(i) {
				var $newitem = $(this);
				$($list[i]).remove();
				var runtime = parseFloat($newitem.find(".runtime").val());
				runtime = runtime > 0 ? runtime: 0.5;
				totaltime += runtime;
				if (totaltime > DAY_LONG) {
					$parent.autofix(idx + 1, $newitem);
				} else {
					var _index_no = $newitem.find(".right input").val();
					$newitem.css({
						position: "absolute",
						left: leftList[_index_no] + "px",
						top: oriList[_index_no] + "px"
					});
					if (nexttime !== null) {
						$newitem.find(".timer").html(nexttime);
						$newitem.find(".starttime").val(nexttime);
					} else {
						nexttime = $newitem.find(".starttime").attr("alt");
						$newitem.find(".timer").html(nexttime);
					}
					nexttime = $.getNextTimed(today + " " + nexttime + ":00", runtime);
					$parent.append($newitem);
					$newitem.animate({
						top: posList[i] + "px"
					},
					400,
					function() {
						$(this).css({
							position: "",
							width: "",
							left: "",
							top: ""
						});
					});
				}
				if (_length - 1 == i) {
					$($.items[idx + 1]).orderView(idx + 1, callbak);
				}
			});
		} else {
			$($.items[idx + 1]).orderView(idx + 1, callbak);
		}
	},
	$.fn.accept = function() {
		var $container = $(this);
		$(this).process(function() {
			$container.loading("行程保存中，请稍候");
			var title = $.trim($("#plan-title").val());
			var str = '';
			$container.find("ul").each(function() {
				var $items = $(this).find("li");
				if ($items.length > 0) {
					var d = $(this).attr("lang");
					var viewStr = '';
					$items.each(function() {
						viewStr += (viewStr ? "|": "") + $(this).find("h3 input").val() + "," + $(this).find(".starttime").val();
					});
					str += (str ? "||": "") + d + "|" + viewStr;
				}
			});
			var params = $.param($container.find(".sublist input"));
			var randstr = $("#randstr").val();
			$.ajax({
				url: SAVE_PLAN_URPL + (randstr ? randstr: 0),
				data: "title=" + title + "&datastr=" + str + (params ? "&" + params: ""),
				type: "POST",
				dataType: "json",
				success: function(json) {
					$.unloading();
					if (json.status == STATUS_SUCCESS) {
						tb_alert("恭喜，您的行程已保存成功，点击确定进行查看！", "success",
						function() {
							$container.closeup();
							document.location.href = BROWSE_PLAN_URL + json.id + '.html';
						},
						false);
						$("#TB_alertRemove").remove();
					} else if (json.status == STATUS_ERROR) {
						tb_alert("对不起，系统出错，无法进行保存！");
					} else if (json.status == STATUS_UNLOGIN) {
						tb_alert(UNLOGIN_MSG, "warn",
						function() {
							if (OPEN_NEW_WIN === false) {
								OPEN_NEW_WIN = true;
							}
							$TRAVEL_BOX.accept();
						});
						$("#open_new_win").trigger("click");
					}
				}
			});
		});
	},
	$.fn.loading = function(msg) {
		msg = msg ? msg: '数据处理中，请稍候';
		if ($(this).children(".loading").length > 0) {
			$(this).children(".loading").html(msg);
		} else {
			if ($("#cover").length <= 0) {
				$("#main").append("<div id='cover'></div>");
				$("#cover").width($(this).width());
			}
			if ($("#close-btn").length <= 0) {
				$("#main").append("<span onclick='$(\"#optimization\").closeup()' id='close-btn'>关闭</span>");
				$("#close-btn").css("left", $(this).offset().left);
			}
			$(this).append("<div class='loading'>" + msg + "</div>");
		}
	},
	$.fn.getview = function() {
		var url = $(this).attr("href") || $(this).attr("rel") || $(this).attr("alt") || null;
		if (url) {
			$.getJSON(url,
			function(data) {
				$.clearOverlay();
				if (!data) {
					$('#map-area').msgbox("获取不到任何相关信息！");
					return false;
				}
				var _len = data.length;
				for (var i = 0; i < _len; i++) {
					var obj = data[i];
					var x = $.mapType ? obj.hx: obj.x;
					var y = $.mapType ? obj.hy: obj.y;
					if (x && y) {
						var div = $.addLabel({
							xpoint: x,
							ypoint: y,
							height: 60,
							data: "<div><img src='" + obj.tbimg + "'></div>" + "<h3 title='" + obj.title + "'>" + obj.title + "</h3>" + "<div style='display:none' class='hcid'><a target='_blank' href='" + obj.churl + "' title='" + (obj.another ? obj.another: obj.chname) + "'><span class='ico-" + obj.ch + "'></span></a></div>" + "<div onclick='$(\"ul.current\").addView(\"" + obj.url + "\")' class='add'></div>"
						});
						$(div).hover(function() {
							var pos = $(this).position();
							$(this).height(80).css("top", pos.top - 20);
							$(this).find(".hcid").show();
						},
						function() {
							var pos = $(this).position();
							$(this).height(60).css("top", pos.top + 20);
							$(this).find(".hcid").hide();
						}).draggable({
							childs: ".add,.hcid,.dir",
							appendTo: "#travel-list",
							revert: false,
							helper: 'clone',
							styles: {
								height: "auto",
								backgroundColor: "#FFFFFF"
							},
							start: function() {
								$(this).trigger("mouseout");
							}
						});
					}
				}
			});
		}
	},
	$.fn.dp = function(accept) {
		$(this).droppable({
			accept: accept,
			activeClass: 'active-cls',
			drop: function(event, ui) {
				$ob = $(ui.draggable).find(".add").trigger("click");
			}
		});
	},
	$.fn.addView = function(url) {
		var $this = $(this);
		$.getJSON(url,
		function(data) {
			if (data) {
				var cls = VIEW_PREFIX + data.id;
				if ($("." + cls).length <= 0) {
					var html = "<li class='" + cls + "' lang='" + cls + "'>" + '<table class="item"><tr>' + '<td class="left"><a href="' + data.url + '" target="_blank"><img src="' + data.tbimg + '" /></a>' + "<input type='hidden' name='runtime[" + data.id + "]' class='runtime' value='" + data.runtime + "'>" + '<input type="hidden" class="starttime" alt="' + data.start_time + '" name="start_time[' + data.id + ']" value="' + data.start_time + '">' + '</td>' + '<td class="right">' + '<h3><a href="' + data.url + '" target="_blank">' + data.title + '</a><input type="hidden" name="views[]" value="' + data.id + '"></h3>' + '<p>' + data.intro + '</p>' + '</td></tr>';
					var _len = data.subview.length;
					if (_len > 0) {
						html += '<tr class="more"><td colspan="2">' + '<div class="open" onclick="$(this).toggleSublist()">相关表演项目</div>' + '<div class="sublist">';
						for (var i = 0; i < _len; i++) {
							html += '<p><span onclick="$(this).toggleSub(' + data.subview[i]['id'] + ')" class="checked"></span>' + data.subview[i]['title'] + '<input type="hidden" value="' + data.subview[i]['id'] + '" name="subviews[' + data.id + '][]"></p>';
						}
						html += '</div></td></tr>'
					}
					html += '</table></li>';
					$this.find(".sort_tip").before(html);
					$("." + cls).toggleDel("." + cls);
					$(".container").scrollTop(200000);
				} else {
					$('#map-area').msgbox("该点已经加入过啦，不用在重复添加了！");
				}
			}
		});
	},
	$.fn.sorted = function(customOptions) {
		var options = {
			reversed: false,
			by: function(a) {
				return a.text();
			}
		};
		$.extend(options, customOptions);
		$data = $(this);
		arr = $data.get();
		arr.sort(function(a, b) {
			var valA = options.by($(a));
			var valB = options.by($(b));
			if (options.reversed) {
				return (valA < valB) ? 1: (valA > valB) ? -1: 0;
			} else {
				return (valA < valB) ? -1: (valA > valB) ? 1: 0;
			}
		});
		return $(arr);
	},
	$.fn.toggleSub = function(value) {
		if ($(this).hasClass("checked")) {
			$(this).parent().find("input").val("");
			$(this).removeClass("checked");
		} else {
			$(this).parent().find("input").val(value);
			$(this).addClass("checked");
		}
	},
	$.fn.toggleSublist = function() {
		$(this).toggleClass("open").toggleClass("close");
		$(this).next(".sublist").slideToggle("slow");
	},
	$.fn.toggleDel = function(cls) {
		$(this).hover(function() {
			var $this = $(this);
			if ($this.find(".del").length <= 0) {
				$this.append("<span class='del'></span>");
				$this.find(".del").click(function() {
					$this.fadeOut("slow",
					function() {
						var id = $.int($(this).find(".right input").val());
						$.ajax({
							url: DEL_PLAN_URL,
							type: "POST",
							data: "id=" + id
						});
						$(this).remove();
						var lang = $(this).attr("lang");
						cls = cls ? cls: (lang ? '.' + lang: '');
						if (cls) $(cls).remove();
					});
				});
			}
		},
		function() {
			$(this).find(".del").remove();
		});
	},
	$.fn.sortBox = function(axis) {
		$(this).sortable({
			revert: true,
			axis: axis,
			cursor: 'move',
			items: "li:not(.sort_tip)",
			placeholder: 'sort_replace'
		}).disableSelection();
	}
})(jQuery, document);
jQuery.extend({
	CAN_ADD: true,
	items: null,
	addDay: function() {
		if (this.CAN_ADD) {
			this.CAN_ADD = false;
			var html = '<ul lang="" style="left:320px;position:absolute;"><li class="sort_tip"><div><span>拖动</span>左侧景点添加，或者直接<span>点击添加</span></div></li></ul>';
			var $current = $(".current");
			$current.after(html);
			$new = $current.next("ul");
			$current.css("position", "absolute").animate({
				left: "-305px"
			},
			"slow",
			function() {
				$("#prev").show().css("position", "");
				$(this).hide().removeClass("current");
			});
			$new.animate({
				left: "17px"
			},
			"slow",
			function() {
				$(this).sortBox("y");
				$.CAN_ADD = true;
				var n = $.int($("#now_number").html()) + 1;
				$("#now_number").html(n);
				var newday = $("#right_date").getDate(1);
				$("#right_date").html(newday);
				$(this).attr("lang", n + ":" + newday).css("position", "").addClass("current");
			});
		}
	},
	prevDay: function() {
		var n = $.int($("#now_number").html());
		if (this.CAN_ADD && n > 1) {
			$("#addspan").hide();
			$("#next").show();
			this.CAN_ADD = false;
			var $current = $(".current");
			$prev = $current.prev("ul");
			$current.css({
				position: 'absolute'
			}).animate({
				left: "320px"
			},
			"slow",
			function() {
				$(this).css({
					position: ''
				}).removeClass("current").hide();
			});
			$prev.css({
				position: 'absolute'
			}).show().animate({
				left: "17px"
			},
			"slow",
			function() {
				$.CAN_ADD = true;
				$(this).css({
					position: ''
				}).addClass("current");
				if (n == 2) {
					$("#prev").hide();
				}
				$("#now_number").html(n - 1);
				$("#right_date").html($("#right_date").getDate( - 1));
			});
		}
	},
	nextDay: function() {
		var n = $.int($("#now_number").html());
		var max = $(".container ul").length;
		if (this.CAN_ADD && n < max) {
			this.CAN_ADD = false;
			var $current = $(".current");
			$next = $current.next("ul");
			$current.css({
				position: 'absolute'
			}).animate({
				left: "-320px"
			},
			"slow",
			function() {
				$("#prev").show();
				$(this).css({
					position: ''
				}).removeClass("current").hide();
			});
			$next.css({
				position: 'absolute',
				left: "320px"
			}).show().animate({
				left: "17px"
			},
			"slow",
			function() {
				$.CAN_ADD = true;
				$(this).css({
					position: ''
				}).addClass("current");
				if (n + 1 == max) {
					$("#next").hide();
					$("#addspan").show();
				}
				$("#now_number").html(n + 1);
				$("#right_date").html($("#right_date").getDate(1));
			});
		}
	},
	unloading: function(cln) {
		$("#cover").remove();
		if (cln) $("#close-btn").remove();
		$TRAVEL_BOX.find(".loading").remove();
	},
	_travelFn: function() {
		$("#optimization .footer").height($("#optimization").height() - 112);
		$("#optimization .footer ul").height($("#optimization").height() - 122);
	},
	_init: function() {
		var height = $(window).height();
		var width = $(window).width();
		$(".leftarea").width(width - 320).height(height - 85);
		$("#map-area").height(height - 137);
		$("#main").height(height - 75);
		$("#travel-list").height(height - 187);
		$("#optimization .content").height(height - 135);
		$._travelFn();
	}
});
$(window).resize(function() {
	$._init();
});
$(function() {
	$TRAVEL_BOX = $("#optimization");
	$._init();
});