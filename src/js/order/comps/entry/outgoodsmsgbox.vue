/*
 * @Author: zhudanmei 
 * @Date: 2017-02-16 17:49:30 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-03-27 17:09:08
 */
<template>
    <div>
        <cmodal 
                    :show="$store.state.$outgoods.isModalShow"
                    :title="$store.state.data.outOfStockMes"
                    :hasClose="hasClose"
                    @close="hideModal"
                    class="giveaway-picker msgbox outgoods"
                    :ok="ok"
                    :cancel="cancel"
                    @ok="back"
                    @cancel="turnOnline"
                    >
             <scroller :direction="'vertical'" slot="content">
                <ul class="item-list" v-if="this.$store.state.$outgoods.data">
                    <li v-for="item in this.$store.state.$outgoods.data">
                        <product :img="item.skuThumbImgUrl">
                            <div slot="content">
                                <h4 class="product_title">{{item.skuName}}</h4>
                                <p class="num">x{{item.goodsCount}}</p>
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
//utils-lib
import http from 'gome-utils-http';
import eventbus from 'gome-utils-eventbus';
import query from 'gome-utils-query';

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
            title : '',
            hasClose : false,
            cancel:'知道了'
            // cancel:'转为国美自营',
            // ok: '返回修改'
        }
    },
    created: function(){
        this.getData();
    },
    methods: {
        getData(){
            if(this.$store.state.data.outOfStockMes){
                this.title = this.$store.state.data.outOfStockMes
            }
           
        },
        hideModal(){
            
            this.$store.state.$outgoods.isModalShow = false;
        },
        back(){
            if(this.$route.path == '/'){
                window.location.href = '//'+ location.host +'/shopping_cart.html'+location.search
            }else{
                this.$router.back();
            }
           
            this.$store.state.$outgoods.isModalShow = false;
        },
        
        turnOnline(){
            
            http({
                url: '//' + location.host + '/order_ajax.html',
                type:'post',
                data: {
                    act: 'changeOfflineToOnline',
                    json: JSON.stringify({
                        businessType: query.parse(window.location.search).source || 1,
                    })
                }
            })
            .then(data => {
                
                this.$store.state.$outgoods.isModalShow = false;
                eventbus.emit('updateEntryData')
            })
            
        }
    }
})

</script>
<style lang='less'>
   @import '../../less/order.less';
   .outgoods{
        .window .title{
            line-height: .4rem;
            text-align: left;
            padding: .2rem .4rem;
            font-size: .28rem;
            .text.fix-position{
                padding-left:.74rem;
            }
            
        }
        .window .close{
            i{
                background-position: center 15%;
            }
        }
        .window .btn-container .btn{
            
            &.reverse{
                color: #ff5c5c;
            }
        }
        
   } 
</style>

