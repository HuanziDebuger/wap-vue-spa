/*
 * @Author: zhudanmei 
 * @Date: 2017-01-07 12:30:26 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-22 20:55:18
 */
<template>
    <!--发票跳转-->
    <page>
        <navigator>发票信息</navigator>
        <div class="pay-container invoice-cont">
            <div class="pay-type" v-if="this.source.isSuportNoInvoice =='Y'">
                <h3 class="title">发票信息</h3>
                <div class="type-list">
                    <radio v-for="(item, index) in invoiceInfo" :source="invoiceInfo" :index="index" @onClick="onRadioClick" @click.native="isNeedInvoiceInit(item)">
                    </radio>
                </div>
            </div>
            <div v-show="invoiceInfoShow"><!--选择不需要发票时隐藏-->
                <div class="pay-type invoice-type" >
                    <h3 class="title">发票类型</h3>
                    <div class="type-list">
                        <radio v-for="(item, index) in typeData" :source="typeData" :index="index" @onClick="onRadioClick" @click.native="invoiceSelected(item,index)">
                        </radio>
                    </div>
                    
                    <p class="desc" v-if="this.invoiceType =='1'">{{this.source.declareInfos[0].value}}</p>
                    <p class="prompt-desc" v-if="this.invoiceType =='2'">{{this.source.declareInfos[1].value}}</p>
                </div>
                <div class="pay-type invoice-title" v-for="(item, index) in typeData" v-show="index == currentSeletedIdx && currentSeletedIdx!==2 " >
                    <h3 class="title">发票抬头</h3>
                    <div class="invoiceHead">
                        <radio v-for="(item, idx) in invoiceHead" :source="invoiceHead" :index="idx" @onClick="onRadioClick" @click.native="TitleType(item)">
                            <i slot="pre"></i>
                        </radio>
                    </div>
                    
                    <div class="invoiceContent"  v-if="invoiceTitleType=='0'"> <!--发票选择个人-->
                        <div class="invoice-info">
                            <span class="label">抬头内容</span>
                            <div class="input-box">
                                <input type="text" placeholder="请输入抬头内容" v-model="invoiceTitle">
                            </div>
                        </div>
                    </div>
                    <div class="invoiceContent" v-if="invoiceTitleType!=='0'">
                        <div class="invoice-info">
                            <span class="label">抬头内容</span>
                            <div class="input-box">
                                <input type="text" placeholder="请输入抬头内容" v-model="invoiceTitle">
                            </div>
                        </div>
                        <div class="invoice-info" v-if="invoiceTitleType=='2'">
                            <span class="label">单位税号</span>
                            <div class="input-box">
                                <input type="text" placeholder="请输入单位税号" v-model="companytaxNumber">
                            </div>
                        </div>
                    </div>
                    <p class="explain-text" v-if="invoiceTitleType=='2'">{{addedInvoiceText}}</p>
                    
                        
                </div>
                <!--增值税发票-->
                <div  v-if="this.invoiceType =='2'">
                    <!--发票资质-->
                    <div class="pay-type" v-if=" this.vatState !== '1' || this.vatState == '4' ">
                        <h3 class="title">发票资质</h3>
                        <ul class="invoice-qualification">
                            <li>
                                <span>单位名称：</span>
                                <p>{{this.source.vatInvoiceInfo.vatInvoiceAptitude.companyName}}</p>
                            </li>
                            <li>
                                <span>纳税人识别号：</span>
                                <p>{{this.source.vatInvoiceInfo.vatInvoiceAptitude.taxpayerNo}}</p>
                            </li>
                            <li>
                                <span>注册地址：</span>
                                <p>{{this.source.vatInvoiceInfo.vatInvoiceAptitude.regAddress}}</p>
                            </li>
                            <li>
                                <span>注册电话：</span>
                                <p>{{this.source.vatInvoiceInfo.vatInvoiceAptitude.regTel}}</p>
                            </li>
                            <li>
                                <span>开户银行：</span>
                                <p>{{this.source.vatInvoiceInfo.vatInvoiceAptitude.bankName}}</p>
                            </li>
                            <li>
                                <span>银行账户：</span>
                                <p>{{this.source.vatInvoiceInfo.vatInvoiceAptitude.bankAccount}}</p>
                            </li>
                        </ul>
                    </div>
                    <!--增票寄送-->
                    <div class="pay-type">
                        <h3 class="title">增票寄送</h3>
                        <ul class="increase-ticket">
                            <li>
                                <label for="">收票人</label>
                                <div class="input-box">
                                    <input type="text" v-model="shippingName" placeholder="默认为收货人姓名，必填" >
                                </div>
                            </li>
                            <li>
                                <label for="">收票人手机</label>
                                <div class="input-box">
                                    <input type="text" v-model="shippingPhone"  placeholder="默认为收货人电话，必填">
                                </div>
                            </li>
                            <li>
                                <label for="">所在地</label>
                                <div class="input-box" @click="editAddress">
                                    
                                    <div class="address-input">{{shippingAddress}}</div>
                                    <span class="down-icon"></span>
                                </div>
                                
                            </li>
                            <li>
                                <label for="">邮寄地址</label>
                                
                                    <textarea type="text" v-model="shippingarea"  placeholder="默认为收货地址，必填" maxlength="50" cols="30"></textarea>
                                
                            </li>
                        </ul>
                    </div>
                </div>
                
                <!--电话-->
                <div class="invo-man-phone" v-if="this.invoiceType =='1' || this.invoiceType =='0'"  v-show="tipShow">
                    <span class="title">收票人手机</span>
                    <div class="input-box">
                        <input type="text" placeholder="请输入收票人手机号码" v-model="telMsg" maxlength="11">
                    </div>
                </div>
                <!--发票内容-->
                <div class="pay-type invoice-cont" v-if="this.source.invoiceClasses && this.invoiceType !=='2'">
                    <h2 class="title">发票内容</h2>
                        <p v-if="this.source.shopInvoiceContext" class="invoice-desc">{{this.source.shopInvoiceContext}}</p>
                        <p class="subtitle" v-else v-for="item in this.source.invoiceClasses">{{item.label}}</p>
                        <div class="type-list">
                            <radio v-for="(item, index) in contData" :source="contData" :index="index" @onClick="onRadioClick" @click.native="contextType(item)">
                            </radio>
                        </div>
                        <p class="desc" v-if="!this.source.shopInvoiceContext">{{this.declare}}</p>
                </div>
                <!--增票发票内容-->
                <div class="pay-type invoice-cont" v-if="this.invoiceType =='2'">
                    <h2 class="title">发票内容</h2>
                        <p v-if="this.source.shopInvoiceContext">{{this.source.shopInvoiceContext}}</p>
                        <p class="subtitle" v-else v-for="item in this.source.invoiceClasses">{{item.label}}</p>
                        <div class="type-list">
                            <radio v-for="(item, index) in inncreaseTicket" :source="inncreaseTicket" :index="index" @onClick="onRadioClick" @click.native="contextType(item)">
                            </radio>
                        </div>
                        <p class="desc"  v-if="!this.source.shopInvoiceContext">{{this.declare}}</p>
                </div>
            </div>
            <div class="order-btn">
                <btn @click.native="save" :class-name="'default red block'">确定</btn>
            </div>
            <transition name="aside">
                <router-view></router-view>
            </transition>
        </div>
        
    </page>
    
</template>
<script>
    import Vue from 'vue';
    import {Button,Page,RadioItem,RadioMixin,Toast,Modal} from 'gome-ui-kit';
    import query from 'gome-utils-query';
    import http from 'gome-utils-http';
    import eventbus from 'gome-utils-eventbus';
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
                source:'',
                typeData: null, //发票类型数据集合
                contData: '',  //发票内容
                code:'',
                tipShow : '', /*控制电子发票收票人手机显隐*/
                isShow:true,  //控制
                invoiceInfoShow :true,  //控制不需要发票时的显隐
                telMsg: '', //收票人手机号码
                invoiceHead: '', //发票抬头   0：个人（个人姓名）  2：企业单位（单位名称、单位税号）  1：非企业单位（单位名称）
                currentSeletedIdx : null,
                isNeedInvoice:'0', //是否需要发票  0 需要发票 1： 不需要发票
                invoiceType:'',  //发票类型值
                invoiceTitleType:'',  //发票抬头值code
                invoiceTitle:'',  //发票抬头值value
                shippingName: '', //增票姓名
                shippingPhone: '', //增票电话
                shippingAddress: '', //增票区域地址
                shippingarea: '', //增票区域地址
                invoiceInfo:'',
                inncreaseTicket:'' ,//增票发票内容
                vatState:'' ,   //增值税发票审核状态
                addressArry: {
                    
                },
                declare:'' ,//声明
                companyName:'',//单位名称
                
                companytaxNumber:''//单位税号
                
            }
        },
        
        computed: {
        },
        created: function(){
            //EventBus.emit('loading')
            http({
                url: '//' + location.host + '/order_ajax.html',
                type:'post',
                data: {
                    act: 'queryUnionInvoiceV2',
                    json: JSON.stringify({
                        businessType: query.parse(window.location.search).source || '1',
                    })
                }
            })
            .then(islogin)
            .then(function(data){
                
                this.source = data;
                this.telMsg = data.eleInvoiceMobile; /*电话号码*/
                /**新增发票说明文字代码*/

                data.declareInfos.map((item,index)=>{
                    
                    if(item.key=='cart_invice_004'){
                        
                       this.addedInvoiceText =data.declareInfos[index].value;
                        
                    }
                })
                /*增票寄送*/
                
                if(data.vatInvoiceInfo){
                    /*增值税发票状态*/  //0=通过;1=未申请;2=过期;3=审核中;4=待审核;5=用户没有通过手机激活账号;6=包含百货类商品;7=包含延保商品; ps：0正常展示增票信息，1-4不展示增票信息，展示地址信息，5-7不展示增票
                    this.vatState = data.vatInvoiceInfo.vatState;

                    /*同步增票地址*/
                    this.addressArry.provinceId = data.vatInvoiceInfo.vatInvoiceShipingInfo.provinceId
                    this.addressArry.cityId     = data.vatInvoiceInfo.vatInvoiceShipingInfo.cityId
                    this.addressArry.districtId = data.vatInvoiceInfo.vatInvoiceShipingInfo.districtId
                    this.addressArry.townId     = data.vatInvoiceInfo.vatInvoiceShipingInfo.townId
                    //同步数据
                    this.addressArry.provinceName = data.vatInvoiceInfo.vatInvoiceShipingInfo.provinceName 
                    this.addressArry.cityName     = data.vatInvoiceInfo.vatInvoiceShipingInfo.cityName
                    this.addressArry.districtName = data.vatInvoiceInfo.vatInvoiceShipingInfo.districtName 
                    this.addressArry.townName     = data.vatInvoiceInfo.vatInvoiceShipingInfo.townName

                    this.shippingAddress = this.addressArry.provinceName
                                            + this.addressArry.cityName
                                            + this.addressArry.districtName 
                                            + this.addressArry.townName  //增票寄送区域
                    this.shippingName = data.vatInvoiceInfo.vatInvoiceShipingInfo.shippingName ;    //增票寄送姓名
                    this.shippingPhone = data.vatInvoiceInfo.vatInvoiceShipingInfo.shippingPhone; //增票寄送电话
                    this.shippingarea = data.vatInvoiceInfo.vatInvoiceShipingInfo.shippingAddress //增票寄送详细地址
                   
                }
                /*发票信息 需要发票 and 不需要发票*/
                //设置状态 是否需要发票  0 需要发票 1： 不需要发票
                if(data.invoiceBox){
                    this.invoiceInfo = data.invoiceBox.map(item =>{  
                        if(item.code==1 && item.selected=='Y'){
                            this.isNeedInvoice ='1';   
                            this.invoiceInfoShow = false;
                        }else{
                            this.isNeedInvoice ='0';
                            this.invoiceInfoShow = true;
                        }
                        return{
                            content: item.label,
                            isActive: item.selected == 'Y' ? true : false,
                            code:item.code,
                        }
                        
                    });
                    
                }
                
                /*发票类型循环*/
                this.typeData = data.invoiceTypeBox.map( (item, index) => {
                   
                    var result = {
                        content: item.label,
                        isActive: item.selected == 'Y' ? true : false,
                        code:item.code,
                        value:item.value,
                        source: item,
                        declare:item.declare //发票声明文字
                    }
                    this.invoiceInit(result);
                    
                    if(item.selected == 'Y'){
                        
                        this.declare = item.declare;
                        this.invoiceType = item.code /*初始状态发票类型值*/
                        
                        if(item.invoiceHead){
                            /*获取初始状态发票抬头值*/
                            item.invoiceHead.map( headItem => {
                            if(headItem.selected == 'Y'){
                                    this.invoiceTitleType = headItem.code,/*获取初始状态发票抬头值*/
                                    this.invoiceTitle = headItem.value //原始数据的发票抬头值
                                 if(headItem.code=='2'){
                                    this.companytaxNumber = headItem.taxNo
                                }   
                            }
                            
                            })
                        }
                        
                        this.currentSeletedIdx = index;
                    }
                    return result
                });
                
                /*发票内容选择循环*/
                if(data.invoiceClasses[0].invoiceContexts){
                    this.contData = data.invoiceClasses[0].invoiceContexts.map( (item, index) => {
                        var result = {
                            content: item.label,
                            isActive: item.selected == 'Y' ? true : false,
                            code:item.code,
                            source:item
                        };
                        this.contextType(result);
                        if(item.selected=='Y'){
                            this.contextTypeId = item.code; /*页面初始返回的发票内容*/
                        }
                        return result
                        
                    });
                }
                /*增票发票内容循环*/
                if(data.vatInvoiceClasses){
                    this.inncreaseTicket = data.vatInvoiceClasses.map((item,index) =>{
                    
                        var result = {
                            content: item.label,
                            isActive: item.selected == 'Y' ? true : false,
                            code:item.code,
                            source:item
                        };
                        this.contextType(result);
                        if(item.selected=='Y'){
                            this.contextTypeId = item.code; /*页面初始返回的发票内容*/
                        }
                        return result
                    })
                }
                
                
                 
            }.bind(this));
            /*四级区域*/
            eventbus.only('addressSelector.exit', () => {
                if(!this.$store || !this)return;
                const currentArea = this.$store.getters['addressSelector/getCurrentArea'].map(function(item){
                    return item.name
                });
                
                if(currentArea && currentArea.length == this.$store.getters['addressSelector/getLevel']){
                        this.shippingAddress = currentArea.join('');
                        
                }
                //同步数据
                this.addressArry.provinceId = this.$store.getters['addressSelector/getAddress']['areaLv1'].code
                this.addressArry.cityId     = this.$store.getters['addressSelector/getAddress']['areaLv2'].code
                this.addressArry.districtId = this.$store.getters['addressSelector/getAddress']['areaLv3'].code
                this.addressArry.townId     = this.$store.getters['addressSelector/getAddress']['areaLv4'].code
                //同步数据
                this.addressArry.provinceName = this.$store.getters['addressSelector/getAddress']['areaLv1'].name
                this.addressArry.cityName     = this.$store.getters['addressSelector/getAddress']['areaLv2'].name
                this.addressArry.districtName = this.$store.getters['addressSelector/getAddress']['areaLv3'].name
                this.addressArry.townName     = this.$store.getters['addressSelector/getAddress']['areaLv4'].name
                
                this.$router.back();
            })
        },
        //TODO 1.radioSource 静态数据 和 2.自有状态（自定义）获取，初始化和数据状态的变化
        //TODO 命名： radioSource, 别怕变量名长
        methods: {
            //初始化数据  0是纸质 1是电子 2是增值税发票
            invoiceInit (item) {
                
                if(item.isActive && item.code=="1"){  
                    this.tipShow = true;
                }
                
                if(item.source.invoiceHead){  //发票抬头选项
                    
                    if(item.isActive){
                        this.invoiceHead = item.source.invoiceHead.map( headItem => {
                            return {
                                content: headItem.label,
                                code: headItem.code,
                                isActive: headItem.selected == 'Y' ? true : false,
                                value:headItem.value,
                                //item: headItem
                            }
                            
                        })
                    }
                    

                    
                }
                
                //TODO 初始化的时候获取titletype等
                //TODO 1:封装方法
                //this.invoiceType = item.source.code;
                
            },
            /*发票信息切换*/
            isNeedInvoiceInit(item){
                
                if(item.code==0){
                    this.isNeedInvoice ='0';
                    this.invoiceInfoShow = true;
                    
                }else{
                    
                    this.isNeedInvoice ='1';
                   
                    this.invoiceInfoShow = false;
                }
            },
            /*发票类型切换*/
            invoiceSelected (item,index) {
                
                if(item.source.invoiceHead){
                    this.invoiceHead = item.source.invoiceHead.map( headItem => {
                        return {
                            content: headItem.label,
                            code: headItem.code,
                            isActive: headItem.selected == 'Y' ? true : false,
                            item: headItem,
                            value:headItem.value
                            }
                    
                        
                    })
                }
                
               
               
                this.declare = this.typeData[index].declare;
                // 0 纸质  1 电子  2 增税
                if(item.code == '0'){ 
                    this.tipShow = false;
                }else if(item.code == '1'){
                    this.tipShow = true;
                }else if(item.code == '2'){
                    this.isShow == false;
                    this.tipShow = false;
                }else{
                    this.isNeedInvoice ='1'  
                }
                    this.invoiceType = item.code; /*切换发票类型时获取发票类型*/
                    this.currentSeletedIdx = index;
                if(item.source.invoiceHead){
                     item.source.invoiceHead.map(item2 =>{
                    
                        if(item2.selected=='Y'){
                            this.invoiceTitleType = item2.code;
                            this.invoiceTitle = item2.value 
                        }
                    })
                }
                
                //TODO 发票类型改变的时候获取titletype等
                //TODO 1:封装方法
                //this.TitleType(headItem);
                //this.invoiceType = item.source.code;
            },
            /*获取发票抬头类型方法*/
            TitleType(item){
                
                this.invoiceTitle = item.value; /*切换类型*/
                this.invoiceTitleType = item.code;
                if(item.isActive){
                    //this.invoiceTitleType = item.code;
                    if(item.code!=='2'){
                        this.companytaxNumber = '',
                        console.log(this.companytaxNumber);
                    }
                   
                }
                
            },
            /*获取发票类型*/
            getInvoiceType(item){
                item.map( titleTypeItem => {
                    if(titleTypeItem.isActive){
                        //this.invoiceTitleType = titleTypeItem.code; //发票类型改变的时候获取相对应得发票抬头类型
                       this.invoiceTitle = titleTypeItem.item.value; //发票类型改变的时候获取相对应得发票抬头内容
                    }
                    
                })
                
            },
            /*发票内容*/
            contextType(item){
                if(item.isActive){
                   this.contextTypeId = item.code;
                }
                
            },
            save () {
                /*判断是否输入单位名称和单位税号*/
                
                    http({
                    url: '//' + location.host + '/order_ajax.html',
                    type:'post',
                    data: {
                        act: 'saveUnionInvoiceV2',
                        json: JSON.stringify({
                            elecMobile: this.telMsg, //电子发票电话号码
                            "invoiceContentArray": [
                                {
                                    "contextTypeId": this.contextTypeId,
                                    "invoiceClassId": "-1"
                                }
                            ],
                            "invoiceTitle":  this.invoiceTitle,   //填写抬头
                            "invoiceTitleType": this.invoiceTitleType, //发票抬头类型
                            "invoiceType": this.invoiceType, //发票类型
                            "isNeedInvoice": this.isNeedInvoice, //是否需要发票
                            "shippingName": this.shippingName,
                            "shippingPhone": this.shippingPhone,
                            "shippingAddress": this.shippingarea,
                            "businessType": 1, //购物车业务类型
                            "provinceName": this.addressArry.provinceName,
                            "cityName": this.addressArry.cityName,
                            "districtName": this.addressArry.districtName,
                            "townName": this.addressArry.townName,
                            "provinceId": this.addressArry.provinceId,
                            "cityId": this.addressArry.cityId,
                            "districtId": this.addressArry.districtId,
                            "townId": this.addressArry.townId,
                            "taxNo":this.companytaxNumber    //企业税号

                        })
                    }
                })
                .then((data) => {
                    if(data.isSuccess=='Y'){
                        this.$router.back();
                    }else{
                        new Toast(data.failReason);
                    }                 
                })
                
                
                
            },
            /**
             * 打开四级地址选择弹层
             */
            editAddress () {
                
                this.$store.commit('addressSelector/setAddressCode', {
                    province_id: this.addressArry.provinceId,
                    city_id: this.addressArry.cityId,
                    disctrict_id: this.addressArry.districtId,
                    town_id: this.addressArry.townId,
                    
                })
                this.$store.commit('setLock', -1);
                this.$store.commit('setAddressType', 'default');
                this.$store.commit('setIndex', 3);
                this.$store.commit('setLevel', 4);
                this.$nextTick(() => {
                    this.$router.push('/invoice/addressSelector')
                })
                
                
            },
            
        },
        mounted: function(){

        },
    });

</script>
<style lang='less'>
    @import '../less/order.less';
    
    .invoice-cont{
        
        .input-box {
            .flexitem(1);
            .flexbox();
            .flexbox.v_center;
           
            margin-left: @font-lg * .5;
            height: @font-sm * 3.3;
            // line-height: @font-sm * 1.5;
            .border-nm(#e4e4e4);
            .boxSizing();
            padding: 0 (@font-lg-sm * .5);
            border-radius:.08rem;
            input {
                
                .flexitem(1);;
                .set-ellipsis-line(1);
            }
            .address-input{
                .flexitem(1);;
                .set-ellipsis-line(1);
                line-height: @font-lg-sm;
            }
            .down-icon{
                float:right;
                
                width: .13rem;
                height: .26rem;
                .background-image-nm(url(../images/arrow.png));
                
            }
        }
    }
    .invoice-type{
        padding-bottom: @font-sm;
        .desc{
            color: @gray-light;
            margin-bottom: @font-sm;
            font-size: @font-nm-sm;
        }
       
    }
    .invoice-class{
        .flexbox();
        .flexbox.v_center;
        .set-line-height(1;.66rem;);
        .module();
        .radio-for{
            .hor_padding()
        };
        
    }
    .invo-man-phone{
        .flexbox();
        .flexbox.v_center;
        padding: (@font-sm * 1.5) @font-sm;
        background: @white;
        .module();
        
    }
    .pay-type.invoice-title{
        padding: .3rem .2rem .3rem .2rem;
        
        .invoiceHead{
            .flexbox();
            .flexbox.v_center;
        }
        .radio{
            .flexbox();
            .flexbox.v_center;
            margin-bottom: .24rem;
            margin-right:.48rem;
            i{
                display: inline-block;
                width: .32rem;
                height: .32rem;
                background-size: 100% 100%;
                margin-right: .2rem;
                .background-image-nm(url(../images/radio_no.png));
            }
            &.active i{
                .background-image-nm(url(../images/radio_yes.png));
            }
            &:last-child{
                margin-right:0;
            }
        }
        .invoiceContent{
            .invoice-info{
                .flexbox();
                .flexbox.v_center;
                margin-top:.2rem;
            }
        }
        .explain-text{
            color:#999;
            font-size:.24rem;
            margin-top:.1rem;
            line-height:.33rem;
        }
    }
    .invoice-cont{
        .subtitle{
            .module();
        }
        .desc{
            color: @gray-light;
            .module();
            line-height: @font-nm;
            font-size: @font-nm-sm;
        }
        .prompt-desc{
            color: @red;
            .module();
            line-height: @font-nm + .05rem;
            font-size: @font-nm-sm;
        }
        .invoice-desc{
            padding-bottom:.2rem;
        }
    }
    .invoice-qualification{
        li{
            .flexbox();
            .flexbox.v_center;
            color: #333;
            margin-bottom: .22rem;
            span{
                color:#999;
            }
            p{
                .flexitem(1);
            }
        }
    }
    .increase-ticket{
        li{
            margin-bottom: .22rem;
            .flexbox();
            label{
                display:inline-block;
                line-height:.64rem;
                width:1.4rem;
                
            }
            .input-box{
                // .flexitem(1);;
                border-radius: .08rem;
            }
            textarea{
                .flexitem(1);
                border-radius: .08rem;
                margin-left: .18rem;
                padding: .18rem .16rem;
                .border-nm(@input-borcolor);
                .boxSizing();
                resize:none;
                line-height: .3rem;
            }
           
        }
    }
</style>