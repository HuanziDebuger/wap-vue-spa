/*
 * @Author: zhaoye 
 * @Date: 2017-01-07 15:39:35 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-08-22 14:14:19
 */
<template>
    <div class="list">
        <ul class="gome-point-list">
            <a :href="couponHref">
                <li class="coupon">
                    <h2>优惠券</h2>
                    <div class="cont">
                        <span class="tag" v-if="$store.state.data.availableTicketCount>0">{{$store.state.data.availableTicketCount}}张可用</span><span class="desc no-coupon" v-else>暂无可用优惠券</span>
                    </div>
                    <p class="desc-cont" v-if="$store.state.data.availableTicketCount>0">
                        <span class="use-text" v-if=" $store.state.data.usedTicketAmount && $store.state.data.usedTicketAmount>0">可抵用￥{{$store.state.data.usedTicketAmount}}</span>
                        <span class="coupon-text" v-else>红券/蓝券/美券/店铺券</span>
                    </p>
                    <i class="link-ico"></i>
                </li>
            </a>
            <a :href="cardHref">
                <li class="gome-card" v-if="$store.state.data.availablePrepaidCardCount>0">
                    <h2>美通卡<span class="tag" v-if="$store.state.data.availablePrepaidCardCount>0">{{$store.state.data.availablePrepaidCardCount}}张可用</span></h2>
                    <p v-if="$store.state.data.prepaidCardAomount" class="use">{{$store.state.data.prepaidCardAomount}}</p>
                    <p v-else class="desc no-use">未使用</p>
                    <i class="link-ico"></i>

                </li>
            </a>
            <li class="beans">
                <h2>美豆</h2>
                <p class="content">
                    <span v-if="$store.state.data.points">{{$store.state.data.points}}<i class="beans-icon" id="gomeBeansUseRule" @click = "beansNoAvailable"></i></span>
                    <span v-else >暂无可用美豆</span>
                </p>
                <div class="option-container" v-if="$store.state.data.isUseGomePoint ">
                    <coption  :source="beanSource" :index="0" @onClick="onOptionClick" @click.native="useBeans()">
                        <span slot="pre">
                            <img v-if="beanSource[0].isActive && $store.state.data.availablePoint>=1" src="../../images/check_yes.png">
                            <img v-if="!beanSource[0].isActive && $store.state.data.availablePoint>=1" src="../../images/check_no.png">
                            <img v-if="$store.state.data.availablePoint<1" src="../../images/radio_no2.png">
                        </span>
                    </coption>
                </div>
            </li>
            <li class="balance" v-if="$store.state.data.balance>0">
                <h2>国美币</h2>
                <p class="content">
                     <span  v-if="$store.state.data.isBalanceAvailable=='Y'">可用￥{{$store.state.data.balance}}</span>
                     <span  v-else>{{$store.state.data.unAvailableReason}}</span>
                </p>
                <div class="option-container">
                    <coption :source="beanSource" :index="2" @onClick="onOptionClick" @click.native="useBalance()">
                        <span slot="pre">
                            <img v-if="beanSource[2].isActive || $store.state.data.payBalance && $store.state.data.payBalance>0" src="../../images/check_yes.png">
                            <img v-else src="../../images/check_no.png">
                        </span> 
                    </coption>
                </div>
            </li>
            <li class="recom-num">
                <h2 >使用推荐号</h2>
                <div class="cont flex1">
                   
                    <input type="text" v-model="this.recommendMsg" v-show="this.recommendMsgShow" @focus = 'changeRecommend'>
                    <input type="text" placeholder="请输入门店营业员编号(选填)" v-model="$store.state.recommendMsg"  @blur="onBlur" v-show="this.recommendMsgShow==false">
                    
                </div>
                <!--<coption :source="beanSource" :index="1" @onClick="onOptionClick" @click.native="ischeckedRecommend()">
                    <span slot="pre">
                        <img v-if="beanSource[1].isActive" src="../../images/check_yes.png">
                        <img v-else src="../../images/check_no.png">
                    </span> 
                </coption>-->
            </li>
        </ul>
    </div>
    
</template>
<script>
    import Vue from 'vue';
    import {Button, Modal,OptionItem, OptionMixin,Toast} from 'gome-ui-kit';
    import eventbus from 'gome-utils-eventbus';
    import query from 'gome-utils-query';
    import http from 'gome-utils-http';
    import islogin from '../../utils/islogin.js';
    export default Vue.extend({
        mixins: [OptionMixin],
        components: {
            'btn': Button,
            'coption': OptionItem,
        },
        data () {
            return {
                beanSource:[
                    {
                        isActive: this.$store.state.data.isUseGomePoint == 'Y' ? true : false,  //美豆
                    },
                    {
                        isActive: false, //推荐号
                    },
                    {
                        //isActive: this.$store.state.data.isBalanceAvailable == 'Y' ? true : false, //余额
                        isActive: false,
                    },
                ],
                recommendMsg:'',
                recommendMsgShow:false,
                //couponHref: 'order_fill_coupon.html' + window.location.search.match(//) ? s : '' +'?source='+ (query.parse(location.search).source || 1),
                //couponHref: 'order_fill_coupon.html' + window.location.search ,
                couponHref: 'order_fill_coupon.html' + (window.location.search ? window.location.search : '?source=1'),
                cardHref: 'order_fill/card' + (window.location.search ? window.location.search : '?source=1'),
            }
        },
        created(){
        },
        methods: {
            beansNoAvailable () {
                //本来是应该请求接口的但是wap就已经写死了，所以这边也先写死
               /*http({
                    url: '//' + location.host + '/index.php',
                    type: 'post',
                    data: {
                        ctl: 'order_fill',
                        act: 'getGomeBeansRuleAjax',
                    }
                })
                .then((data) => {
                    

                })
                .catch(() => {
                    new Toast('请求失败')
                    
                })*/
                new Modal({
                    data: {
                        title: '美豆使用规则',
                        htmlContent: `
                            <dl class="beans">
                                <dd>1. 美豆数量不足100不可用</dd>
                                <dd>2. 美豆支付不得超过每笔订单应付金额的50%</dd>
                                <dd>3. 单笔订单最多可使用2000美豆</dd>
                                <dd>4. 当天使用美豆总额不能大于5万美豆（含）</dd>
                                <dd>5. 单笔订单应付金额大于20元时可使用（含）</dd>
                                <dd>6. 订单中含赠豆商品时不可使用</dd>
                                <dd>使用数量为100美豆的整数倍</dd>
                                <dd>100美豆抵扣1元</dd>
                            </dl>
                        `,
                        ok: '我知道了'
                    }
                })
            },
            changeRecommend(){
                this.recommendMsgShow = false;
            },
            onBlur: function(){
               
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
                            new Toast(data.failReason);
                            return false;
                        }else{
                            this.recommendMsgShow = true;
                            
                            this.recommendMsg = data.refereeInfo;
                            
                            /* if(this.$store.state.data.isNeedPayPassword=='Y'){
                                this.password();
                            }else{
                                this.submitOrder();  
                            } */
                        }
                        
                    })
                }
            },
            useBeans(){
                //使用美豆
                this.operationType = this.beanSource[0].isActive ? '1' : '2'
                http({
                    url: '//' + location.host + '/order_ajax.html',
                    type:'post',
                    data: {
                        act: 'applyGomePoint',
                        json: JSON.stringify({
                            businessType: query.parse(window.location.search).source || '1',
                            operationType : this.operationType //选中未选中
                        })
                    }
                })
                .then(islogin)
                .then(function(data){
                    eventbus.emit('updateEntryData');
                    
                })
               
            },
            useBalance(){
                //使用余额
                if(this.beanSource[2].isActive){
                    http({
                        url: '//' + location.host + '/order_ajax.html',
                        type:'post',
                        data: {
                            act: 'virtualAccountPay', //使用
                            json: JSON.stringify({
                                businessType: query.parse(window.location.search).source || '1',
                            })
                        }
                    })
                    .then(islogin)
                    .then(function(data){
                        
                        eventbus.emit('updateEntryData');
                        
                    })
                }else{
                    http({
                        url: '//' + location.host + '/order_ajax.html',
                        type:'post',
                        data: {
                            act: 'cancelVirtualAccountPay', //取消
                            json: JSON.stringify({
                                businessType: query.parse(window.location.search).source || '1',
                            })
                        }
                    })
                    .then(islogin)
                    .then(function(data){
                        eventbus.emit('updateEntryData');
                    })
                }
                
            },
            /*推荐号*/
            ischeckedRecommend(){
                if(this.beanSource[1].isActive){
                   this.$store.state.ischeckRefereeNo = true;
                   
                }else{
                    this.$store.state.ischeckRefereeNo = false;
                    
                }
            }
        }
    });
    
</script>
<style lang='less'>
    @import '../../less/order.less';
    .gome-point-list> *:last-child {
        border-bottom: none;
    }
    .gome-point-list li{
        .flexbox();
        .flexbox.v_center;
        padding: @list-padding 0;
        padding-right: .2rem;
        .border-bot(@gray-dark-border);
        font-size: @font-dark;
        overflow: hidden;
        .no_coupon{
            margin-left: .4rem;
        };
        .tag{
            display: @inlineBlock;
            margin-left: .12rem;
            padding: 0.04rem 0.08rem;
            font-size: 0.22rem;
            color:@white;
            background-color: #ff836b;
        }
        .option{
            img{
                width: .44rem;
                height: .44rem;
            }
        }
        .desc{
            color:@gray-light;

        };
        &.coupon{
            .cont{
                .layout.flex1;
                padding-left: .15rem;
            }
            .desc-cont{
                .layout.flex2;
                .text-right();
                .use-text{
                    color: @red;
                }
            }
        };
        &.recom-num .cont{
            margin:0 .18rem; 
            input{
                .block();
                padding: .14rem .16rem;
                width:100%;
                // .border-nm(@input-borcolor);
                font-size: @font-dark;
                -webkit-appearance: none;
            }
            p{
                color: @gray-light;
            }
        };
        &.beans{
            .content{
                .layout.flex1;
                margin-left: .6rem;
                span{
                    display:block;
                }
            }
            .beans-icon{
                display: @inlineBlock;
                width: .3rem;
                height: .3rem;
                .background-image-nm(url(../../images/meikouling_wrong.png));
                vertical-align: bottom;
                margin-left: .05rem;
            }
        };
        &.balance{
            .content{
                .layout.flex1;
                margin-left: .8rem;
            }
        };


    }
    .gome-card{
        .use{
            .layout.flex1;
            .text-right();
        }
        .no-use{
            .layout.flex1;
            .text-right();
        } 
    }


    .alert {
        dl.beans {
            text-align: left;
            font-size: @font-nm;
            line-height: @font-lg;
        }
    }

</style>