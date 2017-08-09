/*
 * @Author: zhaoye 
 * @Date: 2017-07-29 14:50:15 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-30 01:43:21
 */
<template>
    <Page id="app">
        <nav>
            <i><</i>
            凑单-dev
        </nav>
        <catagory  v-if="$store.state.filterCatList && $store.state.filterCatList.length > 0"></catagory>
        <p v-if="$store.state.filterCatList && $store.state.filterCatList.length > 0" class="desc">{{$store.state.globalState.desc}}</p>
        <div class="product-list-container">
            <Product v-for="item in $store.state.goodsList" :data="item"></Product>
            <div class="loading" >加载中...</div>
        </div>
        <div class="bottom-nav">
            <div class="bottom-nav-content">
                <p class="tip">{{$store.state.globalState.condition}}，总计:<em>{{$store.state.globalState.amount}}</em></p>
                <p class="sub-tip">{{$store.state.globalState.discount}}</p>
            </div>
            <Button @click.native="showGiftBox" class="default yellow yellow-F6A623">领取赠品</Button>
            <Button class="default">去购物车</Button>
        </div>
        <!--此处渲染赠品盒子内容组件-->
        <giftBox ref="giftBox"></giftBox>
    </Page>
</template>
<script>
import {RadioItem, RadioMixin, Page, Scroller, Button, Gotop, Aside} from 'gome-ui-kit'
import Product from './entry/product.vue'
import catagory from './entry/catagory.vue'
import eventbus from 'gome-utils-eventbus'
import giftBox from './entry/joinOrder_giftBox.vue'
export default {
    components: {
        giftBox,
        Radio: RadioItem,
        Page,
        Scroller,
        Button,
        catagory,
        Product,
    },
    data () {
        return {
            isLoadingGoods: false,
        }
    },
    created () {
        this.$store.dispatch('getProductList')
        new Gotop()
        window.addEventListener('scroll', e => {
            const rect = document.body.getBoundingClientRect()
            if(Math.abs((rect.height - window.scrollY) - document.documentElement.offsetHeight) < 150
                && !this.isLoadingGoods){
                this.isLoadingGoods = true
                this.$nextTick(async () => {
                    await this.$store.dispatch('getProductList')
                    this.isLoadingGoods = false
                })
            }
        })
    },
    methods: {
        showGiftBox(){
             this.$refs.giftBox.emitAside()
        }
    }
}
</script>
<style>

#gotop {
    right: .8rem;
    bottom: 1.5rem;
}
</style>

<style lang="less" scoped>
    @import "~gome-ui-kit/components/less/var.less";
    @import "~gome-ui-kit/components/less/utils.less";
    @import "~gome-ui-kit/components/less/layout.less";
    .border () {
        border-bottom: .02rem solid @gray-border;
    }
    .page {
        .flexbox();
        .flexbox.vertical();
        background: none;
    }
    nav {
        text-align: center;
        line-height: .88rem;
        background: @white;
        height: .88rem;
        .border();
        i {
            position: absolute;
            left: 0;
            width: .2rem;
        }
    }
    .desc {
        color: @font-color;
        font-size: @font-nm;
        .set-line-height(1;@font-nm * 2;);
        padding-left: .2rem;
    }
    @bottom-nav-height: 1rem;
    .bottom-nav {
        .flexbox();
        width: 100%;
        height: 1rem;
        // .set-line-height(1;@bottom-nav-height);
        position: fixed;
        bottom: 0;
        background-color: #f9f9f9;
        border-top: .02rem solid @gray-border;
        .bottom-nav-content {
            .flexitem(1);
            .flexbox();
            .flexbox.h_center();
            .flexbox.vertical();
            padding-left: .1rem;
            .tip {
                color: @font-color-dark;
                font-size: @font-lg-sm - .04rem;
                margin-bottom: .06rem;
                em {
                    color: @red;
                }
            }
            .sub-tip {
                color: @font-color;
                font-size: @font-sm + .02rem;
            }
        }
        .btn {
            line-height: @bottom-nav-height;
            border: none;
            font-size: @font-lg;
            border-radius: 0;
            &.yellow {
                background-color: yellow;
                border-color: yellow;
            }
            &.yellow-F6A623{
                background-color:#F6A623;
                border-color:#F6A623;
            }
        }
    }
    .product-list-container {
        .loading {
            height: 1.8rem;
            .flexbox();
            .flexbox.vertical();
            text-align: center;
            padding: .2rem;
            color: @font-color-light;
            font-size: @font-nm;
        }
    }
</style>
