/**
 * 猜你喜欢模块的代码逻辑
 * @Author zhaoye-ds1
 * @Date 2015-09-28
 * @Last-Modified-Date: 2015-10-08 10:44
 * @Last-Modified-By: zhaoye-ds1
 */
!(function(){
    /**
     * 猜你喜欢类
     * @Class
     */
    var GuessLike = function(){
        /**
         * 页面上猜你喜欢的dom
         * @public
         * @type jqDom
         */
        this.$el = $('.plc_idx_module.swiper_module');
        /**
         * 显示隐藏的切换按钮
         * @public
         * @type jqDom
         */
        this.$toggleBtn = this.$el.find('.guess_tit');
        /**
         * 猜你喜欢的主体dom部分
         * @public
         * @type jqDom
         */
        this.$content = this.$el.find('.content');
        /**
         * 向上的按钮
         * @public
         * @type jqDom
         */
        this.$upIcon = this.$el.find('i');
        /**
         * 向下的按钮
         * @public
         * @type jqDom
         */
        this.$downIcon = this.$el.find('.guess_tit');
        //调用插件
        /*猜你喜欢*/
		var _this = this;
		this.is_have = 'N';
		this.is_click = true;
        $('.guess_tit').on('click',function(){
			if(_this.is_have == 'N' && _this.is_click == true){
				_this.is_click = false;
				var timestamp =Date.parse(new Date());
				var posturl = 'shopping_cart_gusslike.html?dotime='+timestamp;
				var post_data = {isajax:1};
				$.post(posturl,post_data,function (data){
					if( data&&data.indexOf('li')>0){
						_this.is_have = 'Y';
						$("#swipe ul").html('');
						$("#swipe ul").html(data);	
						$("#swipe").swipeSlider({
							visibleSlides: 3.5,
							autoPlay: false,
							loop: true,
							bulletNavigation: 'link'
						});							
					}else{
                        $('.plc_idx_module').css('display','none');
                        $('#load').css('margin-bottom','5rem');
                    }				
				});
			}
        });
		this.init();
		this.a = false;
    };
    GuessLike.prototype = {
        constructor: GuessLike,
		init: function(){			
			this.$downIcon.on('click',$.proxy(this.toggle,this));
			if(window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == 'micromessenger'){
				if(typeof(weixin_flag) != "undefined"){
					if(weixin_flag == 1){
						//console.log('ok');
						this.isWeixin();
						document.getElementById("wap_address").style.display='none';
					}
				}
			}		
		},
      //添加class名字
      addClass: function( obj,value ) {
          if(!this.hasClass(obj,value))
              obj.className = obj.className?obj.className+" "+value:value;
      },
      //判断是否有class名字
      hasClass: function( obj,value ) {
		  //console.log(obj.className);
		  if(typeof obj.className == 'undefined')return false;
          var arr = obj.className.split(/\s/);
          for(var i in arr){
              if(arr[i] === value)
                  return true;
          }
          return false;
      },
      //移出class名字
      removeClass: function( obj,value ) {
		  if(typeof obj.className == 'undefined')return false;
          var cur = obj.className;
          cur = cur.split(' ');
          for(var i = 0;i<cur.length;i++){
              this.lrReplace(cur[i]);
              if(cur[i] == value){
                delete cur[i];
                cur.length-=1;
              }
          }
          if(cur.length>1){
            obj.className = cur.join(' ');
          }else if(cur.length==1){
            obj.className =cur[0];
          }else if(cur.length==0){
             obj.className='';
          }
      },
      //去除字符串左右两边的空格
      lrReplace:function (text){
        if (typeof(text) == "string")
        {
          return text.replace(/^\s*|\s*$/g, "");
        }
        else
        {
          return text;
        }
      },
	  //自定义class选择器
	getClassName:function(ParentId,NewClassName){
	    var AllClassElem = ParentId.getElementsByTagName('*');
	    var AllClass = [];
	    var i=0;
	    for(var i=0; i<AllClassElem.length; i++){
	        if(AllClassElem[i].className==NewClassName){
	            AllClass.push(AllClassElem[i]);
	        }
	    }
	    return AllClass;
	},	  
        /**
         * 是否是微信
         * @public
         * @event
         * @return null
         */
		isWeixin:function(){
			var _this = this;
			var fixNav=document.createElement('section'),
			clicknum=0;
			fixNav.className="fix_nav";
			fixNav.id="fix_nav";
			//fixNav.style.display = 'none';
			document.getElementById("wap_address").style.display='none';
			strHtml = "<ul>\n<li id=\"switch_bar\">\n<div id=\"switch\">\n</div>\n</li>\n<li class=\"nav\">\n<a href=\""+home_url+"\"><div class=\"home\">\n</div>\n</a>\n</li>\n<li class=\"nav\">\n<a href=\""+class_url+"\"><div class=\"classify\">\n</div>\n</a>\n</li>\n<li class=\"nav\">\n<a href=\""+shopping_cart_url+"\"><div class=\"trolley\">\n</div>\n</a>\n</li>\n<li class=\"nav\">\n<a href=\""+my_gome_url+"\"><div class=\"mygome\">\n</div>\n</a>\n</li>\n</ul>\n";
			fixNav.innerHTML = strHtml;
			document.body.appendChild(fixNav);
			document.getElementById("switch").addEventListener("click",kaiguan);
			function kaiguan(){
				var navs = _this.getClassName(fixNav,"nav");
				if(clicknum%2==0){  
					_this.addClass($('#switch'),'close');
					setTimeout(function (){
						fixNav.style.width = "100%";
						document.getElementById("switch_bar").setAttribute("style","width:20%;float:left;");
						for (var i=0; i<navs.length; i++) {
							navs[i].setAttribute("style","display:block;float:left;width:20%;");
						}
					},300);
				}else{
					_this.removeClass($('#switch'),'close');
					setTimeout(function (){
						fixNav.style.width = "20%";
						document.getElementById("switch_bar").setAttribute("style","");
						for (var i=0; i<navs.length; i++) {
							navs[i].setAttribute("style","display:none;");
						}
					},100);
				}
				clicknum++;
			}
		},
        /**
         * 切换向上和向下的按钮
         * @public
         * @event
         * @return null
         */
        toggle: function(){
    			if(this.a == true && this.is_have == 'N'){
    				if(this.is_have == 'Y' || this.is_click == false)
    					return
    			}else{
            if(this.a == true)
            {
              var s=s_gi(s_account);
              s.linkTrackVars = "eVar39";
              s.eVar39 = "购物车页面:猜你喜欢下拉按钮";
              s.tl(this,'o','购物车');
            }

            this.a = true;

    			}				
            this.$content.toggle();
            this.$upIcon.toggleClass('up');
        },
        /**
         * 猜你喜欢跳转详情页面
         * @public
         * @event
         * @return null
         */		
		/*jump_pro_detail: function(goods_jump_url){
			console.log(goods_jump_url);
		},*/
    };
    /**
     * 暴露GuessLike类
     */
    window.GuessLike = GuessLike;
})();
