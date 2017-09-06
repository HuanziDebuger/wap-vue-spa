/*
 * @Author: zhaoye 
 * @Date: 2017-07-29 14:50:15 
 * @Last Modified by: liuhuan
 * @Last Modified time: 2017-09-06 17:25:18
 */
<template>
    <Page id="app">
        <nav >
            <i @click="goback"></i>
            凑单
        </nav>
        <catagory></catagory>
        <p v-if="$store.state.filterCatList && $store.state.filterCatList.length > 0" class="desc">{{$store.state.globalState.desc}}</p>
        <div class="product-list-container">
            <Product v-for="item in $store.state.goodsList" :data="item"></Product>
            <div class="loading">{{pageText}}</div>
        </div>
        <div class="bottom-nav">
            <div class="bottom-nav-content">
                <p class="tip">{{$store.state.globalState.condition}}，小计:<em>{{$store.state.globalState.amount}}</em></p>
                <p class="sub-tip">{{$store.state.globalState.discount}}</p>
            </div>
            <Button
            v-if="$store.state.globalState.showGiftGetButton=='Y'"
            :giftGetButtoncode="$store.state.globalState.giftGetButtoncode"
            @click.native="showGiftBox" 
            class="default yellow">{{$store.state.globalState.giftGetButtonDesc}}</Button>
            <Button class="default" @click.native="gocart">去购物车</Button>
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
            pageText:'',
        }
    },
    created () {
        this.$store.dispatch('getProductList')
        new Gotop()
        this.$store.subscribe((mutation,state)=>{
            if(mutation.type== 'getTotalPage'){
                //当前页和总页数相等，不执行翻页
                document.addEventListener('scroll', e => {
                    const rect = document.body.getBoundingClientRect()
                    if(state.totalPage ==0){
                        this.pageText='没有更多了'
                        this.isLoadingGoods = true
                        return;
                    }else{
                        if(Math.abs((rect.height - window.scrollY) - document.documentElement.offsetHeight) < 150
                            && !this.isLoadingGoods){
                            this.isLoadingGoods = true
                            this.$nextTick(async () => {
                                await this.$store.dispatch('getProductList')
                                this.isLoadingGoods = false
                            })
                        }
                        this.pageText='加载中...'
                    }
                    
                })
                    
                
            }
        })
       
        
    },
    methods: {
        goback(){
            //window.history.back()
            window.location.href=`//${location.host}/shopping_cart.html`
        },
        showGiftBox(){
             this.$refs.giftBox.emitAside()
        },
        gocart(){
            window.location.href=`//${location.host}/shopping_cart.html`
        }
    }
}
</script>
<style>

#gotop {
    right: .24rem;
    bottom: 1.5rem;
}
</style>

<style lang="less" scoped>
    @import "~gome-ui-kit/components/less/var.less";
    @import "~gome-ui-kit/components/less/utils.less";
    @import "~gome-ui-kit/components/less/layout.less";
    .border () {
        border-bottom: 1px solid @gray-border;
    }
    .page {
        .flexbox();
        .flexbox.vertical();
        background: none;
    }
    nav {
        font-size:@font-lg;
        color:@gray-dark;
        text-align: center;
        line-height: .88rem;
        background: @white;
        height: .88rem;
        .border();
        i {
            position: absolute;
            left:.37rem;
            top:.25rem;
            width:.21rem;
            height:.43rem;
            .background-image-nm(url(../images/pre_arrow.png));
        }
    }
    .desc {
        color: @font-color;
        font-size:@font-nm-sm;
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
        border-top: 1px solid @gray-border;
        .bottom-nav-content {
            .flexitem(1);
            .flexbox();
            .flexbox.h_center();
            .flexbox.vertical();
            padding-left: .1rem;
            padding-top:0.02rem;
            .tip {
                color: @font-color-dark;
                font-size: @font-nm;
                margin-bottom: .06rem;
                line-height:.3rem;
                em {
                    color: @red;
                }
            }
            .sub-tip {
                color: @font-color;
                font-size: @font-sm;
                line-height:.3rem;
            }
        }
        .btn {
            width:1.8rem;
            padding:0;
            text-align:center;
            line-height: @bottom-nav-height;
            border: none;
            font-size: @font-nm + .02rem;
            border-radius: 0;
            &.yellow{
                background-color:#f6a623;
                border-color:#f6a623;
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
