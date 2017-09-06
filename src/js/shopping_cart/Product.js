/**
 * 购买的一个产品
 * @Author zhaoye-ds1
 * @Date 2015-09-28
 * @Last-Modified-Date: 2015-10-08 10:43
 * @Last-Modified-By: zhaoye-ds1
 */
!(function(){
    /**
     * 一个商品的类
     * @Class
     * @param el
     * @param cart
     */
    var Product = function(el,cart){
		//需要用到的dom
        /**
         * 绑定的页面中的实体dom
         * @type jqDom
         */
        this.$el = $(el);
        /**
         * 购买本商品的数量
         * 默认为1
         * @public
         * @type Number
         */
        this.buyNum = 1;
        this.changeAll = 1;
        
        /**
         * 本商品所在的购物车
         * dom上的关系是父对象
         * @public
         * @type @Cart
         */
        this.cart = cart;
        /**
		 * 本商品是否被选中的标识
		 * @public
		 * @type bool
		 */
		this.isChecked = this.$el.find('.check_imp').hasClass('check_ckd');
		/**
		 * 跟本商品搭配购买的商品列表
		 * @public
		 * @type Array
		 */
		this.matches = [];
		/**
		 * 商品类型
		 * 商品类型可以为normal普通商品/match被搭配商品/special已经失效的商品
		 * @type String
		 */
		this.type = 'normal';
		
		/**
		 * “修改延保”按钮
		 * @type jqDom
		 */
		this.$ybBtn = this.$el.find('.buy_yb'); 	  //购买延保按钮
		this.$ybText = this.$el.find('.yb_text em');  //单品延保促销说明：[延保]延长保修期1年 ¥98.0×1
		this.$tips   = this.$el.find('.service_tips');
		this.$color  = this.$el.find('.color_info');

        /**
		 * “增值服务”按钮
		 * @type jqDom
		 */
		this.$serviceBtn = this.$el.find('.zz_service_btn'); 	  //购买增值服务按钮
		//this.$ybText = this.$el.find('.yb_text em');  //单品延保促销说明：[延保]延长保修期1年 ¥98.0×1
		//this.$tips   = this.$el.find('.service_tips');

		/**
		 * “优惠”按钮
		 * @type jqDom
		 */
		this.$yhBtn = this.$el.find('.buy_yh'); 	  //购买延保按钮
		this.$yhText = this.$el.find('.yh_text em');  //单品延保促销说明：[延保]延长保修期1年 ¥98.0×1


		/**
		 * “选中”按钮
		 * @type jqDom
		 */
		if(this.$el.find('.check_imp').length>0){
            this.$checkBtn = this.$el.find('.check_imp');
		}else{
            this.$checkBtn = this.$el.find('.option_circle:not(.disabled )');
		}
		/**
		 * 用于“编辑”的区域
		 * @type jqDom
		 */
		this.$editArea = this.$el.find('.edit_area');
		/**
		 * “收藏”按钮
		 * @type jqDom
		 */
		this.$collectBtn = this.$el.find('.collect');
		this.collect_click = true;
		/**
		 * “删除”按钮
		 * @type jqDom
		 */
		this.$deleteBtn = this.$el.find('.delete');
		this.$deleteBtnda = this.$el.find('.delete_da');
		this.remove_click = true
		/**
		 * “价格标签”
		 * @type jqDom
		 */
		this.$price = this.$el.find('.price span');
		/**
		 * @type jqDom
		 * “购买数量”选择框
		 */
		this.numBtn = this.$el.find('.num_s');
        /**
		 * @type jqDom
		 * 修改数量
		 */
		this.changeBtn = this.$el.find('.count');
        /**
		 * @type jqDom
		 * 数量加
		 */
		this.addBtn = this.$el.find('.add_btn');
        /**
		 * @type jqDom
		 * 数量减
		 */
		this.minusBtn = this.$el.find('.minus_btn');
		/**
		 * “购买数量”标签
		 * @type jqDom
		 */
		this.numCon = this.$el.find('.num_con em');

		//根据关联的dom类设置相应商品类型(暂不可送类型)
		if(this.$el.hasClass('special')){
			this.type = 'special';
		}
		if(this.$el.hasClass('match_buy')){ //(搭配购类型)
			this.type = 'match';
			//如果是被搭配类型的商品，通知其所属购物车
			//将本商品绑定到对应商品上
			this.cart.bindMatch(this);
		}
		//判断，如果没有checkbox，就设为checked
		//lw 2016/12/09 没有元素选中状态应该为false
		if(this.$checkBtn.length == 0){
            if(this.$el.parents('.shop').find('.shop_list').length==1 && this.$el.find("span").eq(0).hasClass("disabled")){
                this.isChecked = false;
            }else{
                this.isChecked = true;
            }
			
		}
		//绑定dom事件
		this.$yhBtn.on('click',$.proxy(this.showYh,this));  //优惠按钮点击
		this.$ybBtn.on('click',$.proxy(this.showYb,this));  //延保按钮点击
		this.$checkBtn.on('click',$.proxy(this.toggle,this));  //单品选项框
		this.$collectBtn.on('click',$.proxy(this.collect,this)); //收藏按钮
		this.$deleteBtn.on('click', $.proxy(this.remove,this)); //删除按钮
		this.$deleteBtnda.on('click', $.proxy(this.removeda,this)); //删除按钮
		this.numBtn.on('change', $.proxy(this.selectNum,this)); //select选框事件
        this.addBtn.on('click', $.proxy(this.addNum,this)); //数量加
        this.minusBtn.on('click', $.proxy(this.minusNum,this)); //数量减
        this.changeBtn.on('blur', $.proxy(this.changeNum,this)); //修改减
        this.changeBtn.on('keyup',$.proxy(this.keyupNum,this));  //增值服务按钮点击
        this.$serviceBtn.on('click',$.proxy(this.showService,this));  //增值服务按钮点击
    };
    Product.prototype = {
        /**
         * 构造函数
         */
        constructor: Product,
		init: function(){
			//价格字号初始化
            var $price=this.$el.find('.price em');
            if($price.html()!==null){
                var width=$price.get(0).offsetWidth;
                var p_width=$price.parents('.price').width();
                //console.log(p_width);
                if(width>p_width){
                    $price.css('font-size','1.2rem');
                }
            }
		},
        /**
         * 将本商品设为选中
         * @public
         * @return null
         */
        check: function(){
            this.isChecked = true;
            this.$checkBtn.addClass('check_ckd');
            this.cart.checkOne();
        },
        /**
         * 开始编辑
         * 将本商品切换成编辑状态
         * @public
         * @return null
         */
        edit: function(){
            this.$editArea.show();
            /*this.$ybBtn.hide();
			this.$yhBtn.hide();*/
			this.$tips.hide();
            this.changeAll = 0;
			// this.$color.hide(); //商品描述去掉隐藏
        },
        /**
         * 结束编辑
         * 将本商品切换成默认状态
         * @public
         * @return null
         */
        editDone: function(){
            this.$editArea.hide();
            //this.$ybBtn.show();
			//this.$yhBtn.show();
			this.$tips.show();
            this.changeAll = 1;
			// this.$color.show();
        },
        /**
         * 获取价格
         * @public
         * @return Number 商品价格
         */
        getPrice: function(){
            var price = 0;
            if(this.type=='normal' && this.isChecked){
                price += Number(this.$price.text());
                this.matches.forEach(function(match){
                    price += Number(match.$price.text());
                });
            }
			this.buyNum = this.numCon.text();
            price *= this.buyNum;
            return price;
        },
        /**
         * 设置搭配购买数量
         * @public
         * @param num Number 购买数量
         * @return null
         */
        setNum: function(num){
            this.buyNum = num;
            this.$el.find('.sent_num').text('x'+num);
        },
        /**
         * 将本商品设为不选中
         * @public
         * @return null
         */
        uncheck: function(){
            if(this.$checkBtn.length == 0){
                this.isChecked = true;
                return;
            }
            this.isChecked = false;
            this.$checkBtn.removeClass('check_ckd');
            this.cart.uncheckOne();
        },
		
		/**
         * 删除搭配购
         * 删除关联的dom，删除product实例
         * @private
         * @event
         * @return null
         */
        removeda: function(e){
			//console.log($(e.target).data('commerceid-id'));return false;
            var _this = this;
			var is_hwg = _this.getLableId('ishwg');
				 is_hwg = (typeof is_hwg != 'undefined' && is_hwg != null && is_hwg != '')?'N':'N';
			//删除购物车，添加统计代码
			var shop_name = (this.cart.$store_name.text() == '国美在线')?'国美在线自营':this.cart.$store_name.text();
			var shop_id = (shop_name == '国美在线自营')?'':this.cart.getShopId('data-shippingid');
			var s = s_gi(s_account);
			s.linkTrackVars = 'products,events';
			s.linkTrackEvents = 'scRemove ';
			s.products = ";" + $(e.target).data('product-id') + ";;;event55=" + this.numCon.text() + "|event56=" + this.$price.text() + ";eVar21=" +shop_name+ "|eVar22=" + shop_id + "";
			s.events = "scRemove,event55,event56";
			s.tl(this, 'o', 'product_remove');
			var s_code = s.t();
			if (s_code)
				document.write(s_code);
				if(this.remove_click == true){
					this.remove_click = false;

					//var loading = alert({'type':'toast',content: '请稍等...'});
					var timestamp =Date.parse(new Date());
					var posturl = 'cart_delpro.html?dotime='+timestamp;
					var post_data = {commerceItemID:$(e.target).data('commerceid-id'), need_keep_shippingId: _this.cart.getShopId('data-shippingid'),ishwg:is_hwg};

					$("#tip_ceng,#full").show();
					$.post(posturl, post_data, function (response) {
						 var data = JSON.parse(response);
						 if (data.state === '1') {
							setTimeout(function(){
								//loading.close();
								if(data.html != 'null'){
									$("#load").html(data.html);
									_this.cart.cartLoadAjaxHtml();		
									$("#tip_ceng,#full").hide();			
									alert({'type':'toast','content':data.msg,'time':1000});
								}else{
									$("#tip_ceng,#full").hide();			
									alert({'type':'toast','content':data.msg,'time':1000});
									window.location.href = 'shopping_cart.html';
								}
							},1000);
						 }else{
							 if(data.msg){
								setTimeout(function(){
									$("#load").html(data.html);
									_this.cart.cartLoadAjaxHtml();
									$("#tip_ceng,#full").hide();			
									//loading.close();
									alert({'type':'toast','content':data.msg,'time':1000});
								},1000);
							 }
						}
					});
				}
        },
		
        /**
         * 删除自己
         * 删除关联的dom，删除product实例
         * @private
         * @event
         * @return null
         */
        remove: function(){
            var _this = this;
            alert({
                type : 'alert',
                title : '提示',
                content : '确认要删除这款商品吗？',
                cancel: function(){},//空函数
                cancelText: '取消',
                confirm: function(){
                    var is_hwg = _this.getLableId('ishwg');
                         is_hwg = (typeof is_hwg != 'undefined' && is_hwg != null && is_hwg != '')?'N':'N';
                    //删除购物车，添加统计代码
                    var shop_name = (_this.cart.$store_name.text() == '国美在线')?'国美在线自营':_this.cart.$store_name.text();
                    var shop_id = (shop_name == '国美在线自营')?'':_this.cart.getShopId('data-shippingid');
                    var s = s_gi(s_account);
                    s.linkTrackVars = 'products,events';
                    s.linkTrackEvents = 'scRemove ';
                    s.products = ";" + _this.getLableId('data-product-id') + ";;;event55=" + _this.numCon.text() + "|event56=" + _this.$price.text() + ";eVar21=" +shop_name+ "|eVar22=" + shop_id + "";
                    s.events = "scRemove,event55,event56";
                    s.tl(_this, 'o', 'product_remove');
                    var s_code = s.t();
                    if (s_code) document.write(s_code);
                    if(_this.remove_click == true){
                        _this.remove_click = false;
                        //var loading = alert({'type':'toast',content: '请稍等...'});
                        var timestamp =Date.parse(new Date());
                        var posturl = 'cart_delpro.html?dotime='+timestamp;
                        var post_data = {commerceItemID:_this.getLableId('data-commerceitemid-id'), need_keep_shippingId: _this.cart.getShopId('data-shippingid'),ishwg:is_hwg,type:_this.getLableId('type')};
                        $("#tip_ceng,#full").show();
                        $.post(posturl, post_data, function (response) {
                             var data = JSON.parse(response);
                             if (data.state === '1') {
                                setTimeout(function(){
                                    //loading.close();
                                    if(data.html != 'null'){
                                        $("#load").html(data.html);
                                        _this.cart.cartLoadAjaxHtml();		
                                        $("#tip_ceng,#full").hide();			
                                        alert({'type':'toast','content':data.msg,'time':1000});
                                    }else{
                                        $("#tip_ceng,#full").hide();			
                                        alert({'type':'toast','content':data.msg,'time':1000});
                                        window.location.href = 'shopping_cart.html';
                                    }
                                },1000);
                             }else{
                                 if(data.msg){
                                    setTimeout(function(){
                                        $("#load").html(data.html);
                                        _this.cart.cartLoadAjaxHtml();
                                        $("#tip_ceng,#full").hide();			
                                        //loading.close();
                                        alert({'type':'toast','content':data.msg,'time':1000});
                                    },1000);
                                 }
                            }
                        });
                    }
                },
                confirmText: '确定'
            });	
        },
        /**
         * 收藏
         * @private
         * @event
         * @return null
         */
        collect: function(){
        	
			var _this = this;
			if (loginState == "N") {
				var loading = alert({type: 'toast',content:'对不起，您还没有登录或登录已超时，请登录。','time':1000});
				setTimeout(function(){
					loading.close();
					window.location.href = wap_https_url+"/login.html";
					return false;
				},1000);
			}else{
				/*var s = s_gi(s_account);
				s.products = cdata.put("&&products, ;"+this.getLableId('data-product-id'));
				s.events = "event26";
				var s_code = s.t();
				if (s_code)
					document.write(s_code);
				*/

				alert({
					type : 'alert',
					title : '提示',
					content : '当前选中的这款商品收藏成功后，将会从购物车删除，请您确认',
					cancel: function(){},//空函数
					cancelText: '我再想想',
					confirm: function(){
					
					if(_this.collect_click == true){
						_this.collect_click = false;
						var is_hwg = _this.getLableId('ishwg');
						is_hwg = (typeof is_hwg != 'undefined' && is_hwg != null && is_hwg != '')?'N':'N';
						//var loading = alert({'type':'toast',content: '请稍等...'});
						var timestamp =Date.parse(new Date());
						var posturl = 'cart_addcollection.html?dotime='+timestamp;
						var type='';

						type=_this.getLableId('data-type');


						var post_data = {goodsNo:_this.getLableId('data-product-id'),skuID:_this.getLableId('data-sku-id'),commerceItemID:_this.getLableId('data-commerceitemid-id'),ishwg:is_hwg,type:type};
						$("#tip_ceng,#full").show();
						$.post(posturl, post_data, function (response) {
							 var data = JSON.parse(response);
							 if (data.state === '1') {	
								setTimeout(function(){
									//loading.close();
									if(data.html == 'null'){
										$("#tip_ceng,#full").hide();			
										 alert({'type':'toast','content':data.msg,'time':1000});
										 window.location.reload();
									}else{
										setTimeout(function(){
											$("#load").html(data.html);
											_this.cart.cartLoadAjaxHtml();
											$("#tip_ceng,#full").hide();			
											alert({'type':'toast','content':data.msg,'time':1000});
										},1000);
									}	
								},1000);
							 }else{
								 //loading.close();
								 if(data.html == 'null'){
									 $("#tip_ceng,#full").hide();			
									 alert({'type':'toast','content':data.msg,'time':1000});
									 window.location.reload();
								 }else{
									setTimeout(function(){
										$("#load").html(data.html);
										_this.cart.cartLoadAjaxHtml();
										$("#tip_ceng,#full").hide();
										alert({'type':'toast','content':data.msg,'time':1000});
									},1000);								 
								 }
							}
						});

					}
					},
					confirmText: '移入收藏'
				});	
			}
        },		
        /**
         * 选择购买此种商品的数量
         * @private
         * @event
         * @return null
         */
        selectNum:function(){
            var _this = this;
			var is_hwg = _this.getLableId('ishwg');
				 is_hwg = (typeof is_hwg != 'undefined' && is_hwg != null && is_hwg != '')?'N':'N';
			var cur_pro_num = this.numBtn.children('option:selected').val();
            this.numCon.html(cur_pro_num);
			if(this.sendChangeProductNum(cur_pro_num,is_hwg)){
				this.buyNum = Number(cur_pro_num);
				this.cart.checkOne();
				this.matches.forEach(function(match){
					match.setNum(_this.buyNum);
				});
			}	
        },
        /**
         * 选择购买此种商品的数量
         * @private
         * @event
         * @return null
         */
        addNum:function(){
            var _this = this;
            if(_this.addBtn.hasClass('disabled')){
                return false;
            }
            var ipt = _this.changeBtn;
            var num = Number(ipt.val());
			var maxnum = Number(ipt.attr('max'));
			num++;
            if (num < 1) {
                num = 1;
            }
            if(num == 1){
                _this.minusBtn.addClass('disabled');
            }else{
                _this.minusBtn.removeClass('disabled');
            }
            if (maxnum == 1){
                _this.addBtn.addClass('disabled');
            }
            if (num > maxnum) {
                alert({'type':'toast','content':'您最多只能购买'+maxnum+'件哦','time':1000});
                return false;
            }
            ipt.val(num);
            
			if(this.changeAll == 1 && this.sendChangeNum(num,ipt)){
				this.buyNum = Number(num);
				this.cart.checkOne();
				this.matches.forEach(function(match){
					match.setNum(_this.buyNum);
				});
			}else{
                window.changearr[ipt.attr('commerceitemid')] = {number: num,commerceItemID: ipt.attr('commerceitemid')};
            }
        },
        /**
         * 选择购买此种商品的数量
         * @private
         * @event
         * @return null
         */
        minusNum:function(){
            var _this = this;
            if(_this.minusBtn.hasClass('disabled')){
                return false;
            }
			var ipt = _this.changeBtn;
            var num = Number(ipt.val());
			var maxnum = Number(ipt.attr('max'));
			num--;
            if (num < 1) {
                num = 1;
            }
            if(num == 1){
                _this.minusBtn.addClass('disabled');
            }else{
                _this.minusBtn.removeClass('disabled');
            }
            if (maxnum == 1){
                _this.addBtn.addClass('disabled');
            }
            if (num > maxnum) {
                alert({'type':'toast','content':'您最多只能购买'+maxnum+'件哦','time':1000});
                num = maxnum;
            }
            ipt.val(num);
			if(this.changeAll == 1 && this.sendChangeNum(num,ipt)){
				this.buyNum = Number(num);
				this.cart.checkOne();
				this.matches.forEach(function(match){
					match.setNum(_this.buyNum);
				});
			}else{
                window.changearr[ipt.attr('commerceitemid')] = {number: num,commerceItemID: ipt.attr('commerceitemid')};
            }
        },
        changeNum:function(){
            var _this = this;
			var ipt = _this.changeBtn;
            var num = Number(ipt.val());
			var maxnum = Number(ipt.attr('max'));
            if (num < 1) {
                num = 1;
            }
            if(num == 1){
                _this.minusBtn.addClass('disabled');
            }else{
                _this.minusBtn.removeClass('disabled');
            }
            if (maxnum == 1){
                _this.addBtn.addClass('disabled');
            }
            if (num > maxnum) {
                alert({'type':'toast','content':'您最多只能购买'+maxnum+'件哦','time':1000});
                num = maxnum;
            }
            ipt.val(num);
			if(this.changeAll == 1 && this.sendChangeNum(num,ipt)){
				this.buyNum = Number(num);
				this.cart.checkOne();
				this.matches.forEach(function(match){
					match.setNum(_this.buyNum);
				});
			}else{
                window.changearr[ipt.attr('commerceitemid')] = {number: num,commerceItemID: ipt.attr('commerceitemid')};
            }
        },
        keyupNum:function(){
            var _this = this;
			var ipt = _this.changeBtn;
            var num = ipt.val();
			var maxnum = Number(ipt.attr('max'));
            if (!num) {
                _this.minusBtn.addClass('disabled');
            }else if (num[0] == 0) {
                num = 1;
            }else if (num < 1) {
                num = 1;
            }else if(num == 1){
                _this.minusBtn.addClass('disabled');
            }else{
                _this.minusBtn.removeClass('disabled');
            }
            if (maxnum == 1){
                _this.addBtn.addClass('disabled');
            }else{
                _this.addBtn.removeClass('disabled');
            }
            if (num > maxnum) {
                alert({'type':'toast','content':'您最多只能购买'+maxnum+'件哦','time':1000});
                num = maxnum;
            }
            ipt.val(num);
        },
        /**
         * 显示延保滑层
         * @private
         * @event
         * @return null
         */
        showYb: function(){
            window.ybSlider.show(this);
        },
        /**
         * 显示增值服务滑层
         * @private
         * @event
         * @return null
         */
        showService: function(){
            window.serviceAslider.show(this);
        },

		/**
         * 显示优惠滑层
         * @private
         * @event
         * @return null
         */
        showYh: function(){
            window.yhSlider.show(this);
        },
        /**
         * 以toggle的形式切换选中状态
         * @private
         * @event
         * @return null
         */
        toggle: function(){
			if(this.sendCheckProduct()){
				if(this.isChecked){
					this.uncheck();
				}else{
					this.check();
				}				
			}
        },
        /*设置延保*/
        setYb:function(ybText,ybBtn){
            this.$ybText.text(ybText);
			this.$ybBtn.text(ybBtn);
        },
		/*获取对应标签ID*/
		getLableId:function(lable){
			var data_val = lable.replace('data-','');
			//console.log(data_val);
			return this.$el.data(data_val);
		},
		/*对应标签ID赋值*/
		setLableId:function(lable,val){
			var data_val = lable.replace('data-','');
			return this.$el.data(data_val,val);
		},	
		/*动态加载js*/
		proLoadAjaxHtml:function(){
			this.$ybBtn.on('click',$.proxy(this.showYb,this));
			this.cart.cartLoadAjaxHtml();
		},
		/*优惠动态加载js*/
		yhproLoadAjaxHtml:function(){
			this.$yhBtn.on('click',$.proxy(this.showYh,this));
			this.cart.cartLoadAjaxHtml();
		},
        /*增值服务动态加载js*/
		zzproLoadAjaxHtml:function(){
			this.$serviceBtn.on('click',$.proxy(this.showService,this));
			this.cart.cartLoadAjaxHtml();
		},
		//单个商品选中
		sendCheckProduct:function(){
			var _this = this;
			var is_hwg = _this.getLableId('ishwg');
				 is_hwg = (typeof is_hwg != 'undefined' && is_hwg != null && is_hwg != '')?'N':'N';
			var isChesuccess = true;
			var checkStatus = 5;
			if(this.isChecked){checkStatus = 4;}
			var timestamp =Date.parse(new Date());
			var posturl = 'cart_check.html?dotime='+timestamp;
			var commerceItemID = this.getLableId('data-commerceitemid-id');
			var post_data = {checkStatus: checkStatus, shippingId: this.cart.getShopId('data-shippingid'), shopNO: '', commerceItemID: commerceItemID,ishwg:is_hwg};
			$("#tip_ceng,#full").show();
			$.post(posturl,post_data,function (data){
				data = eval('(' + data + ')');
				if(data.state === '1'){		
					$("#load").html(data.html);
					var jump_id = commerceItemID+'_num';
					var cur_jump_num = $('#'+jump_id).position().top;
					cur_jump_num = parseInt(cur_jump_num - 200);
					$('body').scrollTop(cur_jump_num);
					_this.cart.cartLoadAjaxHtml();
					$("#tip_ceng,#full").hide();						
				}else if (data.state === '0') {
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
		//单个商品数量
		sendChangeProductNum:function(cur_num,is_hwg){

			var _this = this;
			var isChangesuccess = true;
			var timestamp =Date.parse(new Date());
			var posturl = 'cart_modify.html?dotime='+timestamp;	
			//console.log(this.getLableId('data-commerceitemid-id'));
			//return false;
			var post_data = {number: cur_num,commerceItemID: this.getLableId('data-commerceitemid-id'),ishwg:is_hwg,type:this.getLableId('data-type')};
			$("#tip_ceng,#full").show();
			$.post(posturl,post_data,function (data){
				data = eval('(' + data + ')');
				if (data.state === '1') {
					$("#load").html(data.html);
					_this.cart.cartLoadAjaxHtml();
					$("#tip_ceng,#full").hide();				
				}else if (data.state === '0') {
					isChangesuccess = false;
				}
			});
				
			return isChangesuccess;	
		},
        sendChangeNum:function(cur_num,ipt){
            var _this = this;
            dsq = window.clearTimeout(dsq);
            dsq = window.setTimeout(function() {
                var isChangesuccess = true;
                var timestamp =Date.parse(new Date());
                var posturl = 'cart_modify.html?dotime='+timestamp;	
                //return false;
                var post_data = {number: cur_num,commerceItemID: ipt.attr('commerceitemid'),ishwg:ipt.attr('ishwg'),type:ipt.attr('data-type'),need_keep_shippingId:_this.$editArea.is(':visible')?_this.cart.getShopId('data-shippingid'):''};
                $("#tip_ceng,#full").show();
                $.post(posturl,post_data,function (data){
                    data = eval('(' + data + ')');
                    if (data.state === '1') {
                        $("#load").html(data.html);
                        _this.cart.cartLoadAjaxHtml();
                        $("#tip_ceng,#full").hide();				
                    }else if (data.state === '0') {
                        isChangesuccess = false;
                        $("#tip_ceng,#full").hide();
                        alert({'type':'toast','content':data.msg,'time':2000});
                        window.location.href = 'shopping_cart.html';
                    }
                });
                
                return isChangesuccess;	
            },70);
		},
        sendChangeAll:function(){
            var _this = this;
            var isChangesuccess = true;
            var timestamp =Date.parse(new Date());
            var posturl = 'cart_modify.html?dotime='+timestamp;	
            //return false;
            var post_data = {numbercartModifyList:window.changearr,ishwg:_this.changeBtn.attr('ishwg'),type:_this.changeBtn.attr('data-type'),all:1};
			var post_data_empty = true;
			for(var postDataKey in post_data.numbercartModifyList){
				post_data_empty = false;
				break;
			}
			//post_data.numbercartModifyList无参数时 不发请求
			if(post_data_empty == false){
				$("#tip_ceng,#full").show();
				$.post(posturl,post_data,function (data){
					data = eval('(' + data + ')');
					if (data.state === '1') {
						$("#load").html(data.html);
						_this.cart.cartLoadAjaxHtml();
						$("#tip_ceng,#full").hide();
					}else if (data.state === '0') {
						isChangesuccess = false;
						$("#tip_ceng,#full").hide();
						alert({'type':'toast','content':data.msg,'time':2000});
						window.location.href = 'shopping_cart.html';
					}
				});

				return isChangesuccess;
			}
		},
		
		
    };
    /**
     * 暴露商品类
     */
    window.Product = Product;
    window.dsq = '';//定时器
    window.changearr = {}; //记录修改内容
})();
