/**
 * 换购滑层的逻辑
 * @Author baishuang
 * @Date 2016-06-21
 * @Last-Modified-Date: 2016-06-21
 * @Last-Modified-By: baishuang
 */
!(function() {
    /**
     * 换购滑层类
     * @Class
     */
    var replaceSlider = function() {
        /**
         * 换购滑层的dom
         * @type jqDom
         */
        this.$el = $('[data-aslider="replace_aslider"]');
        /**
         * 选项列表
         * @type jqDom
         */
        this.$list = this.$el.find('ul');
        /**
         * 确定按钮
         * @type jqDom
         */
        this.$ok = this.$el.find('.sure_btn');
        /**
         * 选定个数
         * @type jqDom
         */
        this.sele_num= this.$el.find('.sel_num');
        //事件侦听
        this.$ok.on('click', $.proxy(this.onOk, this));
        this.$el.on('click', '.close', $.proxy(this.onClose, this));

    };

    replaceSlider.prototype = {
        constructor: replaceSlider,
        prom_id:null,
        max_num:null,
        init_num:0,
        init_select:null,

        /**
         * 当显示此滑层时，获取触发滑层的商品
         * @public
         * @param product 触发换购滑层的商品
         * @return null
         */
        show: function(cart) {
            var hgClickBtn = event.target;

            //点击埋码
            var s=s_gi(s_account);
            s.eVar39="购物车页面:查看换购";
            s.tl(this,'o','购物车页面');

            this.cart = cart;
            this.prom_id   = $(hgClickBtn).attr('prom_id');
            this.max_num   = $(hgClickBtn).attr('max_num');
            this.init_num  = $(hgClickBtn).attr('select_num');

            $('.price_info_box em').eq(0).html(this.init_num);
            $('.price_info_box em').eq(1).html(this.max_num);
            
            //TOREMOVE
            setTimeout($.proxy(this.loadSuccess, this), 300);
        },
        /**
         * ajax请求换购信息完成的响应函数
         * @private
         * @param data JSON?EventTarget? 根据ajax返回值而定
         * @return null
         */
        loadSuccess: function() {
            var _this = this;
            this.$list.append(this.template());
            var _sele_num=this.sele_num;
            this.$el.find('[data-checkbox="hg"]').iCheck({
                onChange: function(val, el, group) {
                    var idx = $(el).attr('idx');
                    var p_s = $(el).attr('p_id') + '_' + $(el).attr('s_id');

                    if($(el).hasClass('checked')){
                        if(_this.init_num < _this.max_num  && $(el).attr('is_true') == 'Y'){
                            _this.init_num++;
                            _this.init_select[idx] = p_s;

                            _sele_num.html(_this.init_num);
                        }else{
                            var trip_info = '您最多可换购'+ _this.max_num +'件';

                            if($(el).attr('is_true') == 'N'){
                                trip_info = $(el).attr('false_info');
                            }

                            alert({
                                type: 'toast',
                                content: trip_info,
                                time: 1000,
                            });                            
                            $(el).removeClass('checked')
                            return false;                            
                        }
                    }else{
                        _this.init_num--;
                        _sele_num.html(_this.init_num);
                        delete _this.init_select[idx];
                    }
                }
            });
           // this.$ok.show();
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
            var url = '/shop_cart/addCart';
            var request = {};
            
            request.p_id = this.prom_id;

            request.p_s  = '';
            for (var i in this.init_select) {
                request.p_s += ',' + this.init_select[i];
            };
            request.p_s = request.p_s.substr(1);

            /*确定按钮操作*/
            $.get(url,request,function(d){
                if(d.isSuccess == 'N')
                {
                    alert({
                        type: 'toast',
                        content: d.failReason,
                        time: 1000,
                    });
                }
                else
                {
                    window.location.reload();
                }
            },'json');
        },
        /**
         * 换购选项列表视图模板，用来根据后台返回的值，渲染出换购列表
         * @private
         * @param data JSON 通过ajax得到的数据
         * @return HtmlText 字符串形式的html文本
         */
        template: function() {
            var result = '';
            this.init_select = [];
            for (var i in hgList[this.prom_id]) {
                var hgData = hgList[this.prom_id][i];

                result += '<li class="flexbox v_center">'
                result += '<span class="checkbox'
                if(hgData.isSelected == 'Y')
                {
                    result += ' checked';
                    this.init_select[i] = hgData.productId + '_' + hgData.skuId;
                }
                result += '" data-checkbox="hg" idx="'+i+'" p_id="'+hgData.productId+'" s_id="'+hgData.skuId+'" is_true="'+hgData.canSelect+'" false_info="'+(hgData.unSelectReason ? hgData.unSelectReason : '')+'"></span>'
                result += '<div class="goods flex1 '+ (hgData.canSelect == 'Y' ? '' : 'no-op') +'">'
                result += '<a href="'+domain_arr.WAP_ITEM_IP+'/product-'+ hgData.productId +'-'+ hgData.skuId +'.html">'
                result += '<div class="img_box">'
                result += '<img src='+hgData.imgUrl+'></div>'
                result += '<div class="goods_info_box flex1">'
                result += '<p class="title ellipsis_two">' + hgData.skuName + '</p>'
                result += '<strong>&yen;' + hgData.price + '</strong>'
                result += '</div></a></div></li>';
            }
            return result;
        }
    };
    /**
     * 暴露类到全局域
     */
    window.replaceSlider = replaceSlider;
})();