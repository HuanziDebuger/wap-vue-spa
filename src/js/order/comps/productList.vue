<template>
    <page>
        <navigator>配送商品清单</navigator>
        <!--配送时间-->
        <sendTime v-if="source"></sendTime>
        <!--自营商品列表-->
        <ProductList v-if="source && source.shopCartDeliverInfoList" :source="source.shopCartDeliverInfoList"></ProductList>
        
        <!--第三方店铺商品列表-->
        <!--<ProductList v-if="source && source.shopCartInfoList" :source="source.shopCartInfoList"></ProductList>-->
        <div class="fixed-btn-blocker"></div>
        <div class="fixed-btn-container">
            <btn @click.native="save" :className="'default red block'">确定</btn>
        </div>
    </page>
</template>
<script>
    import Vue from 'vue';
    import {Page, Product,RadioItem,RadioMixin, Button, Toast} from 'gome-ui-kit';
    import http from 'gome-utils-http';
    import query from 'gome-utils-query';
    import sendTime from './productList/sendTime.vue';
    import ProductList from '../widgets/productList/productList.vue';
    import Nav from '../widgets/nav/nav.vue';
    import islogin from '../utils/islogin.js';
    export default Vue.extend({
        mixins: [RadioMixin],
        components: {
            product: Product,
            'radio': RadioItem,
            'page': Page,
            'sendTime':sendTime,
            ProductList,
            navigator: Nav,
            'btn': Button
        },
        data () {
            return {
                source: null,
                shippingGroups:[],
                shippingGroupId:''
            }
        },
        computed: {
        },
        created () {
            http({
                url: '//' + location.host + '/order_ajax.html',
                type: 'post',
                data: {
                    act: 'orderShippingInfo',
                    json: JSON.stringify({
                        businessType: query.parse(window.location.search).source || 1,
                    })
                }
            })
            .then(islogin)
            .then(data => {
                
                this.$store.commit('updateProductList', data)
                this.source = this.$store.state.$productList.data;
                
               
            })
            .catch(() => {
                new Toast('请求失败')
            })
        },
        methods: {
            save () {
                
                 //shippingGroups	配送单	array<object>	
                    //callconfirm	是否电话确认	string	@mock=Y
                    //comments	备注	string	@mock=
                    //fixedTime	指定日期	string	@mock=1463040000000
                    //g3ppDeliveryType	限时达、计时达类型	string	@mock=XSD
                    //shippingGroupId	配送单id	string	@mock=2568579909
                    //shippingMethod	配送方式	string	@mock=Gome Express
                    //userDeliveryTimeslot	指定时间段	string	@mock=slot12
                    //userDeliveryType	配送时间类型	string	@mock=
                    //gomeStore	门店自提点ID		
                //businessType	购物车业务类型	number	1：普通 2：团抢 3:抢购 4：预售 5：线下微店 6：送礼物 7：海外购 8：快速购;9：实体美通卡；10:电子美通卡 11:合约机运营商站点 12:拼团站点 13:极信站点
                this.shippingGroups = [];
                this.$store.state.$productList.data.shopCartDeliverInfoList.map( (item, shopIndex) => {
                    this.shippingGroupId = item.shippingGroupId;
                    this.shippingMethodData = item.shippingMethodArray.map( (method, index) => {
                            this.shippingGroups.push({
                                //一期不做
                                callconfirm: '',
                                //一期不做
                                comments: '',
                                fixedTime: this.$store.state.$productList.fixedTime, //指定日期
                                g3ppDeliveryType: '' || this.$store.state.$productList.g3ppDeliveryType, //限时达、计时达类型
                                shippingGroupId: this.shippingGroupId, //原始数据
                                shippingMethod: this.$store.state.$productList.shippingMethod[shopIndex], /*拼接的自己的数据*/
                                userDeliveryTimeslot: this.$store.state.$productList.userDeliveryTimeslot, //指定时间段
                                userDeliveryType: this.$store.getters.getCurrentDeliverTimeOption.code, //配送时间类型	
                                gomeStore: ''
                            });
                            
                    })
                    
                })
                
                http({
                    url: '//' + location.host + '/order_ajax.html',
                    type: 'post',
                    data: {
                        act: 'saveShippingmethod',
                        json: JSON.stringify({
                            // shippingGroups: [{
                            //     //一期不做
                            //     callconfirm: '',
                            //     //一期不做
                            //     comments: '',
                            //     fixedTime: '',
                            //     g3ppDeliveryType: '',
                            //     shippingGroupId: this.$store.state.$productList.data.shopCartDeliverInfoList[0].shippingGroupId,
                            //     shippingMethod: this.$store.state.$productList.data.shopCartDeliverInfoList[0].shippingMethodArray[0].shippingMethod,
                            //     userDeliveryTimeslot: '',
                            //     userDeliveryType: this.$store.getters.getCurrentDeliverTimeOption.code,
                            //     gomeStore: ''
                            // }],
                            shippingGroups:this.shippingGroups,
                            businessType: 1,
                        })
                    }
                })
                .then(data => {
                    
                    if(data.isSuccess == 'Y'){
                        this.$router.back();
                    }else{
                        new Toast(data.failReason)
                    }
                })
            },
            

        }
    })  
</script>
<style lang='less'>
    @import '../less/order.less';
    
    .product-aslider{
        .title{
            .set-line-height(1;.89rem;);
            padding-left: .35rem;
            .boxSizing();
            .border-bot(@gray-dark-border);
            color: @gray-light;
            font-size: @font-title + .02rem;
            .close{
                float: right;
                width: .5rem;
                height: .89rem;
                .flexbox();
                .flexbox.center;
                img{
                    .set-width-height(1;.28rem;);
                }
            }
        }
    }
    .product-list .item{
        background-color:@white;
        .module();
        .shop-title{
            
            font-size: @font-nm;
            color: @gray-dark;
            .set-line-height(1;.88rem;);
            span{
                
                .flexbox();
                .flexbox.v_center;
                img{
                    width:.74rem;
                    height:.34rem;
                }    
            }
        }
        .send-info{
            .flexbox();
            .hor_padding();
            margin-bottom:.3rem;
            label{
                font-size:@font-nm-sm + .02rem;
                .set-line-height(1;.48rem;);
            }
            .cont{
                .flex1();
                margin-left:.12rem;
                .radio{
                    display:@inlineBlock;
                    border-radius: .05rem;
                    margin-bottom:.14rem;
                    .set-line-height(1;.48rem;);
                    padding:0 .1rem;
                    .border-nm(@input-borcolor);
                    color: @gray;
                    font-size: .26rem;
                    margin-right: 20%;
                    
                    &.active{
                        .border-nm(@red);
                        color: @red;
                        background: url("../images/ico_check.png") no-repeat;
                        background-size: .33rem .32rem;
                    }
                    
                }
                .send_desc{
                    font-size:@font-nm-sm;
                    color:#a2a4a6;
                    line-height:@font-nm;
                }
            }
        }
    }
    .product-list .item-list li{
        margin-left:.2rem;
        padding-bottom:.2rem;
        .border-bot(@gray-dark-border);
        &:last-child {
            border-bottom: none;
        }
        .product-title{
            font-size: @font-nm-sm;
            color: @gray-dark;
            margin-bottom:.1rem;
            line-height: .3rem;
            overflow: hidden;
            word-break: break-all;
            .set-ellipsis-line(2);
            .tag{
                display:@inlineBlock;
                color: @red;
                border: 1px solid @red;
                line-height:1;
                padding: .02rem .02rem;
                border-radius: .02rem;
                margin-right: .02rem;
                font-size:@font-nm-sm - .02rem;
            }
        }
        .product-desc {
            color: @gray-light;
            font-size: @font-sm;
            line-height: .26rem;
            .set-ellipsis-line(2);
            margin-bottom:.1rem;
        }
        .shop-source{
            .flexbox();
            .flexbox.v_center;
            display:inline-flex;
            margin-bottom:.1rem;
            .set-line-height(1;.26rem;);
            font-size:.22rem;
            color:#8cbce0;
            padding: 0 .12rem;
            border-radius:.2rem;
            i{
                display:@inlineBlock;
                margin-right:.08rem;
                .set-width-height(1;.08rem;);
                background-color:@red;
                border-radius:.08rem;
            }
        }
        .tag-cont{
            margin-bottom:.2rem;
            .tag{
                .set-line-height(1;.28rem;);
                padding:0 .06rem 0 .04rem;
                color:@white;
                border-radius:.02rem;
                text-align:center;
                font-size:@font-nm-sm - .02rem;
                
                &.stock-goods{
                    background-color:#ffa03b;
                };
                &.arrival-goods{
                    background-color:#4aca8f;
                }
            }
        }
        .info{
            font-size: @font-nm;
            color:#a2a4a6;
            line-height: .32rem;
            overflow: hidden;
            .price {
                color: @red;
                margin-right: .2rem;
            }
            .num{
                float: right;
            }
        }
        .present{
            .flexbox();
            font-size: @font-nm-sm;
            color: @gray-light;
            margin-top: .06rem;
            line-height: @font-nm;
            .tag-zp {
                min-width: .8rem
            }
            .promDesc{
                .layout.flex1;
            }
        }
        .th-reason{
            .flexbox();
            .flexbox.v_center;
            float:left;
            margin-right:.24rem;
            margin-top: 0.1rem;
            font-size: @font-nm-sm;
            color:#a2a4a6;
            img {
                display: @inlineBlock;
                width:.28rem;
                margin-right: 0.04rem
            }
            &:last-child{
                margin-right:0;
            }
            .redtext{
                color:@red;
            }
        }

    }
    .product-list .product{
        .react{
            .flexbox();
        }
        .container{
            .surplus-cont{
                position:absolute;
                bottom:0;
                left:0;
                right:0;
                text-align:center;
                .set-line-height(1;.38rem;);
                font-size:@font-nm-sm;
                color:@white;
                background-color:@red;
            }
            &.img{
                .set-width-height(1;1.4rem;);
                margin-right: .14rem;
                overflow: hidden;
            }
            &.content{
                .layout.flex1;
                font-size: @font-nm;
                padding:0 .2rem 0 0;

            }
        }
    }
    .fixed-btn-container {
        position: fixed;
        bottom: 0;
        width: 100%;
        .btn{
            height: .9rem;
            line-height: .9rem;
            font-size: .34rem;
        }
    }
    .fixed-btn-blocker {
        height: .72rem;
    }
    
</style>