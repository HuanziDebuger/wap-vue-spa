/*
 * @Author: zhudanmei 
 * @Date: 2017-01-18 16:32:47 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-08-24 14:59:23

 */
<template>
   <page>
        <navigator>填写订单</navigator>
        <div class="order-wrap" v-if="$store.state.data">
            <div class="tip-cont" v-if="$store.state.data.notice"><p><span class="tip-icon"></span>{{$store.state.data.notice}}</p></div>
            <!--地址-->
            <caddress></caddress>
            <!--商品 -->
			<router-link to="/productList">
            	<product></product>
			</router-link>
            <pickupaddress ></pickupaddress>
            <!--门店自提-->
            <router-link to="/pickupProductList">
            	<pickupGoods></pickupGoods>
			</router-link>
            <!--支付，配送，发票-->
            <infoList></infoList>
            <!--优惠劵美通卡等模块-->
            <pointList></pointList>
            <!--美口令-->
            <gome-password></gome-password>
            <!--总计-->
            <total></total>
            <!--商品无货弹层-->
            <msgbox v-if="this.$store.state.$msgbox"></msgbox>
            <!--线下缺货弹层-->
            <outgoodsmsgbox v-if="this.$store.state.$outgoods"></outgoodsmsgbox>
            <!--赠品无货弹层-->
            <giveaway></giveaway>
            <!--输入支付密码弹层-->
            <paypasswordMsgbox></paypasswordMsgbox>
            <!--设置支付密码-->
            <setpasswordMsgbox></setpasswordMsgbox>
            
        </div>
        <div class="pay-money flexbox" v-if="$store.state.data" >
            <p class="flex1" >应付金额：<span>{{$store.state.data.payAmount}}</span></p>
            <btn :className='"default red"' @click.native='submit'>提交订单</btn>
        </div>
        <transition name="aside">
            <router-view></router-view>
        </transition>
    </page>
</template>
<script>
//vue
    import Vue from 'vue';
//ui-lib
    import {Button,Toast,Page, Modal} from 'gome-ui-kit';
//utils-lib
    import http from 'gome-utils-http';
    import eventbus from 'gome-utils-eventbus';
    import query from 'gome-utils-query';
//components
    import Nav from '../widgets/nav/nav.vue';
    import Address from './entry/address.vue';
    import pickUpAddress from './entry/pickupAddress.vue';
    import InfoList from './entry/infoList.vue';
    import PointList from './entry/pointList.vue';
    import Product from './entry/product.vue';
    import pickupGoods from './entry/pickupGoods.vue';
    import Password from  './entry/password.vue';
    import totalList from './entry/totalList.vue';
    import msgbox from './entry/msgbox.vue';
    import outgoodsmsgbox from './entry/outgoodsmsgbox.vue';
    import paypasswordMsgbox from './entry/payPassword.vue';
    import setpasswordMsgbox from './entry/setPassword.vue';
    import giveaway from './entry/giveawayMsgbox.vue';
    import submitOrder from './../utils/submitOrder.vue';
    import islogin from '../utils/islogin.js';
    
    export default Vue.extend({
        mixins: [submitOrder],
        components: {
            'btn': Button,
            'page': Page,
            'caddress': Address,
            'pickupaddress': pickUpAddress,
            'infoList': InfoList,
            'pointList' : PointList,
            'product':Product,
            'pickupGoods':pickupGoods,
            'gome-password':Password,
            'total':totalList,
            'navigator': Nav,
            'msgbox':msgbox,
            'outgoodsmsgbox':outgoodsmsgbox,
            'paypasswordMsgbox':paypasswordMsgbox,
            'giveaway':giveaway,
            'setpasswordMsgbox':setpasswordMsgbox,
        },
        data () {
            return {
                outOfStockcommerceItemID:'', //缺货商品commerceItemID
                goodsListcommerceItemID:'',  //全部商品commerceItemID
                outlistNewarry:[], //线下缺货商品集合新数组
               
            }
        },
        created () {
            /*TODO 判断页面是否第一次进来，第一次取window.sourceData*/
            /*this.updateEntryData();*/
            this.$store.dispatch('updateEntryData')
            eventbus.only('updateEntryData' ,() => {
                //this.updateEntryData();
                 this.$store.dispatch('updateEntryData')
            });

            /*地理定位获取经纬度*/
            this.getLocation();
            
            /*分享功能*/
            
            if(window.navigator.userAgent.match(/MicroMessenger/i)){
                
                window.jsonResult;
                window.wechatcb = function(jsonResult){
                    //通过config接口注入权限验证配置
                    window.jsonResult = jsonResult
                }
                var wxAPIHost = location.host.match(/plus\.com/) ? 'm.gomeplus.com' : 'm.gome.com.cn';
                
                http({
                    // '//' + location.host + '/order_ajax.html',
                    url: '//'+ wxAPIHost +"/index.php",
                    data: {
                        ctl: 'product',
                        act:'getShareHandler',
                        url:encodeURIComponent(window.location.href),
                        //callback: 'wechatcb'
                        
                    },
                    type: 'jsonp',
                    isPostBody: 'Y'
                })
                .then(data => {
                    wx.config({
                        debug: false,   //生产时 更换为false
                        appId: data.appid,
                        timestamp: data.timestamp,
                        nonceStr: data.noncestr,
                        signature: data.signature,
                        jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage'],
                    });
                    
                        var imgUrl = 'http://gfs5.gomein.net.cn/T1NcbvBshj1RCvBVdK.png'
                    
                    wx.ready(function(){
                        // 分享给朋友
                        wx.onMenuShareAppMessage({
                            title: "国美-买家电、3C、日用百货,享正品低价，39元包邮，货到付款！",
                            desc: '家电标杆，更低价格，39元包邮，货到付款，国美为您提供专业、贴心、便捷的服务。',
                            link: 'http://'+wxAPIHost+'/',
                            imgUrl: imgUrl,
                            
                        });
                        // 分享到朋友圈
                        wx.onMenuShareTimeline({
                            title: "国美-买家电、3C、日用百货,享正品低价，39元包邮，货到付款！", // 分享标题
                            link: 'http://'+wxAPIHost+'/',
                            imgUrl: imgUrl, // 分享图标
                        });
                    })
                    
                })
                
            }
            /*分享功能end*/
        },
        methods:{
            /*地理定位*/
            getLocation(){
                if (navigator.geolocation){
                    navigator.geolocation.getCurrentPosition(this.handleLocationError,this.showPosition);
                }
                else{
                    console.log('该浏览器不支持获取地理位置。');
                    
                }
            },
            handleLocationError: function(error) {
                switch (error.code) {
                    case error.TIMEOUT:
                        console.log("请求超时，请再尝试哦!");
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log('对不起,获取您的定位失败!');
                        break;
                    case error.PERMISSION_DENIED:
                        console.log('您的定位服务未开启!');
                        break;
                    case error.UNKNOWN_ERROR:
                        console.log('对不起,未知的错误发生了哦!');
                        break;
                }
            },
           showPosition(position){
				if(position && position.coords){
					this.$store.state.latitude = position.coords.latitude
	                this.$store.state.longitude = position.coords.longitude
				}
            },
            //提交订单时先判断是否需要支付密码和设置支付密码
            submit(){
                    /*TODO 验证推荐人*/
                    // if(this.$store.state.ischeckRefereeNo){
                    
                    if(this.$store.state.recommendMsg){  //判断推荐号
                        http({
                            url: '//' + location.host + '/order_ajax.html',
                            type: 'post',
                            data: {
                                act: 'checkRefereeNo',
                                json: JSON.stringify({
                                    businessType: query.parse(window.location.search).source || '1',
                                    refereeNo:this.$store.state.recommendMsg
                                })
                                
                            }
                        })
                        .then(islogin)
                        .then(data => {
                            if(data.isSuccess != 'Y'){
                                // new Toast(data.failReason);
                                return false;
                            }else{
                                if(this.$store.state.data.isNeedPayPassword=='Y'){
                                   this.password();
                                }else{
                                   this.submitOrder();  
                                }
                            }
                            
                        })
                    }else if(this.$store.state.data.isNeedPayPassword=='Y'){   /*是否需要支付密码*/
                                this.password();
                            }else{
                                this.submitOrder();
                            }
                    
                   
                    
            },
            //选择国美币支付判断支付密码
            password(){
                if(this.$store.state.data.isNeedPayPassword=='Y' && (this.$store.state.data.virtualAccountStatus=='0' || this.$store.state.data.virtualAccountStatus=='-2') ){
                    this.$store.state.$setPassword.isModalShow = true;

                }else if(this.$store.state.data.isNeedPayPassword=='Y' && this.$store.state.data.virtualAccountStatus=='1'){
                    this.$store.state.$payPassword.isModalShow = true;
                }else{
                    this.submitOrder();  
                }
            },
            maima () {
				try{
					 /*埋码*/
						var omniture_str=document.getElementById("goods_name_val");
						var omniture_str_order = document.getElementById("order_name_val");
						var tmpstr = "";
						var skutype ='普通';
						if(window.sourceData.logisticsGoodsInfo && window.sourceData.logisticsGoodsInfo.goodsList){
							for(var i=0;i < window.sourceData.logisticsGoodsInfo.goodsList.length;i++){
								
								tmpstr += ";"+window.sourceData.logisticsGoodsInfo.goodsList[i].goodsNo+";;;;eVar33=|eVar22=|eVar50=普通," ;
								omniture_str_order.value += ";"+ window.sourceData.logisticsGoodsInfo.goodsList[i].goodsNo + ";"+ window.sourceData.logisticsGoodsInfo.goodsList[i].goodsCount+";"+ window.sourceData.logisticsGoodsInfo.goodsList[i].totalPrice + ","
							
							}
						}
						
						if(window.sourceData.pickupGoodsInfo && window.sourceData.pickupGoodsInfo.goodsList){
							var pickupGoodsInfo = window.sourceData.pickupGoodsInfo;
							var pickupGoods = pickupGoodsInfo.goodsList;
							for(var i=0;i < pickupGoods.length;i++){
								tmpstr += ";"+pickupGoods[i].goodsNo+";;;;eVar33=|eVar22=|eVar50=普通," ;
								omniture_str_order.value += ";"+ pickupGoods[i].goodsNo + ";"+ pickupGoods[i].goodsCount+";"+ pickupGoods[i].totalPrice + ","
								
							}
						}
						omniture_str.value = tmpstr;
						var doSCode = function(){
							var omniture_goods_str = "";
							s.products = omniture_str.value;
							s.events = "scCheckout";
							s.pageName    = "购物车流程:提交订单";
							s.channel     = "购物车流程";
							s.prop1       = "购物车流程:提交订单";
							s.prop2       = "购物车流程:提交订单";
							s.prop3       = "购物车流程:提交订单:首页";
							s.prop4       = "购物流程:提交订单";
							s_code = s.t();
						}
					if(document.querySelector('#maima')){
							doSCode();
					}else{
							var newScript = document.createElement('script');
							newScript.id="maima";
							newScript.src = '//js.gomein.net.cn/plus/js/public/omniture/s_code.js?v=20160908';
							document.body.appendChild(newScript);
							newScript.onload = doSCode;
					}
				}catch(e){
					//do nothing
				}
            },
            updateEntryData () {
                /*订单接口v3接口*/	
                http({
                    url: '//' + location.host +'/order_ajax.html',
                    type: 'post',
                    data: {
                        act: 'mobileCheckoutDetailV3',
                        json: JSON.stringify({
                            businessType: query.parse(window.location.search).source || 1,
                        })
                    },
                    // isPostBody:'Y'
                })
                .then(islogin)
                .then(data => {
                    if(data.isSuccess == 'Y'){
                        window.sourceData = data;
                        
                        this.maima();
                        this.$store.commit('update', data);
                        this.initAddress(data);
                        if(data.successMessage){  //新用户没有收货地址，提示框
                            new Modal({
                                data:{
                                    title: '提示',
                                    content: data.successMessage,
                                    hasClose: false,
                                    ok:'我知道了',
                                    classname: 'emptyAddressMsgbox'
                                },
                           
                            })
                        }
                        /*判断页面是否是第一次进来，第一次进来不弹框*/
                        if(this.$store.state.isfirst){
                            this.$store.commit('alreadyentered', data);
                            return;
                        }
                        this.outOfStock(data);
                        
                    }else{
                        if(data.failCode == '0010010070'){
                            new Modal({
                                data:{
                                    title: '',
                                    content: '您已提交过一次，请勿重复提交，您可以在查看订单中继续支付',
                                    hasClose: false,
                                    ok:'查看订单',
                                    cancel:'返回购物车',
                                    classname: ''
                                },
                                created () {
                                    this.$on('cancel', () => {
                                        this.close();
                                        window.location.href = "//"+ location.host +"/shopping_cart.html";
                                       
                                    })
                                    this.$on('ok', () => {
                                        this.close();
                                        window.location.href = "//"+ location.host.replace('cart.','u.') +"/my_order.html";
                                    })
                                    
                                }
                            })
                        }
                        
                    }
                })
				.catch(e => {
					new Toast(e.message)
				})
            },
            initAddress (data) {
                if(data.address){
                    this.$nextTick(() => {
                        this.$store.commit('addressSelector/setAddressCode', { //地址
                            province_id: data.address.provinceId,
                            city_id: data.address.cityId,
                            district_id: data.address.districtId,
                            town_id: data.address.townId,
                        })
                        this.$store.commit('addressSelector/setCurrentArea', [
                            {
                                name: data.address.provinceName,
                                code: data.address.provinceId,
                            },
                            {
                                name: data.address.cityName,
                                code: data.address.cityId,
                            },
                            {
                                name: data.address.districtName,
                                code: data.address.districtId,
                            },
                            {
                                name: data.address.townName,
                                code: data.address.townId,
                            }
                        ]);
                    })
                }
            },
            outOfStock (data) {
                
                if(data.isShowOutOfStock){ //是否提示无货商品信息	 N :无缺货，0 :线下缺货 1：普通商品缺货 2:门店无货
                    //是否显示无货提示信息
                    var _this = this;
                    if(data.isShowOutOfStock=='0' && data.outOfStockList.length>0){
                        /*组成一个新的数组传到弹出框中*/
                          _this.outlistNewarry=[];
                        /*将缺货商品commerceItemID和全部商品commerceItemID做对比，符合的将添加到新数组中，弹出线下缺货弹层*/
                        data.outOfStockList.map( (item, index) => {
                            _this.outOfStockcommerceItemID = item;
                            data.logisticsGoodsInfo.goodsList.map( (goosListItem, index) => {
                                _this.goodsListcommerceItemID = goosListItem.commerceItemID;
                                if(_this.outOfStockcommerceItemID == _this.goodsListcommerceItemID){
                                    _this.outlistNewarry.push(goosListItem);
                                }
                                this.$store.commit('updateoutOfStockdata', _this.outlistNewarry);
                                this.$store.state.$outgoods.isModalShow = true;
                            })
                        })
                    }else if(data.isShowOutOfStock=='2'){
                        /*门店缺货弹层*/
                        // new Modal({
                        //     data:{
                        //         title: '',
                        //         content: data.outOfStockMes,
                        //         hasClose: false,
                        //         ok:'配送到家',
                        //         cancel:'修改门店',
                        //         classname: ''
                        //     },
                        //     created () {
                        //         this.$on('cancel', () => {
                        //             this.close();
                        //             _this.$router.push('/storeAddress');
                        //         })
                        //         this.$on('ok', () => {
                                    
                        //             /*请求取消门店*/
                        //             http({
                        //                 url: '//' + location.host + '/order_ajax.html',
                        //                 type:'post',
                        //                 data: {
                        //                     act: 'selectStorePickUp',
                        //                     json: JSON.stringify({
                        //                         businessType: query.parse(window.location.search).source || 1,
                        //                         operationType: 1,  //操作类型 0 :勾选 1：取消
                        //                         storeAddressId: data.storeAddress.addressId //门店id
                        //                     })
                        //                 }
                        //             })
                        //             .then(data => {
                        //                 if(data.isSuccess == 'Y'){
                        //                     eventbus.emit('updateEntryData')
                        //                 }else{
                        //                     new Toast(data.failReason);
                        //                 }
                        //             })
                        //         })
                        //     }
                        // })
                    }
                            
                }
            },
            
        },
    });


</script>

<style lang='less'>
	@import '../less/order.less';
	
    .alert .window {
        border-radius: .15rem;
        .title{
            font-size:@font-lg-sm !important;
            
        }
        .content{
            line-height:.4rem;
        }
        .btn-container .btn{
            border-radius: 0 0 .15rem .15rem;
            &:first-child:not(:only-child){
                border-radius: 0 0 0 .15rem;
            }
        }
        .close{
            border-radius: .2rem;
        }
    }
    .emptyAddressMsgbox .window {
        .title{
            padding:0.2rem 0;
        }
    }
    .page{
        background:none;
    }
    .test-enter-active {
        transition: all .5s ease;
    }
    .test-leave-active {
        transition: all .5s ease;
        transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
    }
    .test-enter {
        transform: translate3d(100%, 0, 0);
    }
    .test-leave-active {
        transform: translate3d(-100%, 0, 0);
     }
    .order-wrap{
        padding-bottom: .82rem;
    }
    .link-ico {
        .flexbox();
        .flexbox.v_center;
        width: .13rem;
        height: .26rem;
        margin-left: .15rem;
        .background-image-nm(url(../images/arrow.png));
        .boxSizing()
    }
    .pay-money {
        .fixed-btn();
        .set-line-height(1;.92rem;);
        .btn {
			&.default {
				line-height: .92rem;
				width: 2rem;
				box-sizing: border-box;
				text-align: center;
				font-size:@font-lg-sm;
				border-radius: 0;
			}
        };
        p{
            font-size: @font-lg-sm - .02rem;
            .border-top(@input-borcolor);
            .text-right();
            padding-right: .2rem;
            .set-line-height(1;.92rem;);
            span{
                color: @red;
                font-weight: 700
            }
        }
    }
	//copy from pickupProductList.vue
    .tip-cont{
        padding:.16rem .2rem;
        background-color:#fff7d2;
        font-size: @font-dark;
        color:#ff8000;
        p{
            .flexbox();
            .flexbox.v_center;
            line-height:.3rem;
            .tip-icon{
                display: @inlineBlock;
                margin-right:.13rem;
                .set-width-height(1;.34rem;);
                .background-image-nm(url(../images/common_icon_tixing.png));
            }
        }
    }
</style>