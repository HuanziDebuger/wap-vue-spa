/*
 * @Author: zhudanmei 
 * @Date: 2017-01-19 17:29:01 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-04-19 10:45:15
 */
<template>
        <div>
            <div class="sendTime-moudle" v-if="$store.state.$productList.data">
                <h3>配送时间</h3>
                <!--限时达-->
                <div v-if="g3ppTimeRadioSource[0]" class="xsdCont">
                    <router-link :to="nextPage">
                        <p class="subtitle">
                            <span v-if="$store.state.$productList.data.g3ppDeliverTimeOptions[0].code=='XSD'">限时达商品配送时间</span>
                            <span v-if="$store.state.$productList.data.g3ppDeliverTimeOptions[0].code=='JSD'">计时达商品配送时间</span>
                           
                            <span>{{$store.state.$productList.data.g3ppDeliverDesc}}</span>
                        </p>
                    </router-link>
                    <div class="xsdTime">
                        <div class="choose-time" style="display:flex;" v-for="item in $store.state.$productList.data.g3ppDeliverTimeOptions">
                            {{deliverTime}}
                            <span class="date-icon" @click="showModal('g3pp')"><img src="../../images/calendar_icon.png"></span>
                        </div>
                    </div>
                </div>
                <!--普通配送时间-->
                <p class="subtitle" v-if="g3ppTimeRadioSource[0] && sendTypeRadioSource.length>0">其它商品配送时间</p>
                <div class="type-list" v-if="sendTypeRadioSource">
                    <radio @click.native="onSendTypeSelected(item, index)" v-for="(item, index) in sendTypeRadioSource" :source="sendTypeRadioSource" :index="index" @onClick="onRadioClick">
                    </radio>
                </div>
                <!--选择配送选择时间 限时达  弹层-->
                <cmodal 
                    :show="isModalShow"
                    :title="title"
                    :hasClose="hasClose"
                    @close="hideModal"
                    class="time-picker"
                    >
                    <scroller :direction="'vertical'" slot="content">
                        <div v-if="isG3ppTimePickerShow" class="show-g3pp-time">
                            <div v-for="(g3ppDeliverTimeOption, index) in $store.state.$productList.data.g3ppDeliverTimeOptions" v-if="g3ppDeliverTimeOption.fixDeliveryOptions">
                                <!--此处抄自原php代码，fixDeliveryOptions[0]-->
                                <dt>
                                    <span class="during-time">时间段</span>
                                    <em v-for="slot in g3ppDeliverTimeOption.fixDeliveryOptions[0].slots">{{slot.label}}</em>
                                </dt>
                                <radio @click.native="onG3ppTimerPickerSelected(item, idx)" v-for="(item, idx) in g3ppTimeRadioSource[index]" :source="g3ppTimeRadioSource[index]"  :index="idx" @onClick="onRadioClick">
                                    <i slot="post" class="item-icon"></i>
                                </radio>
                            </div>
                        </div>

                        <div  v-if="isSMITimePickerShow" class="show-smi-time">
                            <div v-for="(deliverTimeOption, index) in $store.state.$productList.data.deliverTimeOptions" v-if="deliverTimeOption.fixDeliveryOptions">
                                <dt >
                                    <span class="during-time">时间段</span>
                                    <em v-if="deliverTimeOption.fixDeliveryOptions && deliverTimeOption.fixDeliveryOptions.length>0" v-for="slot in deliverTimeOption.fixDeliveryOptions[0].slots">{{slot.label}}</em>
                                </dt>
                                <dt class="smi" v-for="(options, _index) in deliverTimeOption.fixDeliveryOptions">
                                    <span class="during-time">{{options.dateStr}}</span>   
                                    <span class="smi-radio-container" v-for="(slot, __index) in options.slots">
                                        <radio @click.native="onSMITimerPickerSelected(deliverTimeRadioSource[_index * 2 + __index], _index * 2 + __index)" 
                                                v-if="deliverTimeRadioSource.length > 0" 
                                                :source="deliverTimeRadioSource" 
                                                :index="_index * 2 + __index" 
                                                @onClick="onRadioClick">
                                            <i slot="post" class="item-icon"></i>
                                        </radio>
                                    </span>
                                </dt>
                                <!--<radio @click.native="onSMITimerPickerSelected(item, idx)" v-for="(item, idx) in deliverTimeRadioSource" :source="deliverTimeRadioSource"  :index="idx" @onClick="onRadioClick">
                                    <i slot="post" class="item-icon"></i>
                                </radio>-->
                            </div>
                        </div>
                    </scroller>
                </cmodal>
                
                <!--选择配送选择时间  smi运能 弹层-->
                <!--<cmodal 
                    :show="isSMITimePickerShow"
                    :title="title"
                    :hasClose="hasClose"
                    @close="hideModal"
                    class="time-picker"
                    >
                    <scroller :direction="'vertical'" slot="content">
                        <div class="list show-g3pp-time">
                            <div v-for="(deliverTimeOption, index) in $store.state.$productList.data.deliverTimeOptions" v-if="deliverTimeOption.fixDeliveryOptions">
                                <!--此处抄自原php代码，fixDeliveryOptions[0]-->
                                <!--<dt>时间段    <em v-for="slot in deliverTimeOption.fixDeliveryOptions[0].slots">{{slot.label}}</em></dt>
                                <radio v-for="(item, idx) in deliverTimeRadioSource[index]" :source="deliverTimeRadioSource[index]"  :index="idx" @onClick="onRadioClick">
                                    <i slot="post">
                                        icon
                                    </i>
                                </radio>
                            </div>
                        </div>
                    </scroller>
                </cmodal>-->
            </div>
        </div>
    </page>
</template>
<script>
    import Vue from 'vue';
    import {
                Page,
                RadioItem,
                RadioMixin,
                OptionItem,
                OptionMixin,
                Toast,
                Modal,
                CModal,
                ModalMixin,
                Scroller
            } from 'gome-ui-kit';
    import { mapGetters } from 'vuex';
    import http from 'gome-utils-http';
    import queryparser from 'gome-utils-query';
    
    export default Vue.extend({
        mixins: [RadioMixin,OptionMixin,ModalMixin],
        props: ['source'],
        components: {
            'radio': RadioItem,
            'page': Page,
            'coption': OptionItem,
            'cmodal': CModal,
            'scroller': Scroller
        },
        data () {
            return {
                deliverTime: null,
                sendTypeRadioSource: [],

                isSMITimePickerShow: false,
                deliverTimeRadioSource: [],

                isG3ppTimePickerShow: false,
                g3ppTimeRadioSource: [],

                isModalShow: false,
                title: '选择送货时间',
                hasClose: true,
            }
        },
        computed: {
           nextPage () {
                return '/productList/timeLimitProductList' 
            },
        },
        created () {
            //其他配送方式
            if(this.$store.state.$productList.data.deliverTimeOptions){
                this.sendTypeRadioSource =  this.$store.state.$productList.data.deliverTimeOptions.map( deliverTimeOption => {
                    if(deliverTimeOption.fixDeliveryOptions){
                        //smi运能时间
                        // this.deliverTimeRadioSource = deliverTimeOption.fixDeliveryOptions.map( fixDeliveryOption => {
                        //     return {
                        //         content: fixDeliveryOption.dateStr,
                        //         isActive: fixDeliveryOption.slots.filter(i => {return i.selected == 'Y' ? true : false}).length > 0 ? true : false,
                        //         code: deliverTimeOption.code,
                        //         smiItem: fixDeliveryOption,
                        //     }
                        // });
                        for (var i=0; i < deliverTimeOption.fixDeliveryOptions.length; i++){
                            var fixDeliveryOption = deliverTimeOption.fixDeliveryOptions[i]
                            for (var j=0; j < fixDeliveryOption.slots.length; j++){
                                var slot =  fixDeliveryOption.slots[j]
                                this.deliverTimeRadioSource.push({
                                    content: '',
                                    isActive: slot.selected == 'Y' ? true : false,
                                    code: slot.code,
                                    label: slot.label,
                                    dateStr: fixDeliveryOption.dateStr,
                                    smiItem: slot,
                                    date: fixDeliveryOption.date
                                })
                            }
                        }
                        console.log(this.deliverTimeRadioSource)
                    }
                    return {
                        code: deliverTimeOption.code,
                        content: deliverTimeOption.label,
                        isActive: deliverTimeOption.selected == 'Y' ? true : false
                    }
                })
            }
            /*限时达时间*/
            if(this.$store.state.$productList.data.g3ppDeliverTimeOptions){
                
                    this.$store.state.$productList.data.g3ppDeliverTimeOptions.forEach( item => {
                        this.$store.state.$productList.g3ppDeliveryType = item.code;
                        if(item.available == 'Y' && item.code == 'XSD'){
                            this.g3ppTimeRadioSource.push(item.fixDeliveryOptions.map( fixDeliveryOption => {
                                
                                var isActive = fixDeliveryOption.slots.filter(i => {return i.selected == 'Y' ? true : false}).length > 0 ? true : false;
                                if(isActive){
                                    
                                    this.$store.state.$productList.fixedTime = fixDeliveryOption.date;
                                    this.$store.state.$productList.userDeliveryTimeslot = fixDeliveryOption.slots[0].code;
                                    this.deliverTime = fixDeliveryOption.dateStr + fixDeliveryOption.slots[0].label 
                                }
                                return{
                                    content: fixDeliveryOption.dateStr,
                                    isActive,
                                    code: item.code,
                                    g3ppItem: fixDeliveryOption,
                                }
                            }))
                           
                        }
                    })
                }
        },
         methods: {
            /**
             * 选中配送方式
             */
            onSendTypeSelected (item, index) {
                this.$store.state.$productList.data.deliverTimeOptions.map( (deliverTimeOption, idx) => {
                    if(index == idx){
                        deliverTimeOption.selected = 'Y'
                    }else{
                        deliverTimeOption.selected = 'N'
                    }
                })
                this.timeCode = item.code;
                //this.deliverTime = item.optionsItem;
                /*判断是否是指定送货时间*/
                if(this.timeCode.match(/slot/i)){
                    this.showModal('smi');
                }else{
                    this.save();
                }
            },
            onG3ppTimerPickerSelected (item, index) {
                
                //此处slots[0]，别问问什么，反正线上就只有一个时间段，出了问题再说。。。。
                this.$store.state.$productList.fixedTime = item.g3ppItem.date;
                this.$store.state.$productList.userDeliveryTimeslot = item.g3ppItem.slots[0].code;

                //设置UI上的时间
                this.deliverTime = item.content + item.g3ppItem.slots[0].label;

                this.hideModal();
                this.save();
            },
            onSMITimerPickerSelected (item, index) {
                //是的我就是接着上面的那个方法写的，slots[0]，果然smi出问题了。shit。。。。
                this.$store.state.$productList.fixedTime = item.date;
                this.$store.state.$productList.userDeliveryTimeslot = item.smiItem.code
                
                //设置UI上的时间
                this.deliverTime = item.dateStr + item.label
                this.sendTypeRadioSource.forEach(radio => {
                    if(radio.code == "SLOT"){
                        radio.content = item.dateStr + item.label
                    } 
                })
                this.hideModal();  
            },
            showModal (type) {
                if(type == 'g3pp')
                    this.isG3ppTimePickerShow = true;
                if(type == 'smi')
                    this.isSMITimePickerShow = true;
                this.isModalShow = true;
            },
            save () {
                http({
                    url: '//' + location.host + '/order_ajax.html',
                    type: 'post',
                    data: {
                        act: 'saveShippingmethod',
                        // shippingGroups	配送单	array<object>	
                        //     callconfirm	是否电话确认	string	@mock=Y
                        //     comments	备注	string	@mock=
                        //     fixedTime	指定日期	string	@mock=1463040000000
                        //     g3ppDeliveryType	限时达、计时达类型	string	@mock=XSD
                        //     shippingGroupId	配送单id	string	@mock=2568579909
                        //     shippingMethod	配送方式	string	@mock=Gome Express
                        //     userDeliveryTimeslot	指定时间段	string	@mock=slot12
                        //     userDeliveryType	配送时间类型	string	@mock=
                        //     gomeStore	门店自提点ID		
                        //  businessType	购物车业务类型	number	1：普通 2：团抢 3:抢购 4：预售 5：线下微店 6：送礼物 7：海外购 8：快速购;9：实体美通卡；10:电子美通卡 11:合约机运营商站点 12:拼团站点 13:极信站点
                        json:  JSON.stringify({
                            shippingGroups: {
                                callconfirm: '',
                                comments: '',
                                fixedTime: '',
                                g3ppDeliveryType: '',
                                shippingGroupId: '',
                                shippingMethod: '',
                                userDeliveryTimeslot: '',
                                userDeliveryType: '',
                                gomeStore: '',
                            },
                            businessType: queryparser.parse(window.location.search).source
                        })
                    }
                })
            },
            hideModal () {
                setTimeout(() => {
                    this.isG3ppTimePickerShow = false;
                    this.isSMITimePickerShow = false;
                },500)
                this.isModalShow = false;
            }           
        }
    })  
</script>
<style lang='less'>
    @import '../../less/order.less';
    .time-picker {
        .window {
            width: 90% !important;
            margin-bottom: @font-sm;
        }
        .scroller-container {
            position: relative;
            max-height: 5rem;
        }
    }
    .sendTime-moudle{
        background-color:@white;
        .module();
        padding: .3rem .2rem .06rem;
        h3{
            color:@gray-light;
            font-size:@font-nm;
            margin-bottom:.3rem;
            font-weight: bold;
        }
        .subtitle{
            margin-bottom:.27rem;
            font-size: .26rem;
        }
        .type-list {
            .radio-content {
                font-size: .26rem;
            }
        }

    }
    .xsdCont{
        overflow: hidden;
        margin-bottom:.36rem;
        padding-bottom:.4rem;
        .border-bot(@input-borcolor);
        .xsdTime{
            .flexbox();
            .flexitem(1);
            font-size: .26rem;
            position: relative;
            &::before {
                content: '';
                float: left;
                background: url('../../images/radio_yes.png') no-repeat;
                background-size: contain;
                width: .32rem;
                height: .32rem;
                margin-right: .2rem;
            }
            .radio{
                .flexbox();
                .flexbox.v_center;
                width: 100%;
                img {
                    display:@inlineBlock;
                    .set-width-height(1;.44rem;);
                    margin-right:.3rem;
                }
                span {
                    .flexitem(1);
                }
            }
            .choose-time {
                line-height: .32rem;
                .date-icon{
                    /*.flexbox();
                    .flexbox.v_center();*/
                    position: absolute;
                    top: 0;
                    right: 0;
                    img{
                        .set-width-height(1;.35rem;);
                    }
                    
                }
            }
        }
    }
    /*弹层样式*/
    .show-g3pp-time,
    .show-smi-time,{
        dt {
            line-height: .72rem;
            border-bottom: 1px solid #ccc;
            font-size: .26rem;
            background: url(../../images/time_icon.png) no-repeat .2rem center;
            background-size: .26rem .26rem;
            padding-left: .56rem;
            .flexbox();
            .during-time {
                width: 1.4rem;
            }
            &.smi {
                .flexbox.center();
                margin-left: .2rem;
                background-image: none;
                padding-left: 0;
                .smi-radio-container,
                .during-time {
                    .flexbox.center();
                    .flexitem(1);
                }
            }
            em {
                color: @red;
                text-align: center;
                .flexitem(1);
            }
        }
        .radio {
            .flexbox();
            .flexbox.v_center;
            width: 100%;
            .set-line-height(1;1rem;);
            .border-bot(@gray-dark-border);
            font-size:@font-nm-sm + .02rem;
            margin-left: @font-sm;
            .radio-content {
                width: 1.6rem;
            }
            .item-icon {
                .flexitem(1);
                width: .44rem;
                height: .44rem;
                background: url(../../images/check_no.png) no-repeat center;
                background-size: contain;
            }
            &.active {
                .item-icon {
                    background: url(../../images/check_yes.png) no-repeat center;
                    background-size: contain;
                }
            }
            .icon-container {
                i {
                    width: .6rem;
                }
                .flexitem(1);
                .flexbox();
                .flexbox.center();
            }
        }
        
    }
    .show-smi-time {
        .smi-radio-container {
            .flexbox();
            .radio {
                width: auto;
                border-bottom: none;
            }
        }
    }
    .show-g3pp-time li.time-title,
    .show-smi-time li.time-title{
        .item_name{
            width: 6.0rem;
            text-align: left;
            padding-left: .44rem;
            margin-left: .2rem;
        }
    }
</style>
