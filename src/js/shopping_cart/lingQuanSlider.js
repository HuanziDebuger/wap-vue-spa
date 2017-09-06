/**
 * 领券滑层的逻辑
 * @Author zhaoye-ds1
 * @Date 2015-09-28
 * @Last-Modified-Date: 2015-10-13 10:45
 * @Last-Modified-By: ry\gaofeng
 */
!(function(){
    var lingQuanSlider = function(){
        this.isSelected = false;
        /*领券滑层用到的dom*/
        this.$el = $('[data-aslider="arch"]');
        this.$ulist = this.$el.find('ul');
        this.$title = this.$el.find('.name');

        //事件绑定
        this.$el.on('click','.btn.get_ticket:not(.disabled)',$.proxy(this.onSelect,this));
        this.$el.on('click','.close',$.proxy(this.onClose,this));
    };

    lingQuanSlider.prototype = {
        constructor:lingQuanSlider,
        show: function(cart){
			var _this = this;
            this.cart = cart;
			var timestamp =Date.parse(new Date());
			var merchantId = this.cart.getShopId('data-shopid');
			var url = 'cart-'+merchantId+'-shoptickets.html?dotime='+timestamp;
			$.get(url,function (response){
				var data = JSON.parse(response);
				if(data.status == 1){
					var data_content = JSON.parse(data.data);
					_this.$title.html(data_content.merchantName+'<span>（限本店使用）</span>');
					setTimeout(_this.loadSuccess(data_content.shopTicketList),300);
				}else{
					console.log("获取失败:"+data.data);
				}
			});
        },
        /**
         * ajax请求领券信息完成的响应函数
         * @private
         * @param data JSON?EventTarget? 根据ajax返回值而定
         * @return null
         */
        loadSuccess: function(data){
            var _this = this;
            this.$ulist.append(this.template(data));
            this.$el.find('.btn').touch();
        },
        /**
         * 关闭滑层时，将列表隐藏
         * @private
         * @event click
         * @return null
         */
        onClose: function(){
            var _this = this;
            setTimeout(function(){
                _this.$ulist.empty();
            },300);
        },
        /**
         * 点击了一个领取按钮，将其置为已领取
         * @private
         * @event click
         * @return null
         */
        onSelect: function(e){
			var _this = this;
            //var loading = alert({type: 'toast',content:'请稍等...'});
			var timestamp =Date.parse(new Date());
			var posturl = 'cart_takeshopcoupons.html?dotime='+timestamp;
			var post_data = {shopId:_this.cart.getShopId('data-shopid'),activeId:$(e.target).data('activeid'),couponId:$(e.target).data('couponid')};
			$("#tip_ceng,#full").show();
			$.post(posturl, post_data, function (response) {
				 var data = JSON.parse(response);
				 if (data.status == 1) {			 
					setTimeout(function(){
						//loading.close();
						if(data.isAgain === 'N'){
							$(e.target).text("已领取");
							$(e.target).addClass("disabled");							
						}
						$("#tip_ceng,#full").hide();		
						alert({'type':'toast','content':data.msg,'time':1000});
					},1000);
				 }else{
					setTimeout(function(){
						//loading.close();
						$("#tip_ceng,#full").hide();		
						alert({'type':'toast','content':data.msg,'time':1000});
					},1000);
				}
			});
			
			
            //TOREMOVE 使用setimeout模拟ajax
            //闭包用的this
            
            /*var loading = alert({
                type: 'toast',
                content:'请稍等...'
            });
            setTimeout(function(){
                $(e.target).text("已领取");
                $(e.target).addClass("disabled");
                loading.close();
                alert({
                    type: 'toast',
                    content:'领取成功',//如果失败则content为领取失败
                    time: 1000
                });
            },1000);*/
        },
        /**
         * 列表视图模板，用来根据后台返回的值，渲染出领券列表
         * @private
         * @param data JSON 通过ajax得到的数据
         * @return HtmlText 字符串形式的html文本
         */
        template: function(data){
            var result = '';
            for(var i=0; i<data.length; i++){
                result +=   '<li>'
                result +=       '<div class="ticket_num">￥<span>'+data[i].denomination+'</span></div>'
                if(data[i].ticketState == 1)
                    result +=       '<button class="btn btn_default_strong disabled get_ticket">已领取</button>'
                else
                    result +=       '<button class="btn btn_default_strong get_ticket" data-couponId="'+data[i].code+'" data-activeId="'+data[i].activeId+'">领取</button>'
                result +=       '<p class="ticket_useway ellipsis_two">'+data[i].ticketName+'</p>'
                result +=       '<p class="ticket_date">'+data[i].effectiveDate+'</p>'
                result +=   '</li>';
            }
            return result;
        }
    };
    window.lingQuanSlider = lingQuanSlider;
})();
