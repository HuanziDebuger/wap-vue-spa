<template>
    <page>
        <navigator>自提商品清单</navigator>
        <!--自提商品列表-->
        <ProductList v-if="source.shopCartInfoList" :source="source.shopCartInfoList" :storePrompt="source.storePrompt"></ProductList>
    </page>
</template>
<script>
    import Vue from 'vue';
    import {Page, Product,} from 'gome-ui-kit';
    import { mapGetters } from 'vuex';
    import http from 'gome-utils-http';
    import query from 'gome-utils-query';
    import ProductList from '../widgets/productList/productList.vue';
    import Nav from '../widgets/nav/nav.vue';
    import islogin from '../utils/islogin.js';
    export default Vue.extend({
        
        components: {
            product: Product,
            'page': Page,
            ProductList,
            navigator: Nav
        },
        data () {
            return {
                source:{},
            }
        },
        computed: {
        },
        created () {
            http({
                url: '//' + location.host + '/order_ajax.html',
                type: 'post',
                data: {
                    act: 'storePickShippingInfo',
                    json: JSON.stringify({
                        businessType: query.parse(window.location.search).source || 1,
                    })
                }
            })
            .then(islogin)
            .then((data) => {
                
                this.$store.commit('updateProductList', data)
                this.source = this.$store.state.$productList.data; 
               
            })
            .catch(() => {
                new Toast('请求失败')
            })
        },
        methods: {
            
        }
    })  
</script>
<style lang='less'>
    @import '../less/order.less';
    .tip-cont{
       
        padding:.16rem .2rem;
        background-color:#fff7d2;
        font-size:@font-dark;
        color:#ff8000;
        p{
            .flexbox();
            .flexbox.v_center;
            line-height:.3rem;
            .tip-icon{
                display:@inlineBlock;
                margin-right:.13rem;
                .set-width-height(1;.34rem;);
                .background-image-nm(url(../images/common_icon_tixing.png));
            }
        }
        
    }
</style>