/**
 * @author: hulei
 * @build : 2013-08-05
 * @NAME  : mapConfig
 */
_loadScript("http://api.map.baidu.com/api?v=1.5&ak=0D4c7c2e506dc4e8da41dbf51646a000",SCRIPT_PATH+"config.js");
_loadCss(CSS_PATH+"map.css");


(function($,window){
	$.bd = function(id) {
		return new BMap.Map(id);
	}
	$.fn.BD = function(options){
		var opt = $.extend({},{
			x:109.908529,
			y:19.369855,
			maxZoom:9,
			data:null
		},options,true);
		this.map = $.bd("map_area"); 
		var map = this.map;                      
		map.centerAndZoom(new BMap.Point(opt.x,opt.y), opt.maxZoom);    
		map.addControl(new BMap.NavigationControl());              
		map.enableScrollWheelZoom();
		map.clearOverlays();
		this.myOverlay(map,opt.data);
		/*var myCompOverlay = new ComplexCustomOverlay(new BMap.Point(116.407845,39.914101), "天安门东");  
    	var myCompOverlay2 = new ComplexCustomOverlay(new BMap.Point(116.406946,39.911403), "国家博物馆");  
  
    	map.addOverlay(myCompOverlay);  
    	map.addOverlay(myCompOverlay2);*/ 
    	/*$("#btn").click(function(){
    		map.clearOverlays();
    	})*/ 
	};   
	
	$.fn.myOverlay = function(map,data,div){
		
		function myOverlay(point,data,div) {
			this._point = point;
			this._data = data;
			this._div = div;
		}
		
		//继承地图基类
		myOverlay.prototype = new BMap.Overlay();
		
		//初始化
		myOverlay.prototype.initialize = function(map) {
			this._map = map;
			var div = this._div;
			var zindex = 0;
		    this._map.getPanes().markerPane.appendChild(div);  
		    
		    $(div).hover(function(ev){
		      	$(this).addClass("cur")
		      	.css("zIndex",10)
		      	.find(".handle").show();
		      	ev.stopPropagation();
		    },function(ev){
		      	$(this).removeClass("cur")
		      	.css("zIndex",1)
		      	.find(".handle").hide();
		      	ev.stopPropagation();
		    });
	      
	      	return div; 
		}
		
		//绘制
		myOverlay.prototype.draw = function(){  
	      var map = this._map;
	      var pixel = map.pointToOverlayPixel(this._point);
	      this._div.style.left = pixel.x-60+"px";
	      this._div.style.top  = pixel.y-142+"px";
	    }
	    
		for(var i=0,l=data.length; i<l; i++) {	
			var div = document.createElement("div");
			div.className="my_map_label";
			$(div).attr("view-id",data[i].id)
			div.innerHTML="<input type='hidden' name='info' value='"+data[i].info+"'><input type='hidden' name='start' value='"+data[i].start+"'><input type='hidden' name='run' value='"+data[i].run+"'><img src='"+data[i].pic+"' alt='"+data[i].name+"' title='"+data[i].name+"'/><div class='handle clearfix'><a href='"+data[i].url+"' title='"+data[i].name+"' class='see_view fl'></a><a href='javascript:;' class='view_add fr'></a></div>";
			map.addOverlay(new myOverlay(new BMap.Point(data[i].coord[0],data[i].coord[1]),data,div));
		}
	}
    
	 
})(jQuery,window);


