/*
 * @Author: zhaoye 
 * @Date: 2017-07-29 20:44:12 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-30 02:10:15
 */
<template>
    <Product
        class="main-product" 
        :href="jump(data.goodsNo, data.skuID)"
        :img="data.productImgURL">
        <div slot="content">
            <p class="title"><span class="tag">自营</span>{{data.goodsName}}</p>
            <p class="price"><em>&yen;{{data.lowestSalePrice}}</em></p>
            <p class="comment"><small>{{data.evaluatecount}}人评论</small></p>
            <i @click="buy($event)" class="btn-buy">B</i>
        </div>
    </Product>
</template>
<script>
import {Product, Toast} from 'gome-ui-kit'
import host from 'gome-utils-host'
export default {
    props: ['data'],
    components: {
        Product,
    },
    methods: {
        jump (goodsNo, skuID) {
            return `${host.item}/product-${goodsNo}-${skuID}.html`
        },
        async buy (e) {
            e.stopPropagation()
            e.preventDefault()
            try {
                await this.$store.dispatch('addProductToCart', {goodsNo: this.data.goodsNo, skuID: this.data.skuID})
                new Toast('成功添加到购物车')
            } catch(e) {
                new Toast(e.message)
            }
        }
    },
}
</script>

<style lang="less">
@import "~gome-ui-kit/components/less/var.less";
@import "~gome-ui-kit/components/less/utils.less";
@import "~gome-ui-kit/components/less/layout.less";

.product.main-product {
    font-size: @font-nm;
    a {
        padding: .2rem 0 0 .1rem;
        .flexbox();
        .container{
            &.img {
                padding: .2rem;
                width: 2rem;
                height: 2rem;
                margin-right: .1rem;
                background-color: @white;
            }
            &.content {
                .flexitem(1);
                position: relative;
                border-bottom: .02rem solid @gray-border;
                color: @font-color-dark;
                .title {
                    margin-bottom: .2rem;
                    margin-right: .2rem;
                    line-height: 1.3;
                    .set-ellipsis-line(2);
                    .tag {
                        display: inline-block;
                        color: @red;
                        border: .02rem solid @red;
                        border-radius: .04rem;
                        padding: @font-sm/2 + .02rem .03rem @font-sm/2 + .01rem .02rem;
                        font-size: @font-sm;
                        line-height: 0;
                        margin-right: .1rem;
                        -webkit-transform: translateY(-.03rem);
                        transform: translateY(-.03rem);
                    }
                }
                .price {
                    margin-bottom: .1rem;
                    em {
                        color: @red;
                        font-size: @font-lg - .02rem;
                    }
                }
                .comment {
                    margin-bottom: .5rem;
                    small {
                        color: @font-color-light;
                        font-size: @font-nm-sm;
                    }
                }
                
                .btn-buy {
                    position: absolute;
                    right: .2rem;
                    bottom: .2rem;
                    width: .7rem;
                    height: .7rem;
                    border: .02rem solid @gray-border;
                    border-radius: 100%;
                    text-align: center;
                }
            }
        }
    }
    &:last-child {
        margin-bottom: .88rem;
    }
}
</style>

