/*
 * @Author: zhaoye 
 * @Date: 2017-02-04 10:11:37 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-07-21 18:38:14
 */
<template>
    <div class="product-list" v-if="source">
        <div class="tip-cont" v-if="$store.state.$productList.data.storePrompt">
            <p>{{$store.state.$productList.data.storePrompt}}</p>
        </div>
        <div class="item" v-for="(shop,shopindex) in source">
            <h3 class="shop-title">
                <span><img :src="shop.shopIcon" alt="">{{shop.shopName}}</span>
            </h3>
            <div class="send-info" v-if="shop.shippingMethodArray && shop.shippingMethodArray.length>0">
                <label>{{shop.shopDeliverDesc}}:</label>
                <div class="cont">
                    <radio v-for="(method, idx) in $store.state.$productList.shippingArray[shopindex]" 
                                :source="$store.state.$productList.shippingArray[shopindex]" 
                                :index="idx" 
                                @onClick="onRadioClick"
                                @click.native="onShippingMethod(method,shopindex)">
                    </radio>
                    
                    <p class="send_desc"  v-if="shop.isGome == 'Y'">大家电商品配送部分偏远地区需额外收取远程费</p>
                    
                </div>
            </div>
            <ul class="item-list" v-if="shop.shopGoodsList && shop.shopGoodsList.length > 0">
                <li v-for="product in shop.shopGoodsList">
                    <product :img="product.skuThumbImgUrl">
                        <div slot="mask-bottom-bar" class="surplus-cont" v-if="product.goodsStatusDesc && product.goodsStatusCode =='2'">{{product.goodsStatusDesc}}</div>
                        <div slot="content">
                            <h4 class="product-title"><span class="tag" v-if="product.goodsType=='2'">赠品</span>{{product.skuName}}</h4>
                            <p class="product-desc" v-if="product.attributes && product.attributes.length>0">
								<span v-for="attr in product.attributes">{{attr.value}}&nbsp;</span>
                            </p>
                            <span v-if="product.shareSource" class="shop-source"><i></i>来自:{{product.shareSource}}</span>
                            <p class="tag-cont" v-if="product.deliveryType!=='0'"><span class="tag stock-goods" v-if="product.deliveryType=='2'">立即自提</span><span class="tag arrival-goods" v-if="product.deliveryType=='1'">到货可提</span></p>
                            <p class="info" ><span class="price" v-if="product.originalPrice">&yen;{{product.originalPrice}}</span><span class="num">x{{product.goodsCount}}</span></p>
                            
                            <p class="present" v-for="promotion in product.itemPromList">
                                <span class="tag-zp">[{{promotion.promLabel}}]</span><span class="promDesc">{{promotion.promDesc}}</span>
                            </p>
                            <div class="th-reason-contanier">
                                <p class="th-reason" v-for="Service in product.supportService">
                                    <img v-if="Service.serviceType == '7'" src="../../images/icon_7.png" >
                                    <img v-if="Service.serviceType == '6'" src="../../images/icon_6.png">
                                    <img v-if="Service.serviceType == '10'" src="../../images/icon_15.png">
                                    <em :class="[Service.serviceType == '7' ? 'redtext' : '']">{{Service.serviceDesc}}</em>
                                </p>
                            </div>
                            <div class="installation-content" v-if="product.installDesc && product.installDesc!=='' ">{{product.installDesc}}<a :href="call(product.installTel)">{{product.installTel}}</a></div>
                        </div>
                    </product>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import {Product,RadioItem,RadioMixin} from 'gome-ui-kit'
    export default Vue.extend({
        mixins: [RadioMixin],
        //纯展示，所以用Props了
        props: ['source', 'storePrompt'],
        components: {
            product: Product,
            'radio': RadioItem,
        },
        data () {
            return {
                shippingArray: [],
                shippingMethodData: [],
                method: '',
                InfoListArray:''
            }
        },
        created () {
           this.$store.state.$productList.shippingArray = []; //配送清单配送方式集合
           
           if(this.$store.state.$productList.data.shopCartDeliverInfoList){
                this.$store.state.$productList.data.shopCartDeliverInfoList.map( (item, shopindex) => {
                 this.shippingMethodData = item.shippingMethodArray.map( (method, index) => {
                    this.method = method;
                    if(method.selected == 'Y'){
                        this.$store.state.$productList.shippingMethod[shopindex] = method.shippingMethod;
                        
                    }
                    
                    if(method.shippingFreight>0){
                        return {
                            content: method.shippingMethodName + ' 运费:￥'+method.shippingFreight,
                            shippingMethod:method.shippingMethod,
                            isActive: method.selected == 'Y' ? true : false,
                            
                        }
                    }else{
                        return {
                            content: method.shippingMethodName + ' 免运费',
                            shippingMethod:method.shippingMethod,
                            isActive: method.selected == 'Y' ? true : false,
                            
                        }
                    }
                    
                    
                })
                this.$store.state.$productList.shippingArray.push(this.shippingMethodData);
                
              
                
                
                
                
                
            })
           }
            
           
        },
        methods: {
            onShippingMethod(method,shopindex){
               this.$store.state.$productList.shippingMethod[shopindex] = method.shippingMethod;
                 
            },
            /*电话**/
            call(telphone){
                return 'tel:'+telphone;
            },
        }
    })
</script>
<style lang='less'>
    
</style>