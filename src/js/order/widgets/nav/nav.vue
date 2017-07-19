/*
 * @Author: zhaoye 
 * @Date: 2017-02-03 14:08:48 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-06-19 18:44:58
 */
<template>
    <nav v-if="!this.isAPP">
        <i @click="back" class="nav_return"></i>
        <h2>
            <slot></slot>
        </h2>
        <slot name="ext"></slot>
    </nav>
</template>
<script>
    import Vue from 'vue';
    import {env, system} from 'gome-utils-env'   
    export default Vue.extend({
        props: ['confirmMsgbox', 'title'],
         data () {
            return {
                isAPP:'',
            }
         },
        created: function(){
           this.isAPP = env.app;
           
        },
        methods: {
            back () {
                if(this.confirmMsgbox){
                    this.$emit('back')
                }else{
                    
                    if(this.$route.path == '/' && (document.referrer.match(/order_fill_coupon/) || document.referrer.match(/order_fill/) ) ){
                        window.location.href = '//'+ location.host +'/shopping_cart.html'+location.search
                    }else{
                        this.$router.back();
                    }
                        
                }
            },
        }
    })
</script>
<style lang='less'>
    @import '../../less/order.less';
    @font-size: .36rem;
    @line-height: .88rem;
    nav {
        font-size: @font-size;
        background: @white;
        color: @gray-dark;
        .set-line-height(1; @line-height);
        .border-bot(#ddd);
        .flexbox();
        position: relative;
        i {
            position: absolute;
            z-index: 1;
            &.nav_return {
                width: .7rem;
                height: .88rem;
                .background-image-nm(url(../../images/nav_return.png));
                background-size: .23rem .43rem;
                background-position: center;
            }
        }
        h2 {
            position: absolute;
            .set-line-height(1; @line-height);
            font-size: @font-size;
            width: 100%;
            text-align: center;
        }
        :last-child:not(h2) {
            .flexbox();
            .flexbox.reverse();
            .set-line-height(1; @line-height);
            width: 50%;
            position: absolute;
            z-index: 1;
            right: 0;
        }
    }
</style>