/**
 * @author: hulei
 * @build : 2013-08-05
 * @NAME  : viewItem
 */
_loadScript(SCRIPT_PATH+"jquery-ui-1.10.2.min.js");
_loadCss(CSS_PATH+"ui.css");
(function($, window){
	$.fn.viewItem = function(options){
		opt = $.extend({}, {
			to:".view_bd",
			tmp:'<div class="view_item" view-id="{{id}}">\
					   <a href="javascript:;" class="off"></a>\
					   <dl class="clearfix">\
							<dt class="fl"><img src="{{pic}}" alt="{{name}}" /></dt>\
							<dd class="fr">\
								<h2>{{name}}</h2>\
								<p>{{info}}</p>\
							</dd>\
						</dl>\
						<input type="hidden" name="run" value="{{run}}"/>\
						<input type="hidden" name="start" value="{{start}}"/>\
				</div>'
		}, options),_this = this,t = 140;
		$(this).bind("mousedown", function(event){event.stopPropagation();});
		$(opt.to).scrollTop(t);
		$(this).draggable({
			appendTo:"body",
			helper:function(){
				var html = "<div class='drag_clone'><img src='"+$(this).find("img").attr("src")+"'/></div>";
				return html;
			}
		});
		
		$(opt.to).droppable({
			hoverClass:"drag_hover",
			drop: function(event, ui) {
				t+= 140;
				$(ui.draggable).removeClass("cur")
        		_this.addView(t,ui.draggable);

     		 }
		})
		
		
		
		$(".view_add",this).on("click", function(){
			t+= 140;
			var el = $(this).parents(".my_map_label");
			_this.addView(t,el);
		})
	}
	
	$.fn.replace = function(data) {
		var tmp = opt.tmp;
		var data = $.extend({}, {
			id:1,
			pic:"images/p1.jpg",
			name:"风景1",
			info:"风景风景风景风景",
			start:"7:00",
			run:30
		}, data);
		return tmp.replace(/\{\{pic\}\}/g, data.pic)
		   .replace(/\{\{id\}\}/g, data.id)	
		   .replace(/\{\{name\}\}/g, data.name)
		   .replace(/\{\{info\}\}/g, data.info)
		   .replace(/\{\{start\}\}/g, data.start)
		   .replace(/\{\{run\}\}/g, data.run)
	}
	
	$.fn.addView = function(t,el) {
		var img = $(el).find("img"),
			bAdd = true,
			id = $(el).attr("view-id"),
			pic = img.attr("src"),
			name = img.attr("alt"),
			info = $(el).find("input[name=info]").val(),
			start = $(el).find("input[name=start]").val(),
			run = $(el).find("input[name=run]").val(),
    		b_h = $(".btn").outerHeight(true),
			html = this.replace({
				id:id,
				pic:pic,
				name:name,
				info:info,
				start:start,
				run:run
			});
		$(".cur_view .view_item").each(function(i){
			var _id = $(this).attr("view-id");
			var index = $(this).parents(".view_move").index();
			if(_id == id) {
				$.msg("已经在第"+(index+1)+"天行程中添加过了，请勿重复添加！");
				bAdd = false;	
				return false;
			}
		});
		if(bAdd) {
        	$(".cur_view").append(html);
        	
        	$(".view_item").hover(function(){
        		$(this).find("a").css("display","block");
        	},function(){
        		$(this).find("a").hide();
        	})
        	$(".off").click(function(){
        		$(this).parents(".view_item").fadeOut(function(){
        			$(this).remove();
        		})
        	})
        	var h = $(window).height()-140-27,
    		p_h = $(".position").outerHeight(true)+$(".view_hd").outerHeight(true),
    		b_h = $(".btn").outerHeight(true),
    		parent = $(".cur_view").parents(".view_move");
        	if(parent.height()>=h-p_h-b_h) {
        		parent.addClass("view_scroll").css({
        			height:h-p_h-b_h
        		})
        	}
        	$(parent).scrollTop(t);
       	}
       	
       	
        
	}
	
})(jQuery, window)
