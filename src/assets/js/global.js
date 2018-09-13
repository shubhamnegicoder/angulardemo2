$(document).ready(function(){
    $(".closenav").click(function(){
        $(".top_navigation").toggle();
    });
	
	
});


$(document).ready(function(){
    $(".filter_trigger").click(function(){
        $(".filter_block").slideToggle();
    });
});



$(document).ready(function(){
    $(".collapse-leftmenu1").click(function(){
        $("#leftmenu").slideToggle();
		$("#content").toggleClass("hideNav");
		$(".branding").toggleClass("hideHeader");
    });
});

