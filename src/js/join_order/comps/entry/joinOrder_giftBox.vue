/*
 * @Author: liuhuan 
 * @Date: 2017-08-04 15:07:10 
 * @Last Modified by: 
 * @Last Modified time: 
 */
<template>
  <div>
        <Aside ref="asilder" :direction="'bottom'" :position="60">
            <div class="giftBox-cont" v-if="true">
                <div class="giftBox-top">
                    <div class="top-title">{{key}}</div>
                    <div class="close-giftbox" @click="closedAside"></div>
                </div>
                <acticle class="giftBox-center">
                        <giftProduct></giftProduct>
                </acticle>
                <div class="giftBox-bottom">确定</div>
            </div>
            <div v-else="false">系统繁忙，请稍后</div>
        </Aside>
  </div>
</template>
<script>
import {Aside} from 'gome-ui-kit'
import giftProduct from './giftProduct.vue'
export default {
    components:{
        giftProduct,            
        Aside,
    },
    data(){
        return {
            key:'购已满300元，最多可领取1套赠品'            
        }
    },
    methods:{
        emitAside () {
            this.$refs.asilder.in()
        },
        closedAside(){
            this.$refs.asilder.out()
        }
    }
}
</script>
<style lang="less">
@import "~gome-ui-kit/components/less/var.less";
@import "~gome-ui-kit/components/less/utils.less";
@import "~gome-ui-kit/components/less/layout.less";
.giftBox-cont {
    .flexbox();
    .flexbox.vertical();
    color:@font-color-dark; 
    font-size:@font-nm;
    .giftBox-top {
        .flexbox();
        height: .9rem;
        align-items:center;
        padding:0 .2rem;
        .top-title{
            flex:1;
            font-size:@font-nm - 0.02rem;
            color:@font-color-dark;
        }
        .close-giftbox{
            width:0.34rem;
            height:0.34rem;
            .background-image-nm(url(../../images/closeBtn.png));
        }
    }
    .giftBox-center{
        flex:1;
        padding:0 .24rem 0 .38rem;
        overflow:hidden;        
    }
    .giftBox-bottom {
        height:.9rem;
        font-size:@font-lg-sm + 0.02rem;
        line-height:.9rem;
        color:@white;
        text-align:center;
        background-color:#ff5c5c;
        margin-top:.37rem;
    }
}
</style>
