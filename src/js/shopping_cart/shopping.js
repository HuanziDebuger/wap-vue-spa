/**
 * 头部工具栏的逻辑
 * @Author zhaoye-ds1
 * @Date 2015-09-28
 * @Last-Modified-Date: 2015-10-08 10:40
 * @Last-Modified-By: zhaoye-ds1
 */
!(function(){
    /**
     * 底部工具栏类
     * 包括发起购买，全选，显示价格的功能
     * @Class
     */
    var shopping = function(){
        /**
         * 实例所关联的页面dom(整个底部导航dom)
         * @type jqDom
         */
        // this.$el = $("#close_tags");
        /**
         * 关闭降价通知
         * @type 
         */
        this.$closeTags = $("#close_tags");

        /**
         * 降价通知
         * @type 
         */
        this.$noticeBox = $(".notice_box");
        //降价通知的值
        this.$noticeVal = $("#notice_val").val().split(",");
		
        //绑定事件
        this.$noticeBox.on('click',$.proxy(this.noticeBoxSer,this)); //(降价通知绑定事件)
        this.$closeTags.on('click',$.proxy(this.closeTagsSer,this)); //(关闭降价通知绑定事件)
		
    };
    shopping.prototype = {
        /**
         * 构造函数
         */
        constructor: shopping,
        /**
         * 将本商品设为选中
         * @public
         * @return null
         */
        noticeBoxSer: function(){
            var _this = this;
            var noticeBox = _this.$noticeBox;
            if (_this.$noticeVal[0]) {
                noticeBox.find('.text').html('继续点击，查看下一个降价商品~~')
                noticeBox.addClass('fixd');
                var t = $('#'+_this.$noticeVal[0]+'_num').offset().top-50;
                $(window).scrollTop(t);
                _this.$noticeVal.shift();
                if (_this.$noticeVal == '') {
                    window.setTimeout(function () {noticeBox.removeClass('fixd');$(window).scrollTop(t+50);noticeBox.find('.text').html(noticeHtml);_this.$noticeVal = $("#notice_val").val().split(",");}, 1500);
                    
                }
            }
        },
        /**
         * 将本商品设为选中
         * @public
         * @return null
         */
        closeTagsSer: function(){
            var url = 'close_tags.html';
            $.post(url, '', function (response) {
                 var data = JSON.parse(response);
                 if (data.isSuccess == "Y") {
                     this.$noticeBox.hide();
                 }else{
                     if(data.failReason){
                         console.log(data.failReason);
                     }else{
                         console.log("操作失败");
                     }
                }
            });
        },
        
    };
    /**
     * 暴露shopping类
     */
    window.shopping = shopping;
    window.noticeHtml = $(".notice_box").find('.text').html();
})();
