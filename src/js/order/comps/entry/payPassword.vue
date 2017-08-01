/*
 * @Author: zhudanmei 
 * @Date: 2017-02-23 16:34:55 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-07-31 17:28:08
 */
 <template>
    <div>
        <cmodal 
				:show="$store.state.$payPassword.isModalShow"
				:title="title"
				:hasClose="hasClose"
				@close="hideModal"
				class="giveaway-picker fill-password"
				:ok="ok"
				@ok="usePassword"
                   
                    >
             <div slot="content" class="content">
                <p class="desc">为保证账户安全，使用券、国美币等需要输入支付密码</p>
                <p class="password-content">
                    <input type="password"  placeholder="请输入支付密码" autocomplete="off" value="" v-model="$store.state.payPassword">
                </p>
                <p class="forget_pwd" @click="forgetHref">
                    忘记支付密码
                </p>                
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
    import submitOrder from '../../utils/submitOrder.vue';
export default Vue.extend({
    mixins: [ModalMixin,submitOrder],
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
            title : '国美账户支付密码',
            hasClose : true,
            ok: '确认使用',
            
           
        }
    },
    created: function(){
        
        
    },
    methods: {
       
        hideModal(){
            this.$store.state.$payPassword.isModalShow = false;
        },
        
        ok(){
            this.$store.state.$payPassword.isModalShow = false;
        },
        usePassword(){
            
            this.$store.state.$payPassword.isModalShow = false;
                this.submitOrder();
            if(this.$store.state.payPassword){
                
            }
            
        },
        forgetHref(){
            window.location.href = "//"+ location.host.replace('cart.','u.') +"/change_password.html?type=0&amp;"+(window.location.search ? window.location.search : '?source=1');
        }
        
    }
})

</script>
<style lang='less'>
    @import '../../less/order.less';
    /*弹框样式*/
    /*填写支付密码*/
    .fill-password{
        .window{
            .title{
                line-height:.8rem;
            }
            .content{
                padding-bottom: @font-sm;
            }
        }
        .desc{
            text-align: left;
            font-size: @font-nm-sm + .02rem;
            color: @gray-light;
            line-height: @font-lg-sm - .02rem;
        }
        .password-content{
            margin: .2rem 0;
            border: .02rem solid #e6e6e6;
           
            input{
                width: 100%;
                
                padding: .18rem 0 .18rem .1rem;
                text-align: left;
                border: none;
                outline: 0;
            }
           
            
        }
        .forget_pwd{
            text-align: right;
            font-size: .24rem;
            a{
                color: #197fe7;
            }
            
        }
    }

</style>
