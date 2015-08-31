/**
 * @author: hulei
 * @build: 2013-08-06
 * @NAME : trip
 */
_loadScript(SCRIPT_PATH+"mapConfig.js",SCRIPT_PATH+"viewItem.js");
_loadCss(CSS_PATH+"ui.css");

(function($,window){
    $.getData = function(url){
    	var url = url;
		$.ajax({
			url: url,
			type: "GET",
			dataType: "JSON",
			async:false,
			beforeSend: function() {
				$.msg("努力加载中...")
			}
		}).success(function(json){
			var data = eval(json);
			$.msg("努力加载中...",null,true)
			$("#map_area").BD({data:data});
			$(".my_map_label").viewItem();
		}).error(function(e){
			$.msg("加载出错，请稍后再试！")
		})
    }
    
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
		return {
			full:newday.getFullYear() + "-" + (m < 10 ? "0" + m: m) + "-" + (d < 10 ? "0" + d: d),
			d:d < 10 ? "0" + d: d
		}
		
	};
	
	$.getNextTimed = function(timed, n) {
		timed = timed.split(" ");
		
		var tmp1 = timed[0].split("-");
		var tmp2 = timed[1].split(":");
		
		var day = new Date(tmp1[0], tmp1[1] - 1, tmp1[2], tmp2[0], tmp2[1], tmp2[2]);
		var newday = new Date();
		newday.setTime(day.getTime() + n * 1000 * 60 * 60);
		var h = newday.getHours();
		var m = newday.getMinutes();
		return (h < 10 ? '0' + h: h) + ":" + (m < 10 ? '0' + m: m);
	};
	
	$.getLen = function(el) {
    	return $(el).length;
    }
	
	$.isLast = function(el) {
		return $(el).index(el) == $(el).length-1;	
	}
	
	$.setW = function(e) {
    	var _viewLen = $.getLen(".add_view");
    	$(e).children().width(sOpt.width*_viewLen);
    }
    
    $.initTime = function(t1,t2,i) {
    	$(".view_move").eq(i).setsTime(t1);
    	$(".date_info").text(t1);
    	$("#calendar").text(t2);
    }
    
    $.curView = function(index) {
    	$(".view_move .add_view").removeClass("cur_view");
    	var nowView = $(".view_move").slice(index,index+1);
    	nowView.find(".add_view").addClass("cur_view");
    	$(".view_silder").stop().animate({
    		left:-370*index
    	},500)
    }
    
    var i=0;
    
    $.addTime = function(e) {
    	$(sOpt.prev).show();
		var tmp = '<div class="view_move">\
    						<div class="add_view"></div>\
    						<div class="add_des">\
    							<span>拖动</span>左侧景点添加，或者<span>直接点击添加</span>\
    						</div>\
    					</div>'
    	$(e).append(tmp);
    	var time = $("#date_info").text();
    	$.initTime($.getDate(time,1).full,$.getDate(time,1).d,i+1);
    	$.setW(".view_bd");
    	$.curView(i+1);
    	i++
    	$("#day_cn").text(i+1);
    	$("#day_now").text(i+1);	
	}
	
	$.prev = function() {
		$(sOpt.next).show();
		$(sOpt.addTime).hide();
		if(i>0) {
			i--;
			$.curView(i);
			var time = $("#date_info").text();
			$.initTime($.getDate(time,-1).full,$.getDate(time,-1).d,i);
			$("#day_cn").text(i+1);
    		$("#day_now").text(i+1);
    		if(i==0) {
				$(sOpt.prev).hide();
			}
		}
	}
	
	$.next = function() {
		$(sOpt.prev).show();
		if(i<$(".view_move").length-1) {
			i++;
			$.curView(i);
			var time = $("#date_info").text();
			$.initTime($.getDate(time,1).full,$.getDate(time,1).d,i);
			$("#day_cn").text(i+1);
    		$("#day_now").text(i+1);
    		if(i==$(".view_move").length-1) {
    			$(sOpt.next).hide();
				$(sOpt.addTime).show();
    		}
		}
	}
	
	
	$.fn.sortView = function(options) {
		var vopts = {
			reversed: false,
			by: function(a) {
				return a.text();
			}
		};
		$.extend(vopts, options);
		$data = $(this);
		arr = $data.get();
		arr.sort(function(a, b) {
			var valA = vopts.by($(a));
			var valB = vopts.by($(b));
			if (options.reversed) {
				return (valA < valB) ? 1: (valA > valB) ? -1: 0;
			} else {
				return (valA < valB) ? -1: (valA > valB) ? 1: 0;
			}
		});
		
		return $(arr);
	}
	$.yh = function() {
    	var viewList = $(".view_move");
    	var html = "";
    	viewList.each(function(i){
    		var item = $(this).find(".view_item");
    		var index = $(this).index();
    		var t = $(this).attr("date");
			var $item=item.sortView({
    			by:function(v) {
    				var str = $(v).find("input[name=start]").val();
    				return +str.replace(":","");
    			}
			});
			
			html= '<div class="view_box fl"><div class="position"></div>\
	<div class="vhd clearfix">\
		<span class="fl day_now">'+(index+1)+'</span>\
		<div class="fl">\
			<p class="now">\
				第<span class="day_cn">'+(index+1)+'</span>天\
			</p>\
			<p class="date_info">'+t+'</p>\
		</div>\
		<div class="fl">\
			<span class="calendar">'+t.split("-")[2]+'</span>\
		</div>\
	</div>\
	<div class="vbd"></div></div>';
			$(".view_w_scroll").append(html);
			$(".vbd").eq(i).html($item.clone(true));
			$(".vbd").eq(i).find(".view_item").addClass("view_item_m");
			
			$(".view_item_m").each(function(){
				var v = $(this);
				if(v.index()==0) {
					//rt = $.getNextTimed(today+" "+t+":00",r);
					rt = v.find("input[name=start]").val()
				} else {
					var r = +v.prev().find("input[name=run]").val();
					var t = v.prev().find("input[name=start]").val();
					var today =v.parents(".view_box").find(".date_info").text();
					rt = $.getNextTimed(today+" "+t+":00",r);
				}
				v.append("<span class='runtime'>"+rt+"</span>");
			})
			
			$(".view_w_scroll").css("width",$(".view_box").length*401)
			size();
    	});
    	$(".view_box").each(function(i){
				var _this = $(".view_box").eq(i);
				if(_this.find(".view_item_m").size()<=0) {
					_this.next().find(".day_now").text(_this.next().find(".day_now").text()-1);
					_this.next().find(".day_cn").text(_this.next().find(".day_cn").text()-1);
					_this.remove();
				}
		}) 
    }
	
	$.fn.timeSilder = function(options) {
		sOpt = $.extend({}, {
			prev:".prev",
			next:".next",
			addTime:".add_date",
			width:370
		}, options);
		var bAdd = true;
		
		$(this).addClass("silder");
		$.setW(this);
		$.initTime($.getDate(0,0).full,$.getDate(0,0).d,0);
		
	}
    
    $.fn.setsTime = function(t) {
    	$(this).attr("date",t)
    }
    
    
    
    
    
})(jQuery,window);