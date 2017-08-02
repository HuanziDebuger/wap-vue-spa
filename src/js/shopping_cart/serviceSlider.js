/**
 * 增值服务滑层的逻辑
 * @Author baishuang
 * @Date 2016-11-09
 * @Last-Modified-Date: 2016-11-09
 * @Last-Modified-By: baishuang
 */
!(function() {
    var gVar = {};
    var gDel = {};
    gVar['addServices'] = {};
    /**
     * 增值服务滑层类
     * @Class
     */
    var serviceSlider = function() {
        /**
         * 增值服务滑层的dom
         * @type jqDom
         */
        this.$el = $('[data-aslider="zz_service"]');
        /**
         * 选项列表
         * @type jqDom
         */
        this.$list = this.$el.find('.service_con');
        /**
         * 确定按钮
         * @type jqDom
         */
        this.$ok = this.$el.find('.sure_btn');
        //事件侦听
        this.$ok.on('click', $.proxy(this.onOk, this));
        this.$el.on('click', '.close', $.proxy(this.onClose, this));

    };

    serviceSlider.prototype = {
        constructor: serviceSlider,
        /**
         * 当显示此滑层时，获取触发滑层的商品
         * @public
         * @param product 触发增值服务滑层的商品
         * @return null
         */
        show: function(product) {
            var _this = this;
			this.product = product;
			var commerceitemid = this.product.getLableId('data-commerceitemid-id');
			
			var commerceitemid_list = $("#data-commerceItemid-list-"+commerceitemid).html()
			var data = JSON.parse(commerceitemid_list);
			if(data.status == 1){
				setTimeout(_this.loadSuccess(data.data,data.goodsCount,data.mainCommerceItemId),300);
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
         * ajax请求增值服务信息完成的响应函数
         * @private
         * @param data JSON?EventTarget? 根据ajax返回值而定
         * @return null
         */
        loadSuccess: function(data,goodsCount,mainCommerceItemId) {
            var _this = this;
            if (data){
                this.$list.append(this.template(data,goodsCount,mainCommerceItemId));
                this.$el.find('[data-radio]').radio({
                    canToggle: true,
                    checkedClass: 'checked',
                    onChange: function(val, el, group) {
                        var $el = $(el);
                        var CId = $el.find("#commerceItemId").html(),
                            SkuId = $el.find("#serviceSkuId").html(),
                            PId   = $el.find("#serviceProductId").html(),
                            Type  = $el.find("#serviceType").html();
                        gVar['addServices'][Type] = {};
                        if ($el.hasClass('checked')) {
                            gVar['addServices'][Type]['serviceSkuId'] = SkuId;
                            gVar['addServices'][Type]['serviceProductId'] = PId;
                            gVar['addServices'][Type]['mainCommerceItemId'] = mainCommerceItemId;
                            gVar['addServices'][Type]['serviceQuantity'] = goodsCount;
                            gVar['addServices'][Type]['serviceType'] = Type;
                        }
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
        onClose: function() {
            var _this = this;
            setTimeout(function() {
                _this.$list.empty();
            }, 300);
        },
        /**
         * 确定时，需要执行的操作
         * @private
         * @event click
         * @return null
         */
        onOk: function() {
            //UNDO  选中的选项在页面渲染方式
            //window.location.reload();
            var is_check = false;
            for(var i in gVar['addServices']){
                if(gVar['addServices'][i]['serviceSkuId'])
                {
                    is_check = true;
                    break;
                }
            }
            if(is_check === true){
                this.cancelService(0);
            }else{
                this.cancelService(1);
            }
        },
        /**
         * 取消上次所选增值服务
         * @private
         * @event click
         * @return null
         */		
		cancelService: function (del){
			var _this = this;
			if(del){
                //没有增值服务，删除该商品
                var para = {'commerceItemID':gDel};
                var url = "index.php?ctl=shop_cart&act=cartDel&is_new=Y";
			}else{
                var para = gVar;
                var url = 'cart_cancelservice.html';
            }
            $.post(url, para, function (response) {
                 var data = JSON.parse(response);
                 if (data.isSuccess == "Y") {
                     $("#load").html(data.html);
                     _this.product.zzproLoadAjaxHtml();
                     $("#tip_ceng,#full").hide();
                 }else{
                     if(data.failReason){
                         console.log(data.failReason);
                     }else{
                         console.log("操作失败");
                     }
                }
            });
		},
        /**
         * 增值服务选项列表视图模板，用来根据后台返回的值，渲染出增值服务列表
         * @private
         * @param data JSON 通过ajax得到的数据
         * @return HtmlText 字符串形式的html文本
         */
        template: function(data,goodsCount,mainCommerceItemId) {
            var data = JSON.parse(data);
            var result = '';
            for(var i=0; i<data.length; i++){
                result+='<div><span class="g_icon flexbox"><i><img src="'+data[i].serviceIcon+'" /></i><h3 class="tit">'+data[i].serviceDesc+'</h3></span><ul class="item_list">';
                for(var j=0; j<data[i].canSelectServices.length; j++){
                    result+='<li class="radio';
                    if (data[i].canSelectServices[j].selected =='Y'){
                        gVar['addServices'][data[i].serviceType]={};
                        gVar['addServices'][data[i].serviceType]['serviceSkuId'] = data[i].canSelectServices[j].serviceSkuId;
                        gVar['addServices'][data[i].serviceType]['serviceProductId'] = data[i].canSelectServices[j].serviceProductId;
                        gVar['addServices'][data[i].serviceType]['mainCommerceItemId'] = mainCommerceItemId;
                        gVar['addServices'][data[i].serviceType]['serviceQuantity'] = goodsCount;
                        gVar['addServices'][data[i].serviceType]['serviceType'] = data[i].serviceType;
                        gDel[i] = {'commerceItemID':data[i].canSelectServices[j].commerceItemId};
                        result+=' checked';
                    }
                    result+='" data-radio="'+data[i].serviceType+'"><p class="name">'+data[i].canSelectServices[j].serviceDesc+'</p><p class="price">'+data[i].canSelectServices[j].servicePrice;
                    if(data[i].canSelectServices[j].serviceType==1){
                        result+='<span class="mark">特惠</span>';
                    }
                    result+='</p><em style="display:none" id="serviceSkuId">'+data[i].canSelectServices[j].serviceSkuId+'</em><em style="display:none" id="serviceProductId">'+data[i].canSelectServices[j].serviceProductId+'</em><em style="display:none" id="serviceType">'+data[i].serviceType+'</em><em style="display:none" id="commerceItemId">'+data[i].canSelectServices[j].commerceItemId+'</em></li>';
                }
                result+='</ul></div>';
                
            }
            return result;
        }
    };
    /**
     * 暴露类到全局域
     */
    window.serviceSlider = serviceSlider;
})();