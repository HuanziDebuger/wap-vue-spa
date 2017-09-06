/**
 * 一个购物车，即国美自营（或一个商店）的所有产品组成的列表
 * @Author zhaoye-ds1
 * @Date 2015-09-28
 * @Last-Modified-Date: 2015-10-13 17:01
 * @Last-Modified-By: ry\gaofeng
 */
!(function(){
    /**
     * 一个购物车类
     * 一个购物车即代表了在一个商店（国美自营或其他商店）购买的全部商品的列表
     * @Class
     * @param el DocumentElement 页面上的一个购物车的dom对象,每个Cart实例绑定一个相应的dom对象
     * @param content @Content 由于是树形结构，每个Cart关联了自己的父对象
     * @return null
     */
    var Cart = function(el,content){
        /**
		 * 用于闭包的this对象
		 * @private
		 * @type @Cart
		 */
		var _this = this;
		/**
		 * 跟本购物车绑定的dom对象
		 * @public
		 * @type jqDom
		 */
		this.$el = $(el); //整个container下的class="module"、class="shop" 		
		/**
		 * 父对象，购物车列表的主体
		 * @public
		 * @type @Content
		 */
		this.content = content;
		/**
		 * 本购物车是否已经全部选中
		 * @public
		 * @type bool
		 */
		this.isCheckedAll = false;
		//this.isCheckedAll = this.$el.find('.check_in all').hasClass('check_out');
		/**
		 * 购物车列表
		 * @public
		 * @type Array
		 */
		this.productList = [];
		/**
		 * 本购物车的编辑按钮(店铺编辑按钮)
		 * @public
		 * @type jqDom
		 */
		this.$editBtn = this.$el.find('.edit');
		/**
		 * “领券”按钮(店铺领券按钮)
		 * @type jqDom
		 */
		this.$LingQuanBtn = this.$el.find('.arch');
		/**
		 * 本购物车的完成编辑按钮(店铺编辑后的完成按钮)
		 * @public
		 * @type jqDom
		 */
		this.$finishBtn = this.$el.find('.finish');
		/**
		 * 获取店铺名称
		 * @public
		 * @type jqDom
		 */
		this.$store_name = this.$el.find('.store_name');		
		/**
		 * 本购物车的全选选框(店铺全选按钮)
		 * @public
		 * @type jqDom
		 */
		this.$checkAll = this.$el.find('.check_in');
        /**
         * “换购”按钮
         * @type jqDom
         */
        this.$hgBtn = this.$el.find('.replace_goods');
        /**
         * “联营凑单(查看全部、修改优惠)”按钮
         * @type jqDom
         */
        this.$lookMoreBtn = this.$el.find('.see_all');
		//扫描本购物车绑定的el下的所有商品
		//通过为每个商品实例化一个Product类，建立一个抽象列表，用来维护dom元素
		this.$el.find('.shop_list .item').each(function(idx,item){
			_this.productList.push(new Product(item,_this));
		});
		//初始化
		this.productList.forEach(function(product){
			product.init();
		});
		//侦听各个按钮的点击事件
		this.$checkAll.on('click',$.proxy(this.toggleAll,this));  //(店铺全选按钮)
		this.$LingQuanBtn.on('click',$.proxy(this.showLingQuan,this));  //(店铺领券按钮)
		this.$editBtn.on('click',$.proxy(this.edit,this));//(店铺编辑按钮)
		this.$finishBtn.on('click',$.proxy(this.editDone,this));//(店铺编辑后的完成按钮)
        this.$hgBtn.on('click',$.proxy(this.showHg,this));
        this.$lookMoreBtn.on('click',$.proxy(this.showLookMore,this)); //“联营凑单(查看全部、修改优惠)”按钮绑定show函数
        
		/*一个标签时点击显示所有文字*/
		this.$el.find('.one_lab').on('click',function(){
			$(this).find('i').toggleClass('up');
			$(this).find('p').toggleClass('ellipsis');
			$(this).find('.gift_way').toggle();
		});
		
		//找相似按钮点击事件 lw 2016/11/15
        this.$el.find('.sim').on('click',function(){
        	/*埋码*/
            var href = $(this).find("a").attr('data-del');
            var s = s_gi(s_account);
            s.linkTrackVars = "prop22";
            s.prop22 = '购物车页面:找相似';
            s.tl(this,'o','购物车页面:找相似');
            window.location.href = href;
        });
		
        //一个标签文字显示不够多时
        /*this.$el.find('.one_lab i').css('display','none');
        var big_w=document.getElementsByClassName('one_style')[0].offsetWidth,
            len=$('.activity_coupon').length;
        var small=document.getElementsByClassName('activity_coupon');
        for(var i=0;i<len;i++){
            var small_w=document.getElementsByClassName('activity_coupon')[i].offsetWidth;
            if(small_w>=big_w){
                $('.one_lab i:eq('+i+')').css('display','block');
            }else if(small_w<=big_w){
                $('.one_lab i:eq('+i+')').css('display','none');
            }
        }*/
		/*一个以上标签时点击显示*/
		this.$el.find('.two_lab').on('click',function(){
			$(this).find('i').toggleClass('up');
			$(this).find('p').toggle();
			$(this).find('.gift_way').toggle();
		});
		this.$el.find('.store_con').on('click',function(){
            $(this).toggle();
			$(this).find('i').toggleClass('up');
			$(this).next('.show_con').toggle();
		});
		this.$el.find('.store1_con ').on('click',function(){
            $(this).toggle();
			$(this).find('i').toggleClass('up');
           $(this).find('p').toggleClass('ellipsis');
            $(this).next('.show_con').toggle();
        });

        this.$el.find('.show_con').on('click',function(){
            $(this).toggle();
            $(this).prev('.store_con,.store1_con').toggle();
        });
		/*互斥*/
		//this.$el.find("[data-radio]").radio('onChange',$.proxy(this.radioexclusion,this));
		
		this.$el.find("[data-radio]").radio({
			onChange: function(val,el){
				if($(el).data('type') == 0){
					var is_hwg = $(el).data('ishwg');
						 is_hwg = (typeof is_hwg != 'undefined' && is_hwg != null && is_hwg != '')?'N':'N';
					var timestamp =Date.parse(new Date());
					var posturl = 'cart_applyShopPromo.html?dotime='+timestamp;
					var post_data = {promotionId: $(el).data('promid'), shippingId: $(el).data('shippingid'),ishwg:is_hwg};
					$("#tip_ceng,#full").show();
					$.post(posturl,post_data,function (data){
						data = eval('(' + data + ')');
						if(data.state === '1'){		
							$("#load").html(data.html);
							this.content.conLoadAjaxHtml();
							$("#tip_ceng,#full").hide();						
						}else if (data.state === '0') {
							$("#tip_ceng,#full").hide();		
							alert({'type':'toast','content':data.msg,'time':1000});
							$("#load").html(data.html);
							this.content.conLoadAjaxHtml();
						}else if(data.state === '-1') {
							setTimeout(function(){
								$("#tip_ceng,#full").hide();		
								alert({'type':'toast','content':data.msg,'time':1000});
								window.location.href = wap_https_url+'/login.html';
							},1000);					
						}
					});		
				}
			}
		});
        
        this.$el.find('.shop_list .item_hg').prev('.item').children('.item_line').css('height','7rem');
	}
    /**
     * 函数
     */
    Cart.prototype = {
        /**
         * 类构造函数
         */
        constructor: Cart,
		init: function(){
			if(this.isAllChecked()){
				this.checkAll();
			};
            var gift_msg = $('#globalInfos').val();
            if(gift_msg){
                $('#globalInfos').val('');
                alert({type: 'toast',content:gift_msg,'time':2000});
            }
		},
        /**
         * 绑定搭配购
         * 通过遍历本购物车中的所有商品id
         * 如果需要被搭配的商品的data-match属性，等于一个商品的product-id 则将两者绑定
         * @public
         * @param 一个被搭配的商品
         * @return null
         */
        bindMatch: function(match){
            for(var i=0; i<this.productList.length; i++){
                if(this.productList[i].$el.data('product-id') == match.$el.data('match') && this.productList[i].$el.data('product-id') && match.$el.data('match')){
                    this.productList[i].matches.push(match);
                }
            }
        },
        /**
         * 全选所有商品
         * @public
         * @return null
         */
        checkAll: function(){
            this.$checkAll.addClass('check_out');
            this.isCheckedAll = true;
            $(this.productList).each(function(idx,product){
                product.check();
            });
        },
        /**
         * 被一个Product通知，选中了一种商品
         * 继续向上通知给Content，选中了一个商品
         * @public
         * @return null
         */
        checkOne: function(){
            if(this.isAllChecked()){
				this.$checkAll.addClass('check_out');
			}
            this.content.checkOne();
        },
		/**
		*获取当前商品的店铺id
		*/
		getShopId: function(lable){			
			var data_val = lable.replace('data-','');
			return this.$el.find('['+lable+']').data(data_val);
		},
        /**
         * 编辑购物车
         * 将购物车中的每个有效商品设为可编辑状态
         * @private
         * @event click
         * @return null
         */
        edit: function(){
            this.$editBtn.hide();
            this.$finishBtn.show();
            $(this.productList).each(function(idx,product){
               product.edit();
            });
        },
        /**
         * 编辑完成
         * 将购物车中的每个有效商品设为默认状态
         * @private
         * @event click
         * @return null
         */
        editDone: function(){
            this.$editBtn.show();
            this.$finishBtn.hide();
            $(this.productList).each(function(idx,product){
                product.editDone();
                if(idx == 0){
                    if(window.changearr){
                        product.sendChangeAll();
                        window.changearr = {};
                    }
                }
            });
        },
        /**
         * 显示领券滑层
         * @private
         * @event
         * @return null
         */
        showLingQuan:function(){
			if (loginState == "N") {
				var loading = alert({type: 'toast',content:'对不起，您还没有登录或登录已超时，请登录。','time':1000});
				setTimeout(function(){
					loading.close();
					window.location.href = wap_https_url+"/login.html";
					return false;
				},1000);
			}
			window.lingQuan.show(this);
        },
        /**
         * 获取所有的有效商品的数量总和
         * @public
         * @return Number 所有的有效商品的数量总和
         */
        getNum: function(){
            var num = 0;
            for(var i=0; i<this.productList.length; i++){
                if(this.productList[i].isChecked && this.productList[i].type == 'normal'){
                    num += this.productList[i].buyNum;
                    this.productList[i].matches.forEach(function(match){
                        num += match.buyNum;
                    });
                }
            }
            return num;
        },
        /**
         * 获取所有选中状态的商品的价格
         * @public
         * @return Number 所有选中状态的商品的价格
         */
        getTotalPrice: function(){
            var price = 0;
            for(var i=0; i<this.productList.length; i++){
                price += Number(this.productList[i].getPrice());
            }
            return price;
        },
        /**
         * 检测本购物车的所有商品是否已经全选
         * @public
         * @return bool 是否已经全选
         */
        isAllChecked: function(){
            this.isCheckedAll = true;
            var _this = this;
            $(this.productList).each(function(idx,product){
                if(!product.isChecked){
                    _this.isCheckedAll = false;
                }
            });
            return this.isCheckedAll;
        },
        /**
         * 覆盖页面后重新激活js
         * @public
         * @return null
         */
		cartLoadAjaxHtml:function(){
			this.content.conLoadAjaxHtml();
		},		
        /**
         * 删除本购物车中的一个指定商品
         * @public
         * @param product @Product 一个待删除商品的抽象实例
         * @return null
         */
        removeOne: function(product){
            for(var i=0; i<this.productList.length; i++){
                if(this.productList[i] == product){
                    delete this.productList[i];
                    this.productList.splice(i,1);
                    if(this.productList.length == 0){
                        this.$el.remove();
                        this.content.removeCart(this);
                    }else{
                        this.content.removeOne();
                    }
                    return;
                }
            }
        },
        /**
         * toggle方式，全选，或全不选所有商品
         * @private
         * @event click
         * @return null
         */
        toggleAll: function(){
			if(this.checkShops(this.isCheckedAll)){
				if(this.isCheckedAll){
					this.isCheckedAll = false;
					this.uncheckAll();
				}else{
					this.isCheckedAll = true;
					this.checkAll();
				}
			}	
        },
        /**
         * 被一个Product通知，取消选中了一种商品
         * 继续向上通知给Content，取消选中了一个商品
         * @public
         * @return null
         */
        uncheckOne: function(){
            this.$checkAll.removeClass('check_out');
            this.isCheckedAll = false;
            this.content.uncheckOne();
        },
        /**
         * 取消全选所有商品
         * @public
         * @return null
         */
        uncheckAll: function(){
            this.isCheckedAll = false;
            this.$checkAll.removeClass('check_out');
            $(this.productList).each(function(idx,product){
                product.uncheck();
            });
        },
		/*国美全选 or 店铺全选*/
		checkShops:function(isCheckedAll){
			var _this = this;
			var is_hwg = this.getShopId('data-ishwg');
				 is_hwg = (typeof is_hwg != 'undefined' && is_hwg != null && is_hwg != '')?'N':'N';
			var isChesuccess = true;
			var checkStatus = 3;  //店铺全选
			if(isCheckedAll){
				checkStatus = 2;  //店铺取消
			}
			var timestamp =Date.parse(new Date());
			var posturl = 'cart_check.html?dotime='+timestamp;
			var post_data = {checkStatus:checkStatus,shippingId:this.getShopId('data-shippingid'),shopNO:'',commerceItemID:'',ishwg:is_hwg};			
			$("#tip_ceng,#full").show();
			$.post(posturl,post_data,function (data){
				data = eval('(' + data + ')');
				if(data.state === '1'){
					$("#load").html(data.html);
					_this.cartLoadAjaxHtml();
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
         * 显示换购滑层
         * @private
         * @event
         * @return null
         */
        showHg: function(){
            window.replace.show(this);
        },
        /**
         * 联营凑单(查看全部、修改优惠)显示滑层
         * @private
         * @event
         * @return null
         */
        showLookMore: function(){
            window.cdSlider.show(this);
        } 
    };
    /**
     * 暴露购物车类
     */
    window.Cart = Cart;
})();
