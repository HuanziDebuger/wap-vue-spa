/**
 * 脚本逻辑入口
 * @Author zhaoye-ds1
 * @Date 2015-09-28 09:43
 * @Last-Modified-Date: 2015-10-08 10:39
 * @Last-Modified-By: zhaoye-ds1
 */
!(function(){
    //初始化各个对象，开始控制相应的dom元素
    window.submit = new Submit();
    window.guessLike = new GuessLike();
    window.content = new Content();
    window.ybSlider = new YanBaoSlider();
	window.yhSlider = new YouHuiSlider();
    window.lingQuan = new lingQuanSlider();
    window.replace = new replaceSlider();
    window.shopp = new shopping();
    window.serviceAslider = new serviceSlider();
    window.cdSlider = new JointVentureSlider(); //联营凑单初始化对象
    
 	/*$(document).ajaxStart(function () {
	    $("#tip_ceng,#full").show();
	}).ajaxStop(function () {
	    $("#tip_ceng,#full").hide();
	});	*/ 

    var windowW = $(window).width(), //屏幕宽 
    priceLeft = $('.price:first').offset().left, //价格框至屏幕左侧的距离
    numLeft = $('.g_num:first').offset().left, //+-控件至屏幕左侧的距离
    priceW = numLeft - priceLeft; //用+-输入框至屏幕左侧的距离 - 价格框至屏幕左侧的距离 = 价格实际能放的宽度

    //遍历价格，判断如果当前价格所占的宽度超出了价格实际能占的宽度，则把其字体变小
    $('.price em').each(function(){
        var self = $(this),
            width = self.width();
        if(width > priceW){
            self.parent().addClass('fs26');
        }
    })

    $(window).scroll(function () {
        if ($(".notice_box ").length) {
            var scroll_top = document.documentElement.scrollTop || document.body.scrollTop;
            var notice_box_obj  = $(".notice_box ")[0];
            var _height = $(".toolbar ")[0].offsetHeight,
                _stickyHeight = notice_box_obj.offsetHeight;
            if (scroll_top >= _height) {
                // $(".notice_box").addClass('fixd');
                // $(".container").css('margin-top', _stickyHeight);
            } else {
                $(".notice_box").removeClass('fixd');
                $(".container").css('margin-top', 0);
            }
        }
    });
})();
