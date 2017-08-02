/**
 * 联营凑单滑层
 * @Author lw
 * @Date 2016-11-22
 */
!(function(){
    /**
     * 联营凑单滑层类
     * @Class
     */
    var JointVentureSlider = function(){

        /**
         * 联营凑单滑层的dom
         * @type jqDom
         */
        this.$el = $('[data-aslider="JointVenture"]');
        
        /**
         * 确定按钮
         * @type jqDom
         */
        this.$ok = this.$el.find('.sure_btn');

        //事件侦听
        this.$ok.on('click',$.proxy(this.onOk,this));
        this.$el.on('click','.close',$.proxy(this.onClose,this));
        this.$el.on('click','.unchecked',$.proxy(this.doSelect,this)); //勾选项事件

    };

    JointVentureSlider.prototype = {
        constructor:JointVentureSlider,
        
        //更改优惠方式
        doSelect: function(cart){
        	this.$el.find('.checked').addClass('hide');
        	$(cart.target).find(".checked").removeClass('hide');
        },
        /**
         * 当显示此滑层时，获取触发滑层的商品
         * @public
         * @param product 触发延保滑层的商品
         * @return null
         */
        show: function(cart){
        	
			var _this = this;
			this.cart = cart;
			//获取所有联营凑单数据
			var d = this.cart.$el.find('.see_all').data('del');
			var shippingId = d.shippingId ? d.shippingId : '';
			var shopPromList = d.shopPromList ? d.shopPromList : [];
			var shopPromSelectList = d.shopPromSelectList ? d.shopPromSelectList : [];
			var shopOrderPromList = d.shopOrderPromList ? d.shopOrderPromList : [];
			var shopPromUnappliedList = d.shopPromUnappliedList ? d.shopPromUnappliedList : [];
			var info = [];
			
			var i=0;
			[shopPromSelectList,shopPromUnappliedList].forEach(function(objTmp){
				
				objTmp.forEach(function(item){
					if(d.promotionEditLableCode == 2){ //修改优惠
						var tpl = '<div class="flexbox discount">'
									+'xxxcheck'
									+'xxxLabel'
									+'<p class="flex1">xxxDesc</p>'
									+'xxxcoudan'
							     +'</div>';
					}else{ //查看全部
						var tpl = '<div class="flexbox discount">'
									+'xxxcheck'
									+'xxxLabel'
									+'<p class="flex1">xxxDesc</p>'
									+'xxxcoudan'
								 +'</div>';
					}
					
					if(item.isShowCouDan == 'Y'){
						tpl = tpl.replace('xxxcoudan','<p class="together"><a href="'+ item.proUrl +'">'+ item.promFlag +'</a><i data-icon="&#x00A3" class="arrow"></i></p>');
					}else{
						tpl = tpl.replace('xxxcoudan','');
					}
					
					if(i == 0){
						if(item.selected == 'N'){
							var radioDataType =  0;
							tpl = tpl.replace('xxxcheck','<span class="unchecked" ><i class="checked hide" data-promid="'+ item['promId'] +'" data-shippingid="'+ shippingId +'" data-type="'+ radioDataType +'" ></i></span>');
						}else{
							var radioDataType =  1;
							tpl = tpl.replace('xxxcheck','<span class="unchecked" ><i class="checked" data-promid="'+ item['promId'] +'" data-shippingid="'+ shippingId +'" data-type="'+ radioDataType +'" ></i></span>');
						}
					}else{
						tpl = tpl.replace('xxxcheck','');
					}
					if(item.promLabel == '无优惠'){
						tpl = tpl.replace('xxxLabel','');
					}else{
						tpl = tpl.replace('xxxLabel','<span class="tag">'+ item.promLabel +'</span>');
					}
					
					info.push(tpl.replace('xxxDesc',item.promDesc));
				});
				++i;
			});
			console.log(d.promotionEditLable + '<i data-icon="&#x0042;" class="close"></i>');
			console.log(info.join(''));
			_this.$el.find('.title').html(d.promotionEditLable + '<i data-icon="&#x0042;" class="close"></i>');
			_this.$el.find('.info').html(info.join(''));
			
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
                _this.$ok.hide();
            },300);
        },
			
		/**
         * 确定时，将此时对应商品的联营凑单属性修改为选择属性
         * @private
         * @event click
         * @return null
         */
        onOk: function(cart){
        	var _this=this;
        	var self = this.$el.find(".checked").not(".hide");
        	var sendData = {promotionId: self.data('promid'), shippingId:self.data('shippingid'),ishwg:'N'};
        	var timestamp =Date.parse(new Date());
        	var posturl = 'cart_applyShopPromo.html?dotime='+timestamp;
        	
        	$("#tip_ceng,#full").show();
			$.post(posturl,sendData,function (data){
				if(data.state === '1'){		
					$("#load").html(data.html);
					_this.cart.cartLoadAjaxHtml();
					$("#tip_ceng,#full").hide();						
				}else if (data.state === '0') {
					$("#tip_ceng,#full").hide();		
					alert({'type':'toast','content':data.msg,'time':1000});
					$("#load").html(data.html);
					_this.cart.cartLoadAjaxHtml();
				}else if(data.state === '-1') {
					setTimeout(function(){
						$("#tip_ceng,#full").hide();		
						alert({'type':'toast','content':data.msg,'time':1000});
						window.location.href = wap_https_url+'/login.html';
					},1000);					
				}
			},'json');
        }
    };
    
    /**
     * 暴露类到全局域
     */
    window.JointVentureSlider = JointVentureSlider;
})();
