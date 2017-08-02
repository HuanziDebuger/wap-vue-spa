/**
 * 各个购物车的主体,页面中的购物车组成的列表
 * @Author zhaoye-ds1
 * @Date 2015-09-28
 * @Last-Modified-Date: 2015-10-08 10:40
 * @Last-Modified-By: zhaoye-ds1
 */
!(function(){
    /**
     * 购物车主体类
     * @Class
     */
    var Content = function(){
        /**
         * @private
         * 闭包用的this变量
         * @type Object
         */
        var _this = this;
        /**
         * @public
         * 所包含的购物车列表
         * @type Array
         */
        this.cartList = [];
        //初始化每个购物车的控制对象，将每个对象和购物车一一绑定
        $(".container").each(function(idx,el){
            _this.cartList.push(new Cart(el,_this));
        })
		this.cartList.forEach(function(item){
			item.init();
		})
    };
    /**
     * 函数
     */
    Content.prototype = {
        /* 构造函数*/
        constructor: Content,
        /**
         * 检查每个购物车是否全都选取了
         * @public
         * @return bool 是否已经全选
         */
        isAllChecked: function(){
            var isCheckedAll = true;
            $(this.cartList).each(function(idx,cart){
                if(!cart.isCheckedAll){
                    isCheckedAll = false;
                }
            });
            return isCheckedAll;
        },
        /**
         * 选取了一个购物车，被购物车调用
         * @public
         * @return null
         */
        checkOne: function(){
            if(this.isAllChecked()){
                submit.select();
            }
			//console.log(this.getTotalPrice());
            //window.submit.totalPriceChange(this.getTotalPrice());
            //window.submit.numChange(this.getNum());
        },
        /**
         * 取消选取了一个购物车，被购物车调用
         * @public
         * @return null
         */
        uncheckOne: function(){
            submit.unselect();
            //window.submit.totalPriceChange(this.getTotalPrice());
            //window.submit.numChange(this.getNum());
        },
        /**
         * 覆盖页面后重新激活js
         * @public
         * @return null
         */
		conLoadAjaxHtml:function(){
			window.submit = new Submit();
			window.content = new Content();
			window.ybSlider = new YanBaoSlider();
			window.yhSlider = new YouHuiSlider();
			window.lingQuan = new lingQuanSlider();
			window.serviceAslider = new serviceSlider();
			window.shopp = new shopping();
			window.cdSlider = new JointVentureSlider(); //联营凑单，ajax重新激活
			$.asideSlider.AsideSlider($.aslider.init());  //动态加载滑层

			//一个标签文字显示不够多时
			$('.one_lab i').css('display','none');
			//var big_w=document.getElementsByClassName('one_style')[0].offsetWidth,
			var big_w=$('.one_style').width(),
				len=$('.activity_coupon').length;
			for(var i=0;i<len;i++){
				var small_w=$('.activity_coupon').eq(i).width();
				//var small_w=document.getElementsByClassName('activity_coupon')[i].offsetWidth;
				if(small_w>=big_w){
					$('.one_lab i:eq('+i+')').css('display','block');
				}else if(small_w<=big_w){
					$('.one_lab i:eq('+i+')').css('display','none');
				}
			}			
		},
        /**
         * 选取所有购物车
         * @public
         * @return null
         */
        selectAll: function(){
            $(this.cartList).each(function(idx,cart){
                cart.checkAll();
            });
        },
        /**
         * 取消选取所有购物车
         * @public
         * @return null
         */
        unselectAll: function(){
            $(this.cartList).each(function(idx,cart){
                cart.uncheckAll();
            });
        },
        /**
         * 获取所有购物车中的所有价格之和
         * @public
         * @return Number 所有选择的产品的价格之和
         */
        getTotalPrice: function(){
            var price = 0;
            for(var i=0; i<this.cartList.length; i++){
                price += Number(this.cartList[i].getTotalPrice());
            }
            return price;
        },
        /**
         * 获取节省了的价格
         * @public
         * @return null
         */
        getSavedPrice: function(){

        },
        /**
         * 获取所有购物车中选中的商品数量
         * @public
         * @return Number 所有购物车中选中的商品数量之和
         */
        getNum: function(){
            var num = 0;
            for(var i=0; i<this.cartList.length; i++){
                num += Number(this.cartList[i].getNum());
            }
            return num;
        },
        /**
         * 删除一个商品
         * @public
         * @return null
         */
        removeOne: function(){
			return true;
            //window.submit.totalPriceChange(this.getTotalPrice());
            //window.submit.numChange(this.getNum());
        },
        /**
         * 删除一个购物车
         * @public
         * @param cart @Cart 待删除目标购物车对象
         * @return null
         */
        removeCart: function(cart){
            for(var i=0; i<this.cartList.length; i++){
                if(this.cartList[i] == cart){
                    delete this.cartList[i];
                    this.cartList.splice(i,1);
                    return;
                }
            }
        }
    };
    /**
     * 暴露Content类
     */
    window.Content = Content;
})();
