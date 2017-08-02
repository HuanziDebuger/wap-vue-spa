/**
 * 延保滑层的逻辑
 * @Author zhaoye-ds1
 * @Date 2015-09-28
 * @Last-Modified-Date: 2015-10-14 10:45
 * @Last-Modified-By: ry\gaofeng
 */
!(function(){
    /**
     * 延保滑层类
     * @Class
     */
    var ybText;
    var YanBaoSlider = function(){
        /**
         * 是否有被选中的选项
         * @type bool
         */
        this.isSelected = false;

        /**
         * 延保类型
         * @type String
         */
        this.ybType = null;
		//this.is_have = false;
		//this.product_obj;
        /*
        * 设置延保
        * */
        //this.ybText = null;
        /**
         * 延保滑层的dom
         * @type jqDom
         */
        this.$el = $('[data-aslider="yb"]');
        /**
         * 选项列表
         * @type jqDom
         */
        this.$list = this.$el.find('ul');
        /**
         * 确定按钮
         * @type jqDom
         */
        this.$ok = this.$el.find('.btn');

        //事件侦听
        this.$ok.on('click',$.proxy(this.onOk,this));
        this.$el.on('click','.close',$.proxy(this.onClose,this));

    };

    YanBaoSlider.prototype = {
        constructor:YanBaoSlider,
        /**
         * 当显示此滑层时，获取触发滑层的商品
         * @public
         * @param product 触发延保滑层的商品
         * @return null
         */
        show: function(product){
			var _this = this;
			this.product = product;
			var timestamp =Date.parse(new Date());
			var commerceitemid = this.product.getLableId('data-commerceitemid-id');
			
			var commerceitemid_list = $("#data-commerceItemid-list-"+commerceitemid).html()
			var data = JSON.parse(commerceitemid_list);
			if(data.status == 1){
				setTimeout(_this.loadSuccess(data.data, commerceitemid),300);
			}else{
				console.log("获取失败:"+data.data);
			}

			/*
			var url = 'cart-'+commerceitemid+'-warranty.html?dotime='+timestamp;
			$.get(url,function (response){
				var data = JSON.parse(response);
				if(data.status == 1){
					setTimeout(_this.loadSuccess(data.data),300);
				}else{
					console.log("获取失败:"+data.data);
				}
			});
			*/
        },
        /**
         * ajax请求延保信息完成的响应函数
         * @private
         * @param data JSON?EventTarget? 根据ajax返回值而定
         * @return null
         */
        loadSuccess: function(data, commerceitemid){
			if(data){
				this.$list.html(this.template(data, commerceitemid));
				this.$el.find('[data-radio]').radio({
					useDataAttr: true,
					canToggle: true,
					onChange: function(val,el,group){
						ybText = $(el).next('p').find('.ping_span').text();
					}
				});	
			}
			this.$ok.show();
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
                _this.$list.empty();
                _this.$ok.hide();
            },300);
        },
		buyWarranty: function(mainid,proid,skuid,quantity){
			 var _this = this;
			 var url = 'cart_buywarranty.html';
			 var para = new Object();
			 para.mainid = mainid;
			 para.proid = proid;
			 para.skuid = skuid;
			 para.quantity = quantity;
			 $("#tip_ceng,#full").show();
			 $.post(url, para, function (response) {
				 var data = JSON.parse(response);
				 if (data.isSuccess == "Y") {
					 $("#load").html(data.html);
					 _this.product.proLoadAjaxHtml();
					 $("#tip_ceng,#full").hide();				 
					 //_this.product.setYb(ybText,'修改延保');
				 }else{
					 if(data.failReason){
						 alert({
							type: 'toast',
							content: data.failReason,
							time: 2000,
							finish: function(){
								$("#tip_ceng,#full").hide();
							}
						});
						 console.log(data.failReason);
					 }else{
						 console.log("操作失败");
					 }
				 }
			 });
		},
		/**
         * 取消上次所选延保服务
         * @private
         * @event click
         * @return null
         */		
		cancelWarranty: function (delete_itemid){
			var _this = this;
			if(delete_itemid){
				var url = 'cart_cancelwarranty.html';
				var para = new Object();
				para.delete_itemid = delete_itemid;
				$("#tip_ceng,#full").show();
				$.post(url, para, function (response) {
					 var data = JSON.parse(response);
					 if (data.isSuccess == "Y") {
						 $("#load").html(data.html);
						 _this.product.proLoadAjaxHtml();
						 $("#tip_ceng,#full").hide();
						 //_this.product.setYb(ybText,'购买延保');
					 }else{
						 if(data.failReason){
							 console.log(data.failReason);
						 }else{
							 console.log("操作失败");
						 }
					}
				});
			}
		},		
		/**
         * 确定时，将此时对应商品的延保属性修改为选择属性
         * @private
         * @event click
         * @return null
         */
        onOk: function(){
				//当前选中的个数
				var cur_ckeck_data = $("#new_warranty_list li[data-radio-ckd='true']");
				//页面默认值
				var delete_itemid = $('#default_val').val();
				if(cur_ckeck_data.length == '0'){
					if(delete_itemid){
						//调用删除上一次所选中的
						ybText = '您可购买延保服务';
						this.cancelWarranty(delete_itemid);
					}
				}else{
					//var comerceid = cur_ckeck_data.parent().attr('comerceid-val');
					var mainid = cur_ckeck_data.attr('mainid-val');
					var proid = cur_ckeck_data.attr('proid-val');
					var skuid = cur_ckeck_data.attr('skuid-val');
					var quantity = cur_ckeck_data.attr('quantity-val');
					/*if(comerceid){
						//选中状态下直接返回购物车页面；
						console.log('111');
						window.location.href="shopping_cart_new.html";
					}else{
						this.buyWarranty(mainid,proid,skuid,quantity);
					}*/
					this.buyWarranty(mainid,proid,skuid,quantity);
				}		
			
			//console.log('1');
            //this.product.$el.data('yb-type',this.ybType);
            //this.ybType = null;
            //this.product = null;
            //this.product.setYb(ybText);
        },
        /**
         * 延保选项列表视图模板，用来根据后台返回的值，渲染出延保列表
         * @private
         * @param data JSON 通过ajax得到的数据
         * @return HtmlText 字符串形式的html文本
         */
        template: function(data, commerceitemid){		
			var _this = this;
			var data = JSON.parse(data);
            var result = '',default_val = '';
            for(var i=0; i<data.length; i++){
                if(data[i].selected == 'Y'){
					var default_commerceItemId = data[i].commerceItemId;
					var default_val = commerceitemid;
					result += '<li class="flexbox" data-radio="yb" data-icon="&#x0041" data-radio-ckd="true" data-yb-type="'+i+'" comerceid-val="'+default_val+'" mainid-val="'+commerceitemid+'" proid-val="'+data[i].warrantyProId+'" skuid-val="'+data[i].warrantySkuId+'" quantity-val="'+data[i].warrantyQuantity+'">';
					result += '<i ></i>';
				}else{
					result += '<li class="flexbox" data-radio="yb" data-icon="&#x0041" data-radio-ckd="false" data-yb-type="'+i+'" comerceid-val="" mainid-val="'+commerceitemid+'" proid-val="'+data[i].warrantyProId+'" skuid-val="'+data[i].warrantySkuId+'" quantity-val="'+data[i].warrantyQuantity+'">';
					result += '<i></i>';
				}
                result += '<p class="flex1">';
				
				result += '<em class="price">¥'+data[i].price;

				if(data[i].warrantyType == '1'){
					result += '<i>特惠</i>';
				}
				result += '</em>';
                result += '<span>'+data[i].displayName+'</span><span class="ping_span" style="display:none;">'+data[i].displayName+'&nbsp;￥'+data[i].price+'&nbsp;x'+Number(_this.product.numBtn.children('option:selected').val())+'</span></p>'
                result += '</li>';
            }
			result += '<input type="hidden" id="default_val" value="'+default_commerceItemId+'">';
            return result;
        }
    };
    /**
     * 暴露类到全局域
     */
    window.YanBaoSlider = YanBaoSlider;
})();
