/*
 * @Author: zhudanmei 
 * @Date: 2017-02-23 18:20:15 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-03-10 15:48:24
 */
 <template>
    <div>
        <cmodal 
                    :show="$store.state.$setPassword.isModalShow"
                    :title="title"
                    :hasClose="hasClose"
                    @close="hideModal"
                    class="giveaway-picker set-password"
                    :ok="ok"
                    :cancel ="cancel"
                    @ok="setPassword"
                    @cancel= "ok"
                   
                >
             <div slot="content" class="content">
                <p>为保证您的账户资产安全，使用券、国美币时请先设置支付密码</p>                
            </div>
        </cmodal>
    </div>
</template>
<script>
import Vue from 'vue';
    import {Button,Toast,Page, Modal,CModal,Scroller,Product,ModalMixin} from 'gome-ui-kit';
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
            title : '设置支付密码',
            hasClose : true,
            ok: '设置',
            cancel:'取消'
            
        }
    },
    created: function(){
        
        
    },
    methods: {
       
        hideModal(){
            this.$store.state.$setPassword.isModalShow = false;
        },
        
        ok(){
            this.$store.state.$setPassword.isModalShow = false;
        },
        setPassword(){
            window.location.href = "//"+ location.host.replace('cart.','u.') +"/change_password.html?type=0&" +(window.location.search ? window.location.search : '?source=1');
           
            
        },
        
    }
})

</script>
<style lang='less'>
    @import '../../less/order.less';
    /*弹框样式*/
    .set-password{
        .window{
            .title{
                line-height:.8rem;
            }
        }
        .content{
            p{
                font-size:.28rem;
                color:#666;
                line-height:.36rem;
            }
        }
    }
</style>

