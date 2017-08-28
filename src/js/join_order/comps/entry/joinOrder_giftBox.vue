/*
 * @Author: liuhuan 
 * @Date: 2017-08-04 15:07:10
 * @Last Modified by: liuhuan
 * @Last Modified time: 2017-08-26 14:15:34
 */

<template>
    <Aside ref="asilder" :direction="'bottom'" :position="60">
        <giftProduct
        v-if="$store.state.globalState.giftGroupInfoList && $store.state.globalState.giftGroupInfoList.length>0"
        @closedAside="toClosedAside">
        </giftProduct>
    </Aside>
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
            isConfirm:false,
        }
    },
    mounted(){
         //自动打开赠品弹层
        if(this.$store.state.globalState.openGiftLayer=='Y'){
            this.$refs.asilder.in()
        }
    },
    methods:{
        emitAside () {//打开底边栏
            this.$refs.asilder.in()
        },
        toClosedAside(msg){ //关闭底边栏
            this.$refs.asilder.out()
        },
        
        
    }
}
</script>
<style lang="less">

</style>
