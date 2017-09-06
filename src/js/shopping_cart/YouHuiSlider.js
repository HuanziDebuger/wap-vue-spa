/**
 * 优惠滑层的逻辑
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
    var yhText;
    var YouHuiSlider = function(){
        /**
         * 是否有被选中的选项
         * @type bool
         */
        this.isSelected = false;

        /**
         * 延保类型
         * @type String
         */
        this.yhType = null;
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
        this.$el = $('[data-aslider="yh"]');
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

    YouHuiSlider.prototype = {
        constructor:YouHuiSlider,
        /**
         * 当显示此滑层时，获取触发滑层的商品
         * @public
         * @param product 触发延保滑层的商品
         * @return null
         */
        show: function(product){

            var s=s_gi(s_account);
            s.linkTrackVars="eVar39";
            s.eVar39="购物车页面:修改优惠";
            s.tl(this,'o','购物车页');
            
			var _this = this;
			this.product = product;
			var timestamp =Date.parse(new Date());
			var commerceitemid = this.product.getLableId('data-commerceitemid-id');
			var shippingId     = this.product.getLableId('data-shippingid-id');
			var canSelectPromList_list = $("#data-canSelectPromList-list-"+commerceitemid).html()
			var data = JSON.parse(canSelectPromList_list);
			if(data.status == 1){
				setTimeout(_this.loadSuccess(data.data, commerceitemid, shippingId),300);
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
        loadSuccess: function(data, commerceitemid, shippingId){
			if(data){
				this.$list.html(this.template(data, commerceitemid, shippingId));
				this.$el.find('[data-radio]').radio({
					useDataAttr: true,
					canToggle: true,
					onChange: function(val,el,group){
						yhText = $(el).next('p').find('.ping_span').text();
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
		buyWarranty: function(commerceItemId,shippingId,promotionId){
			 var _this = this;
			 var url = 'cart_buyprom.html';
			 var para = new Object();
			 para.commerceItemId = commerceItemId;
			 para.shippingId     = shippingId;
			 para.promotionId    = promotionId;
			 $("#tip_ceng,#full").show();
			 $.post(url, para, function (response) {
				 var data = JSON.parse(response);
				 if (data.isSuccess == "Y") {
					 $("#load").html(data.html);
					 _this.product.yhproLoadAjaxHtml();
					 $("#tip_ceng,#full").hide();				 
					 //_this.product.setYb(ybText,'修改延保');
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
         * 确定时，将此时对应商品的延保属性修改为选择属性
         * @private
         * @event click
         * @return null
         */
        onOk: function(){
			//当前选中的个数
			var cur_ckeck_data = $("#yhnew_warranty_list li[data-radio-ckd='true']");

			var commerceItemId = $('#default_val').val();
			var shippingId     = $('#default_shippingId').val();
			var promotionId    = cur_ckeck_data.attr('promotionid-val');

			this.buyWarranty(commerceItemId,shippingId,promotionId);
        },
        /**
         * 优惠选项列表视图模板，用来根据后台返回的值，渲染出优惠列表
         * @private
         * @param data JSON 通过ajax得到的数据
         * @return HtmlText 字符串形式的html文本
         */
        template: function(data, commerceitemid, shippingId){		
			var _this = this;
			var data = JSON.parse(data);
            var result = '';
            for(var i=0; i<data.length; i++){
                if(data[i].selected == 'Y'){
					result += '<li class="flexbox" data-radio="yh" data-icon="&#x0041" data-radio-ckd="true" data-yh-type="'+i+'" commerceItemId-val="'+commerceitemid+'" promotionId-val="'+data[i].promId+'">';
					result += '<i ></i>';
				}else{
					result += '<li class="flexbox" data-radio="yh" data-icon="&#x0041" data-radio-ckd="false" data-yh-type="'+i+'" commerceItemId-val="'+commerceitemid+'" promotionId-val="'+data[i].promId+'">';
					result += '<i ></i>';
				}
                result += '<p class="flex1">';
                result += '<span class="youhui">'+data[i].promDesc+'</span></p>'
                result += '</li>';
            }
			result += '<input type="hidden" id="default_shippingId" value="'+shippingId+'"><input type="hidden" id="default_val" value="'+commerceitemid+'">';
            return result;
        }
    };
    /**
     * 暴露类到全局域
     */
    window.YouHuiSlider = YouHuiSlider;
})();
