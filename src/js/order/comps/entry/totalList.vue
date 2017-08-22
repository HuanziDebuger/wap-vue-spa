<template>
    <div>
        <ul class="total-list">
            <li>
                <span>商品总计</span>
                <span class="money">&yen;{{$store.state.data.orderAmount}}</span>
                <span class="num">{{$store.state.data.orderProdCount}}件</span>
            </li>
            <li>
                <span>运费<em class="weight" v-if="$store.state.data.qqbhSuttle">({{$store.state.data.qqbhSuttle}})</em><em class="rule-icon" @click="showFreight()" v-if="$store.state.data.freight>0"></em></span>
                <span class="money">+&yen;{{$store.state.data.freight}}</span>
            </li>
            <li v-if="$store.state.data.prepaidCardAomount>0">
                <span>美通卡</span>
                <span class="money">-&yen;{{$store.state.data.prepaidCardAomount}}</span>
            </li>
            <li v-if="$store.state.data.promDiscount>0">
                <span>促销优惠</span>
                <span class="money">-&yen;{{$store.state.data.promDiscount}}</span>
            </li>
            <li v-if="$store.state.data.usedTicketAmount>0">
                <span>使用优惠券</span>
                <span class="money">-&yen;{{$store.state.data.usedTicketAmount}}</span>
            </li>
            <li v-if="$store.state.data.payBalance>0">
                <span>使用国美币</span>
                <span class="money">-&yen;{{$store.state.data.payBalance}}</span>
            </li>
            <li v-if="$store.state.data.usedMybAmount>0">
                <span>使用美盈宝余额</span>
                <span class="money">-&yen;{{$store.state.data.usedMybAmount}}</span>
            </li>
            <li v-if="$store.state.data.availablePoint>0 && $store.state.data.isUseGomePoint=='Y'">
                <span>使用美豆</span>
                <span class="money">-&yen;{{$store.state.data.availablePoint}}</span>
            </li>
            <li v-if="$store.state.data.usedKeytAmount && $store.state.data.canUseKeyt=='Y' && $store.state.data.keytStatus=='1'">
                <span>使用美口令</span>
                <span class="money">-{{$store.state.data.usedKeytAmount}}</span>
            </li>
        </ul>
            <caside ref="aslider" :dontRoute="true" :position="60" :direction="'bottom'" class="freight-details" v-show="$store.state.$freight.data">
                <h3>运费详情</h3>
                <scroller :direction="'vertical'"  class="scroll-details">
                    <!--国美自营-->    
                    <div class="details-list" v-if="$store.state.$freight.data && $store.state.$freight.data.gomeFreightList">
                        <p class="shop-title"><span class="name">{{$store.state.$freight.data.gomeShopName}}</span> <span class="freight">运费:&nbsp;{{$store.state.$freight.data.gomeFreight}}</span></p>
                        <div class="item" v-for="(item,index) in $store.state.$freight.data.gomeFreightList">
                            <p class="desc"><span>{{item.shopName}}</span><span>{{item.shippingFreight}}</span><span v-if="item.weight">重量:{{item.weight}}</span></p>
                            <scroller :direction="'horizontal'" class="product-cont">
                                <div v-for="(imgs,index) in item.shopGoodsList" class="img-box">
                                    <img :src="imgs.skuThumbImgUrl">
                                </div>
                            </scroller>
                        </div>
                    </div>
                    <!--国美联营-->   
                    <div class="details-list" v-if="$store.state.$freight.data && $store.state.$freight.data.shopFreightList" v-for="(item,index) in $store.state.$freight.data.shopFreightList">
                        <p class="shop-title"><span class="name">{{item.shopName}}</span> <span class="freight">运费:&nbsp;{{item.shippingFreight}}</span></p>
                        <div class="item">
                            <scroller :direction="'horizontal'" class="product-cont">
                                <div v-for="(imgs,index) in item.shopGoodsList" class="img-box">
                                  
                                    <CImage :src="imgs.skuThumbImgUrl"></CImage>
                                </div>
                            </scroller>
                            
                        </div>
                    </div>
                    
                </scroller>
                <div class="freight-total">
                    <span>运费总计:<em>&nbsp;{{$store.state.$freight.data.orderFreight}}</em></span>
                    <a :href="$store.state.$freight.data.freightUrl" class="rule">了解运费规则</a>
                    
                </div>
                <btn :className='"default red"' @click.native="$refs.aslider.out()">知道了</btn>
                
            </caside>
        
        
        
    </div>
    
</template>
<script>
    import Vue from 'vue';
    import Lazyload from 'gome-ui-lazyload';
    import {Button,CImage,Swiper, Slider,Aside, Scroller,} from 'gome-ui-kit';
    export default Vue.extend({
        components: {
            'btn': Button,
            'caside':Aside,
            'CImage':CImage,
            swiper: Swiper,
            slider: Slider,
            'scroller': Scroller,
        },
       
        data () {
            return {
                
                options: {
                    perSliders: 1,
                    autoPlay: false, 
                    loop: false,
                }
            }
        },
        computed: {
            
        },
        created:function(){
            
            
            
            
        },
        methods:{
            async showFreight(){
               if(this.$store.state.$freight.data){
                   this.$refs.aslider.in();
               }else{
                this.$refs.aslider.in();
                this.$store.dispatch('freight');
                  
               }
                
               
            }
        }
    });
</script>
<style lang='less'>
    @import '../../less/order.less';
    .total-list {
        background: @white;
        .module_padding();
        overflow: hidden;
        font-size: @font-dark;
    }

    .total-list li {
        .set-line-height(1;.44rem);
        overflow: hidden;
        .weight{
            margin-left:.14rem;
        }
        .rule-icon{
            display: @inlineBlock;
            .set-width-height(1;.32rem);
            .background-image-nm(url(../../images/meikouling_wrong.png));
            vertical-align: sub;
            margin-left: .18rem;
        }
    }

    .total-list li span:first-child {
        float: left;
        color: @gray-light;
    }

    .total-list li .num {
        float: right;
        margin-right: .44rem
    }

    .total-list li .money {
        float: right
    }
    .payment_info {
        margin: .2rem 0;
        padding: .17rem .22rem .17rem .28rem;
        height: 1.02rem;
        background-color:@white;
        label{
            font-size: @font-lg-sm;
            color: @gray-dark;
        };
        .int_bar{
            margin-left: .64rem;
            padding: .17rem .17rem .21rem .17rem;
            border: .02rem solid #d2d2d2;
            border-radius: 2px;
        }
        input{
            width:100%;
        }

    }
    .freight-details{
        .scroll-details{
            .flexitem(1);
        }
        .btn.default {
            width:100%;
            height:.98rem;
            line-height:.98rem;
            text-align:center;
            font-size:.34rem;
            color:@white;
            border-radius:0;
        }
        
        h3{
            height:1rem;
            line-height:1rem;
            text-align:center;
            font-size:.34rem;
            color:@gray-dark;
        }
        .details-list{
            margin-left:.24rem;
            padding:0 0 .3rem 0;
            border-bottom:1px solid #e4e4e4;
            .shop-title{
               /*  height:.68rem; */
               padding:.3rem 0 .2rem 0;
                font-size:@font-nm;
                padding-right:.24rem;
                color:@gray-dark;
                .flexbox();
                .flexbox.v_center;
                .freight{
                   .layout.flex1;
                    text-align:right;
                }
            }
            .item{
                
                .desc{
                    margin-top:.2rem;
                    font-size:@font-nm-sm + .02rem;
                    color:@gray-light;
                    span{
                        margin-right:.23rem;
                    }
                }
                .product-cont {
                    margin-top:.17rem;
                    
                }
                
                
                .img-box{
                    img{
                        float: left;
                        width: 1rem;
                        height:1rem;
                        margin-right: 0.18rem;
                    }
                }
            }
            &:last-child{
                border-bottom:none;
            }
        }
    }
    .freight-total{
        height:.76rem;
        line-height:.76rem;
        background-color:#fff7d2;
        padding:0 .24rem;
        font-size:@font-lg-sm;
        color:@gray-dark;
        .flexbox();
        .rule{
            font-size: .24rem;
            color: #999999;
            .flexitem(1);
            text-align:right;
        }
    }
    
</style>