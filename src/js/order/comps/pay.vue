/*
 * @Author: zhudanmei 
 * @Date: 2017-01-07 17:37:02 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-07-24 13:48:07
 */
<template>
    <!--支付方式-->
   <page>
        <navigator>支付方式</navigator>
        <div class="pay-container"  v-if="radioSource" >
            <div class="pay-type">
                <h3 class="title">支付方式</h3>
                <p class="ellipsis_two pay-prompt"></p>
                <div class="type-list" >
                    <radio @click.native="onPayWaySelected(index)" v-for="(item, index) in radioSource" :source="radioSource" :index="index" @onClick="onRadioClick">
                    </radio>
                </div>
            </div>
            <!--门店支付-->
            <div v-if="payMode == 'gomeStore'" class="pay-store">
                <a :href="href">
                    <h3 class="title">支付门店</h3>
                    <div class="order-link flexbox" v-if="storePayAdressInfo">
                        <p class="flex1">{{storePayAdressInfo}}</p>
                        <span>修改</span>
                        <i class="link-ico"></i>
                    </div>
                    <div class="order-link flexbox" v-else>
                        <p class="flex1">请选择支付门店</p>
                        <i class="link-ico"></i>
                    </div>
                </a>
            </div>
            <!--公司转账-->
            <div v-if="payMode == 'companyTransfer'" class="order-part">
                <div class="over">
                    <span class="order-title">转账购物流程</span>
                    <span class="payment">（转账后1-3个工作日内到账）</span>
				</div>
                <div class="cash-info">
                    <ul class="step-ulist">
                        <li class="step">订单提交</li>
                        <li class="steplink">></li>
                        <li class="step">柜台转账</li>
                        <li class="steplink">></li>
                        <li class="step stepmore">填写付款确认信息</li>
                        <li class="steplink">></li>
                        <li class="step">支付成功</li>
                    </ul>
                    <div class="account">
                        <p class="tit">您需要到“<em class="account-addr">银行柜台</em>”将款项转入以下账户信息：</p>
                        <div>
                            <p v-for="item in this.companyTransferInfos"><span>{{item.name}}</span>:<span>{{item.value}}</span></p>
                        </div>
                    </div>
                    <div class="note">
                        <h3>重要提示：</h3>
                        <p>1、顾客在转账时请务必将订单号填写到用途或备注中,柜台存款请将订单号填写到汇款用途中,以便您的订单及时得到确认。
                        </p>
                        <p>2、汇款完毕后，请务必到“会员中心-我的订单”中填写付款确认信息。
                        </p>
                    </div>
                </div>
               
            </div>
            <!--邮局付款-->
            <div v-if="payMode == 'mailRemittance'" class="order-part">
                <div class="over">
                    <span class="order-title float_l">转账购物流程</span>
                    <span class="payment"></span>
                </div>
                <div class="cash-info">
                    <ul class="step-ulist">
                        <li class="step">订单提交</li>
                        <li class="steplink">></li>
                        <li class="step">邮局汇款</li>
                        <li class="steplink">></li>
                        <li class="step stepmore">填写付款确认信息</li>
                        <li class="steplink">></li>
                        <li class="step">支付成功</li>
                    </ul>
                    <div class="account">
                        <p class="tit">您需要到“<em class="account_addr">邮局柜台</em>”将款项转入以下账户信息：</p>
                        <div>
                            <p v-for="item in this.mailRemittanceInfos"><span>{{item.name}}</span>:<span>{{item.value}}</span></p>
                        </div>
                    </div>
                    <div class="note">
                        <h3>注意事项：</h3>
                        <p>1.上海暂时未开通邮局汇款业务。
                        </p>
                        <p>2.请您务必在汇款单的附言处注明订单编号和收货人姓名。
                        </p>
                        <p>3.请您在24小时内付清款项，汇款后请务必到“会员中心-我的订单”中填写付款确认信息，否则您的订单会被取消</p>
                    </div>
                </div>
            </div>
            <!--货到付款-->
            <div class="cashOnDelivery" v-if="payMode == 'cashOnDelivery'">
                <h3>货到付款</h3>
                <div class="radio-group">
                    <radio v-for="(item, index) in onDeliverydata" :source="onDeliverydata" :index="index" @onClick="onRadioClick" @click.native="PayWaySelected(index)">
                        <i slot="pre"></i>
                    </radio>
                </div>
            </div>
            <div class="order-btn">
                <btn @click.native="save" :className="'default red block'">确定</btn>
            </div>
        </div>
   </page>
</template>
<script>
    import Vue from 'vue';
    import { mapGetters } from 'vuex';
    import {Button,Page,RadioItem,RadioMixin} from 'gome-ui-kit';
    import query from 'gome-utils-query';
    import http from 'gome-utils-http';
    import Nav from '../widgets/nav/nav.vue';
    import islogin from '../utils/islogin.js';
    export default Vue.extend({
        mixins: [RadioMixin],
        components: {
            'btn': Button,
            'page': Page,
            'radio': RadioItem,
            
            navigator: Nav

        },
        data () {
            return {
                radioSource: null,
                payMode: '',
                storePayAdressInfo: '',
                data: null,
                subPayModeID: '',
                bankId:'',
                cashOnDelivery:null,
                changeData:null,
                onDeliverydata:null, 
                companyTransferInfos:'' ,//公司转账
                mailRemittanceInfos:'' ,//邮局付款
                href: '' //门店付款跳转
            }
        },
        computed: {
        },
        created () {
            this.href= "/gome_store.html?source="+(query.parse(window.location.search).source || 1); 
            http({
                url: '//' + location.host + '/order_ajax.html',
                type:'post',
                data: {
                    act: 'queryMobilePaymentMethods',
                    json: JSON.stringify({
                        businessType: query.parse(location.search).source || 1, /*购物车类型*/
                    })
                    
                }
            })
            .then(islogin)
            .then(function(data){
                this.data = data;
                /*原始数据支付方式循环*/
                this.radioSource = data.paymentMethodArray.map( (item, index) => {
                    if(item.selected == 'Y'){
                        this.$nextTick( () => {
                            //获取数据默认选中的支付方式
                            
                            this.payMode = item.paymentMethod;
                            this.onPayWaySelected(index);
                            this.storePayAdressInfo = item.secPaymentMethodArray[0].storePayAdressInfo
                            this.subPayModeID = item.secPaymentMethodArray[0].paymentMethod
                           
                        })
                    }
                    return {
                        content: item.paymentMethodDesc,
                        id: item.paymentMethod,
                        isActive: item.selected == 'Y' ? true : false,
                        secPaymentMethodArray: item.secPaymentMethodArray
                    }
                })
            }.bind(this))
        },
        methods: {
            //支付方式选择
            onPayWaySelected (index) {
                this.cashOnDelivery = this.radioSource[index].secPaymentMethodArray
                this.payMode = this.radioSource[index].id;
                // 选择方式相对应的二级分类支付数据
                this.onDeliverydata = this.cashOnDelivery.map( (item, index) => {    //可选择的支付方式(二级分类)
                    this.companyTransferInfos = item.companyTransferInfos;  //公司转账信息  支付方式为公司转账时有值
                    this.mailRemittanceInfos = item.mailRemittanceInfos;  //邮局汇款信息  支付方式为邮局汇款时有值
                    return {
                        content: item.paymentMethodDesc,
                        id: item.paymentMethod,
                        isActive: item.selected == 'Y' ? true : false
                    }
                })

            },
            //货到付款点击得到二级支付方式id
            PayWaySelected(index){
                this.subPayModeID = this.onDeliverydata[index].id;
            },
            save () { //保存支付方式
                http({
                    url: '//' + location.host + '/order_ajax.html',
                    type:'post',
                    data: {
                        act: 'savePaymentMethod',
                        json: JSON.stringify({
                            businessType: query.parse(window.location.search).source || '1',
                            payModeID: String(this.payMode), //选择的支付方式id
                            businessType: query.parse(window.location.search).source || '1', //购物车类型
                            subPayModeID: String(this.subPayModeID), //选择的二级支付方式id
                            bankId:'',
                            period:''
                        })
                    }
                })
                .then((data) => {
                    
                    this.$router.back();
                })
            }
        },
    });

</script>
<style lang='less'>
    @import '../less/order.less';
	.pay();
    @import '../widgets/radio/radio.less';
	.radio();
    .pay-store{
        .module_padding();
        background-color: @white;
        color: @gray-light;
        font-size: @font-nm;
        .title{
            font-size: @font-nm;
            .module();
        }
    }
    .cashOnDelivery{
        background-color: @white;
        .module_padding();
        .radio{
            display: block;
            width: 100%;
            margin-top: @font-sm * 2.2;
            i{
                display: inline-block;
                width: @font-lg-sm;
                height: @font-lg-sm;
                background-size: 100% 100%;
                margin-right: @font-sm;
                .background-image-nm(url(../images/radio_no.png));
            }
            &.active i{
                .background-image-nm(url(../images/radio_yes.png));
            }
        }
    }
</style>