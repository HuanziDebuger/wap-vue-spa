/*
 * @Author: zhaoye 
 * @Date: 2017-01-19 17:08:11 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-02-28 15:21:52
 */
<template>
    <div>
        <cmodal 
                    :show="$store.state.$msgbox.isModalShow"
                    :title="title"
                    :hasClose="hasClose"
                    @close="hideModal"
                    class="giveaway-picker msgbox"
                    :ok="ok"
                    :cancel="cancel"
                    @ok="changeAddress"
                    @cancel="back"
                    v-if="this.$store.state.$msgbox.data">
             <scroller :direction="'vertical'" slot="content">
                <ul class="item-list" v-if="this.$store.state.$msgbox.data">
                    <li v-for="item in this.$store.state.$msgbox.data.outOfGoods">
                        <product :img="item.skuThumbImgUrl">
                            <div slot="content">
                                <h4 class="product_title">{{item.skuName}}</h4>
                            </div>
                        </product>
                    </li>
                </ul>
            </scroller>
        </cmodal>
    </div>
</template>
<script>
import Vue from 'vue';
import {Button,Toast,Page, Modal,CModal,Scroller,Product,ModalMixin} from 'gome-ui-kit';
export default Vue.extend({
    mixins: [ModalMixin],
    components: {
        cmodal: CModal,
        page: Page,
        cbutton: Button,
        scroller: Scroller,
        product: Product
    },
    data () {
        return {
            source:{},
            title : '以下商品在此区域无货',
            hasClose : true,
            ok: '更换地址',
            cancel:'返回修改'
        }
    },
    created: function(){
        this.getData();
    },
    methods: {
        getData(){
            this.source = this.$store.state.$msgbox.data;
        },
        hideModal(){
            this.$store.state.$msgbox.isModalShow = false;
        },
        back(){
            if(this.$route.path == '/'){
                window.location.href = '//'+ location.host +'/shopping_cart.html'+location.search
            }else{
                this.$router.back();
            }
                        
            //this.$router.back();
            this.$store.state.$outgoods.isModalShow = false;
        },
        ok(){
            this.$store.state.$msgbox.isModalShow = false;
        },
        changeAddress(){
            this.$router.push('/address');
            this.$store.state.$msgbox.isModalShow = false;
        }
    }
})

</script>
<style lang='less'>
    @import '../../less/order.less';
    /*弹框样式*/
    /*赠品不足*/

    .msgbox{
        .scroller-container {
            position: relative;
            max-height: 5rem;
            padding:0 .2rem;
        }
        .window .title{
            padding-top:.2rem;
        }
    }
    .msgbox .product{
        .react{
            .flexbox();
        }
        .container{
            &.img{
                .set-width-height(1;1.2rem;);
                margin-right: .2rem;
                overflow: hidden;
            }
            &.content{
                position: relative;
                padding: 0 0 .06rem 0;
                text-align:left;
                .layout.flex1;
                font-size: @font-nm;
                .product_title{
                    .set-ellipsis-line(1);
                    line-height:.3rem;
                    font-size:@font-nm-sm;
                }
                
                .num{
                    position:absolute;
                    bottom:.06rem;
                    color:#a2a4a6;
                }

            }
        }
    }
    .item-list{
        background:@white;
        li{
            margin-bottom:.2rem;
        }
    }
    .msgbox .subtitle{
        background-color:@white;
    }
</style>