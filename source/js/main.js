$(document).ready(function() {
	$(window).scroll(function(){  //只要窗口滚动,就触发下面代码 
        var scrollt = document.documentElement.scrollTop + document.body.scrollTop; //获取滚动后的高度 
        if(scrollt>200){  //判断滚动后高度超过200px
            $("#gotop").fadeIn(400); //淡出
			if($(window).width() >= 1200){
				$(".navbar").stop().fadeTo(400, 0.2);
			}
        }else{
            $("#gotop").fadeOut(400); //如果返回或者没有超过,就淡入.必须加上stop()停止之前动画,否则会出现闪动
            if($(window).width() >= 1200){
				$(".navbar").stop().fadeTo(400, 1);
            }
        }
    });
    $("#gotop").click(function(){ //当点击标签的时候,使用animate在200毫秒的时间内,滚到顶部        
		$("html,body").animate({scrollTop:"0px"},200);
    });
	$(".navbar").mouseenter(function(){
		$(".navbar").fadeTo(100, 1);
	});
    $(".navbar").mouseleave(function(){
		var scrollt = document.documentElement.scrollTop + document.body.scrollTop;
		if (scrollt>200) {
			$(".navbar").fadeTo(100, 0.2);
		}
	});

	replaceMeta();

	$(window).resize(function(){
		replaceMeta();
	});
});

replaceMeta = function(){
	if ($(window).width() < 980) {
		if ($("#side_meta #post_meta").length>0) {
			$("#post_meta").appendTo("#top_meta");
		}
		if ($("#sidebar #site_search").length>0) {
			$("#site_search").appendTo("#top_search");
			$("#site_search #st-search-input").css("width", "95%");
		}
	} else {
		if ($("#top_meta #post_meta").length>0) {
			$("#post_meta").appendTo("#side_meta");
		}
		if ($("#top_search #site_search").length>0) {
			$("#site_search").prependTo("#sidebar");
			$("#site_search #st-search-input").css("width", "85%");
		}
	}
}
