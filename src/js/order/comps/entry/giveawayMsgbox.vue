/*
 * @Author: zhudanmei 
 * @Date: 2017-02-24 16:47:12 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-07-31 17:27:52
 */
<template>
    <div>
        <cmodal 
                    :show="$store.state.$giveaway.isModalShow"
                    :title="$store.state.$giveaway.data.failReason"
                    :hasClose="hasClose"
                    @close="hideModal"
                    class="giveaway-picker msgbox"
                    :ok="ok"
                    :cancel="cancel"
                    @ok="submit"
                    @cancel="back"
                    v-if="this.$store.state.$giveaway.data">
             <scroller :direction="'vertical'" slot="content">
                <ul class="item-list" v-if="this.$store.state.$giveaway.data">
                    <li v-for="item in this.$store.state.$giveaway.data.outOfGoods">
                        <product :img="item.skuThumbImgUrl">
                            <div slot="content">
                                <h4 class="product_title"><span class="tag">赠品</span>{{item.skuName}}</h4>
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
            giveawaytitle: '以下赠品已被抢光',
            hasClose : true,
            ok: '继续提交',
            cancel:'返回修改'
        }
    },
    created: function(){
        this.getData()
    },
    methods: {
        getData(){
           
            this.title = this.$store.state.data.failReason
           
        },
        hideModal(){
            this.$store.state.$giveaway.isModalShow = false;
        },
        back(){
            this.$router.back();
            this.$store.state.$outgoods.isModalShow = false;
        },
        submit(){
           
            this.$store.state.$giveaway.isModalShow = false;
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
                    .tag{
                        display:@inlineBlock;
                        color: @red;
                        border: .02rem solid @red;
                        padding: .02rem;
                        border-radius: .02rem;
                        margin-right: .02rem;
                    }
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