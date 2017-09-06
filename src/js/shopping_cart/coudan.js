var listAction = {
    cat_id  	:'',    //分类ID
    sort    	:0,     // 0：综合   1：价格(升序)；2：价格(降序)； 3：销量（降序）；4：评价（降序）；5：上架时间（降序）； 6：推荐排序
    page    	:1,     //第几页
    lastPage	:2,     //最后一页
    isAction	:0,     //是否在操作
    loader		:null,     //加载更多事件
    lastAction	:null,//禁止操作期间的最后一个操作
    crossShop	:crossShop,		//是否为联营凑单	 大数据所需标示
    isNpop		:isNpop,				//是否为联营凑单 java所需标
    act_id		:act_id,	//跨店铺活动id
    sourse		:sourse,
	promId		:promId,			//促销id
	isKdpPromotion:isKdpPromotion,	//isKdpPromotion
	
    init:function(){
        var headObj = $('#join_order_head_dom > li');
        var _this = this;
        //分类事件及参数
        headObj.eq(0).click(function(){
            if(_this.isAction > 0) return false;

            _this.sort = 0;
        })
        //价格事件及参数
        headObj.eq(1).click(function(){
            if(_this.isAction > 0) return false;
           
            if(_this.sort == 1){
                _this.sort = 2;
            }else if(_this.sort == 2){
                _this.sort = 1;
            }else{
                _this.sort = 1;
            }
            
            _this.initPage();
            _this.loadMoreEvent();
        })
        //销量事件及参数
        headObj.eq(2).click(function(){
            if(_this.isAction > 0) return false;

            _this.sort = 3;
            _this.initPage();
            _this.loadMoreEvent();
        })
        //评价事件及参数
        headObj.eq(3).click(function(){
            if(_this.isAction > 0) return false;

            _this.sort = 4;
            _this.initPage();
            _this.loadMoreEvent();
        })        
        _this.firstCount();
        _this.loadMoreEvent();
    },
    //加载凑单数据列表
    loadDataList:function(){
        if(this.isDone(this.loadDataList) == false) return false;
        var _this   = this;
        var url     = '/shop_cart/joinOrderList';
        if(_this.page >= _this.lastPage)
        {
            _this.actionDone();
            return false;
        }
        var getData = {
        		act_id		:_this.act_id, 
        		sort		:_this.sort, 
        		cat_id		:_this.cat_id,  
        		page		:_this.page, 
        		sourse		:_this.sourse, 
        		crossShop	:_this.crossShop, 
        		isKdpPromotion:_this.isKdpPromotion,
        		promId		:_this.promId
        		};

        $.get(url,getData,function(data){
            if(data.state == 0 || data.allNum == 0){
                _this.emptyError();
            }else if(data.num == 0 || _this.page > data.total){
                _this.lastPageError();
            }else{
                _this.ajaxData(data);

                if(_this.page == data.total){
                    _this.lastPageError();
                }
            }

            _this.actionDone(); 

        },'json');
    },
    //凑单ajax数据处理
    ajaxData:function(data){
    	//this.listData(data.data);
    	this.listData(data.goodsList);
        if($('.sub_nav_list').length == 0)
        {
            this.category(data.filterCatList);
        }
    },
    //凑单列表数据html处理
    listData:function(data){
        var html = this.dataHtml(data);
        if(this.page == 1){
            $('.goods_list').html(html);
        }else{
            $('.goods_list').append(html);
        }
        this.listEvent();
        this.page++;
        this.lastPage = this.page + 1;
    },
    //列表HTML拼接
    dataHtml:function(list){
    	
    	var html = '';
    	list.forEach(function(item){
    		html +='\
                <li><a class="flexbox v_center" href="'+domain_arr['WAP_ITEM_IP']+'/product-'+item['goodsNo']+'-'+item['skuID']+'.html">\
                    <div class="pic_box">\
                        <img src="'+item['productImgURL']+'">\
                    </div>\
                    <div class="info_box flex1">\
                        <p class="title ellipsis_two">';
                
    			if(item.isBbc == 'N'){
                	html +='<span class="tag">自营</span>';
                }
                
                html += item['goodsName'];
                html += '</p>\
                        <div class="price_box flexbox v_center">\
                        <strong class="price">&yen;'+item['lowestSalePrice']+'</strong>';
                //html +='<div class="icon_tag_box"><i data-icon="&#x2026;"></i> 掌上专享</div>';
                
                html +='</div>\
                        <p class="comm_num">'+item['evaluatecount']+'人评论</p>\
                    </div>\
                </a>\
                <div class="add_shop_btn iconn-31" skuId="'+item['skuID']+'" productId="'+item['goodsNo']+'"></div>\
                </li>';
    		
    	});
    	
    	return html;
    	
    },
    //分类处理
    category:function(cate){
    	var cateHtml = '<div class="main_nav_box">\
			            <ul class="main_nav_list">\
			                <li cat_id=""><a class="active" href="javascript:;">全部分类</a></li>';
        
        var childHtml = '<ul class="sub_nav_list"><li  cat_id=""><a class="active" href="javascript:;">全部分类</a></li></ul>';
        
        cate.forEach(function(item){
        	//父类
    		cateHtml += '<li cat_id="'+item['catId']+'"><a href="javascript:;">'+item['catName']+'</a></li>';
    		
    		//子类
    		childHtml += '<ul class="sub_nav_list">';
		    item['catList'].forEach(function(childCate){
            	childHtml += '<li cat_id="'+childCate['catId']+'"><a href="javascript:;">'+childCate['catName']+'</a></li>';
            }); 
    		childHtml += '</ul>';
		});
        
        cateHtml += '</ul>\
			    </div>\
			    <div class="sub_nav_box flex1">\
			        <div>'+childHtml+'</div>\
			    </div>';

        $('.category_container').html(cateHtml);

        this.cateEvent();
    },
    //分类事件处理
    cateEvent:function(){
        var _this = this;
        /*tab操作*/
        $(".tab_nav li").on('click','a',function() {
            if(_this.isAction > 0) return false;
            //价格排序特效
            var $order_tag = $('.item_price').find('.order_icon');
            if ($(this).hasClass('item_price')) {
                if ($order_tag.data('flag') == 'none' || $order_tag.data('flag') == 'down') {
                    $order_tag.addClass('up').removeClass('down');
                    $order_tag.data('flag', 'up');
                } else if ($order_tag.data('flag') == 'up') {
                    $order_tag.addClass('down').removeClass('up');
                    $order_tag.data('flag', 'down');
                }
            } else {
                $order_tag.data('flag', 'none');
                $order_tag.removeClass('up down');
            }
            
            //分类特效
            if ($(this).hasClass('item_all_category')) {
                $(".category_container,.category_mask").toggleClass('show');
                $(".category_mask")[0].addEventListener('touchmove', touchMove, false);
                $(".fold_icon").toggleClass('up');
                if ($(".category_container").hasClass('show')) {
                    mainScroll = new IScroll('.main_nav_box', {
                        mouseWheel: true,
                        checkDOMChanges: true,
                        click: true
                    });
                    subScroll = new IScroll('.sub_nav_box', {
                        mouseWheel: true,
                        checkDOMChanges: true,
                        click: true
                    });
                }
            } else {
                removeClass();
            }
            
        })
        //主分类特效
        $(".main_nav_list").on('click', 'li', function() {
            if(_this.isAction > 0) return false;

            active($(this));
            var index=$(this).index();
            $(".sub_nav_box ul").eq(index).show().siblings().hide();
        })
        //子分类特效
        $(".sub_nav_list").on('click', 'li', function() {
			if(_this.isAction > 0) return false;
            
            var seleItem=$(this).find('a').html();
            $(".item_all_category span").html(seleItem);
            $('.sub_nav_list li a').removeClass('active');
            active($(this));
            removeClass();

            _this.initPage();
            _this.cat_id = $(this).attr('cat_id');
            _this.loadMoreEvent();            

        })
        $(".category_mask").on('click',function() {
            removeClass();
        })

        function active(ele) {
            ele.siblings().find('a').removeClass('active');
            ele.find('a').addClass('active');
        }

        function removeClass() {
            $(".category_container,.category_mask").removeClass('show');
            $(".fold_icon").removeClass('up');
            $(".category_mask")[0].removeEventListener('touchmove', touchMove, false);
        }
        /*禁止滑动*/
        function touchMove(event) {
            event.preventDefault();
        }
    },
    //凑单数据加载失败处理
    listError:function(msg){
        msg = msg ? msg : '操作失败';
        alert({
            type: 'toast',
            content: msg, 
            time: 1000
        });
    },
    //加载到最后一页
    lastPageError:function(){
        $(".goods_list").append('<p class="no_more" style="text-align:center; color:#999;line-height:2rem;">没有更多商品了</p>');
        this.lastPage = this.page;
    },
    //没有商品
    emptyError:function(){
        $('.desc_tit').hide();
        $('.fixed_btn_box').hide();
        $(".goods_list").append('<li class="no-data"><div class="img"><img alt="" src="'+app_cdn+'/product_list/empty.png?v=20170727"></div><p class="tip">宝贝没找到 T_T</p></li>');
        this.lastPage = this.page;
    },     
    //重新初始化page
    initPage:function(){
        this.page = 1;
        this.lastPage = 2;
    },

    //检测前一个动作是否完成
    isDone:function(action){
        if(this.isAction > 0)
        {
            this.lastAction = action;
            return false;
        }
        $(".loading-container").show();
        this.isAction = 1;
        return true;
    },
    //动作完成
    actionDone:function(){
        this.isAction = 0;
        if(this.lastAction != null) this.lastAction();
        
        this.lastAction = null;
        $(".loading-container").hide();
    },

    //第一次显示统计
    firstCount:function(){
        this.countSend({});
    },
    //加入购物车，并重新显示统计
    addCart:function(obj){
        var getData = {skuId:$(obj).attr('skuId'), productId:$(obj).attr('productId')};
        this.countSend(getData);
    },
    //统计和第一次显示请求发送
    countSend:function(getData){
        var _this = this;
        var url   = '/shop_cart/joinOrderAdd';

        getData.sourse = this.sourse;
        getData.isNpop = this.isNpop;
        getData.promId = this.promId;
        getData.isKdpPromotion=this.isKdpPromotion;
        
        $.get(url,getData,function(data){
            if(data.isSuccess == 'Y'){
                if(data.condition){
                    if(data.discount){
                        var info = '<p>'+ data.condition +'，总计：<em class="all">'+ data.amount +'</em></p><p>'+ data.discount +'</p>';
                    }else{
                        var info = '<p>'+ data.condition +'，总计：<em class="all">'+ data.amount +'</em></p><p></p>';
                    }
                }else{
                    var info = '<p>已购买<em>0</em>件，总计：<em class="all">&yen;0.00</em></p><p>已享受优惠&yen;0.00</p>';
                }
                data.desc = data.desc ? data.desc : '';
                $('.desc_tit').html(data.desc);
                $('.price_info_box').html(info);

                if(getData.skuId){
                    var trip = data.addSuccess == 'Y' ? '已加入购物车' : '加入购物车失败';
                    alert({
                        type: 'toast',
                        content: trip, 
                        time: 1000,
                        finish: function() {
                        }
                    });
                }
            }else{
                _this.listError(data.failReason);
            }
        },'json');
    },
    //列表加载事件
    listEvent:function(){
        var _this = this;
        $(".add_shop_btn").click(function() {
            _this.addCart(this);
        })
    },
    //加载更多
    loadMoreEvent:function(){
        var _this = this;
        if(_this.loader != null){
            _this.loader = null;
            $(".goods_list").html('');
        }
        _this.loader = new Loadmore($(".goods_list")[0], {
            loadMore: function(page, done) {
               _this.loadDataList();
               if (_this.page == _this.lastPage)
               {
                    _this.loader.destroy();
               }
               done();
            },
            bottomBuffer: 300
        });        
    },
}


$(function() {

    //返回购物车
    $('.go_cart_btn').click(function(){
        window.location.href = '/shopping_cart.html';
        return;
    })

    //点击返回按钮
    $('.nav_back').on('click',function(){
    	
        if(window.history.length < 3){
            window.location.href = '/shopping_cart.html';
        }else{
			if(document.referrer)
			{
				window.location.href=document.referrer;
			}
			else
			{
				window.history.back(-1);
			}
        }
        
    })

    $('#gotop').gotop() 

    //列表数据处理
    listAction.init();
})
