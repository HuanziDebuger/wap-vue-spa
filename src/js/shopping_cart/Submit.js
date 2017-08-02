/**
 * 底部工具栏的逻辑
 * 包括发起购买，全选，显示价格的功能
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
    var Submit = function(){
        /**
         * 实例所关联的页面dom(整个底部导航dom)
         * @type jqDom
         */
        this.$el = $(".submit_shop");
		this.$el_hwg = $(".hwg_qjs");
		
        /**
         * “全选”按钮
         * @type jqDom(底部导航的全选按钮)
         */
        this.$selectAll = $("#select_all");
        /**
         * 是否全选了所有的购物车和商品
         * @type bool
         */
        this.isSelected = this.$selectAll.hasClass('check_out')?true:false;
        /**
         * “去结算”按钮(底部导航的去结算按钮)
         * @type jqDom
         */
        this.$submitBtn =  this.$el.find(".submit_btn");
		this.$hwg_qjs =  this.$el_hwg.find(".hwg_qjs_button");
        /**
         * 总价标签
         * @type jqDom(底部导航的总计金额)
         */
        this.$totalPrice = this.$el.find('.total_price strong');
        /**
         * 已节省标签(底部导航的已省金额)
         * @type jqDom
         */
        this.$savedPrice = this.$el.find('.have_save b');
        /**
         * 商品数量标签(底部导航的去结算旁边商品数量)
         * @type jqDom
         */
        this.$num = this.$el.find('.total_num');
        //绑定事件
        this.$selectAll.on('click',$.proxy(this.toggleAll,this)); //(底部导航的全选按钮绑定事件)
        this.$submitBtn.on('click',$.proxy(this.submit,this)); //(底部导航的去结算按钮绑定事件)
		this.$hwg_qjs.on('click',$.proxy(this.submit,this)); //(底部导航的去结算按钮绑定事件)
		this.clickbool = true;
    };
    Submit.prototype = {
        /**
         * 构造函数
         */
        constructor: Submit,
        /**
         * 数量有变化
         * @public num Number 数量
         * @param num
         */
        numChange: function(num){
			//alert('数量有变化');
            this.$num.text(num);
        },
        /**
         * 已节省有变化
         * @public
         * @param price Number 价格
         * @return null
         */
        savedPriceChange: function(price){
			//alert('已节省有变化');
            this.$savedPrice.text(price);
        },
        /**
         * 总价有变化
         * @public
         * @param price Number 价格
         * @return null
         */
        totalPriceChange: function(price){
			if(this.$savedPrice.html() > 0){
				price -= this.$savedPrice.html();
				if(price <= 0){
					this.savedPriceChange(0.00);
					price = 0;
					this.$submitBtn.addClass('none');
				}
			}
            price += '';
            if(price.match(/^-?\d+$/)){
                price += '.00';
            }else if(price.match(/^(-?\d+)(\.\d+)?$/)){
                //do nothing
            }
			
            this.$totalPrice.text(price);
        },
        /**
         * 将“全选”按钮设为选中
         * @public
         * @return null
         */
        select: function(){
            this.$selectAll.addClass('check_out').attr('data-type','1');
            this.isSelected = true;
        },		
        /**
         * 将“全选”按钮设为非选中
         * @public
         * @return null
         */
        unselect: function(){
            this.$selectAll.removeClass('check_out').attr('data-type','0');
            this.isSelected = false;
        },
        /**
         * 切换全选/全不选所有购物车和商品
         * @private
         * @event
         * @return null
         */
        toggleAll: function(){
			if(this.checkAllShops(this.isSelected)){
				if(!this.isSelected){
					this.select();
					window.content.selectAll();
				}else{
					this.unselect();
					window.content.unselectAll();
				}
			}	
        },
		/*购物车全选*/
		checkAllShops:function(isSelected){
			var isChesuccess = true;
			var is_have_hwg = false;
			var checkStatus = 1;  //全选
			if(isSelected){
				checkStatus = 0;  //店铺取消
				/*if($('.container_hwg span[class="check_in all check_out"]').length > 0){
					is_have_hwg = true;
				}*/
			}
			var timestamp =Date.parse(new Date());
			var posturl = 'cart_check.html?dotime='+timestamp;
			var post_data = {checkStatus:checkStatus,is_h_hwg:is_have_hwg};			
			$("#tip_ceng,#full").show();
			$.post(posturl,post_data,function (data){
				data = eval('(' + data + ')');
				if(data.state === '1'){
					$("#load").html(data.html);
					window.content.conLoadAjaxHtml();
					$("#tip_ceng,#full").hide();						
				}else if (data.state === '0'){
					isChesuccess = false;
					$("#tip_ceng,#full").hide();			
					alert({'type':'toast','content':data.msg,'time':1000});
					setTimeout(function(){
						window.location.reload();
					},1000);
				}
			});
				
			return isChesuccess;
		},
        /**
         * 提交
         * @private
         * @event
         * @return null
         */
        submit: function(e){
			
 			if (loginState == "N") {
				alert({'type':'toast','content':'对不起，您还没有登录或登录已超时，请登录。','time':1000});
				window.location.href = wap_https_url+'/login.html';
				return false;
			}
			var is_hwg_flag = $('#is_hwg_flag').val();
			var qjs_type = $('#qjs_type').val();
			var cur_button_type = $(e.target).data('type');

			if((is_hwg_flag == 'N' && qjs_type == 'pt') ||  cur_button_type == 'pt'){
				var timestamp =Date.parse(new Date());
				var posturl = 'cart_submit.html?dotime='+timestamp;
				$("#tip_ceng,#full").show();
				$.post(posturl,{},function (data){
					data = eval('(' + data + ')');
					if(data.state == 1){
						$("#tip_ceng,#full").hide();
						window.location = 'order.html';	
					}else if(data.state == -1) {
						setTimeout(function(){
							$("#tip_ceng,#full").hide();		
							alert({'type':'toast','content':data.msg,'time':1000});
							window.location.href = domain_arr.WAP_IP+"/login_out.html";
						},1000);					
					}else if(data.state == 0) {
						setTimeout(function(){
							$("#tip_ceng,#full").hide();			
							alert({'type':'toast','content':data.msg,'time':1000});
						},1000);
					}else if(data.state == 2) {
						setTimeout(function(){
							$("#tip_ceng,#full").hide();
							alert({'type':'alert',title: '提示','content':data.msg,'cancelText':'确认','cancel':function () {
								window.location.reload();
								return;
							}});
						},1000);
					}
				});				
			}else if((is_hwg_flag == 'Y' && qjs_type == 'hwg') || cur_button_type == 'hwg'){
				if(this.clickbool = true){
					this.hwgClickbutton();
				}
			}
        },
		//海外购提交
		hwgClickbutton: function(){
			this.clickbool = false;
			var timestamp =Date.parse(new Date());
			var posturl = '/index.php?ctl=overseas&act=moveToCheckout&dotime='+timestamp;
			$("#tip_ceng,#full").show();
			$.post(posturl,{},function (data){
				data = eval('(' + data + ')');
				if(data.isSuccess == 'Y'){
					$("#tip_ceng,#full").hide();		
					window.location.href = '/overseas_submit.html';
				}else if(data.isSessionExpired == 'Y'){
                    alert({
                        type: 'toast',
                        content: '对不起，您还没有登录或登录已超时，请登录。', 
                        time: 2000,
                        finish: function () {
                            window.location.href = domain_arr.WAP_IP+"/login_out.html";
                        }
                    });
                }else if (data.failCode == 'E00_OVERSEA_UNAUTHORIZE'){
					setTimeout(function(){
						$("#tip_ceng,#full").hide();	
						alert({'type':'toast','content':data.failReason,'time':1000});
						window.location.href = domain_arr['WAP_IP'] + '/authorize.html';
					},1000);	
				}else if (data.failCode == 'ulogin'){
					setTimeout(function(){
						$("#tip_ceng,#full").hide();	
						alert({'type':'toast','content':'对不起，您还没有登录或登录已超时，请登录。','time':1000});
						window.location.href = data.jump_url;
					},1000);	
				}else if (data.reload == true){
					setTimeout(function(){
						$("#tip_ceng,#full").hide();
						alert({'type':'alert',title: '提示','content':data.failReason,'cancelText':'确认','cancel':function () {
							window.location.reload();
							return;
						}});
					},1000);
				}else{
					$("#tip_ceng,#full").hide();	
					alert({'type':'toast','content':data.failReason,'time':1000});
				}
			});
		}
    };
    /**
     * 暴露Submit类
     */
    window.Submit = Submit;
})();
