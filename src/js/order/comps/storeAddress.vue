/*
 * @Author: zhudanmei 
 * @Date: 2017-01-22 11:47:29 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-22 22:10:30
 * 门店四级地址选择页面
 */
<template>
    <!--地址模块-->
    <page>
        <navigator>选择自提门店</navigator>
        <div class="tip-cont"><p><span class="tip-icon"></span>{{$store.state.data.declareInfos[0].value}}</p></div>
        <div class="add-address ">
            <div class="item address-area" @click="editAddress(2)">
                <span class="title">所在区域：</span>
                    <p class="info address"><span class="disable">{{addressdisable}}</span >{{address}}</p>
                    <i class="link-ico"></i>
            </div>
        </div>
        <ul v-if="radioStore" class="addr-list store-list">
            <li  v-for="(item, idx) in radioStore" >
                <Radio 
                    :source="radioStore" 
                    :index="idx" 
                    @onClick="onRadioClick"
                    class ="shop-info-list"
                    @click.native="save(item,idx)"


                    >
                    <span slot="post" v-if="item.isLately =='Y'" class="recommend-tag">推荐</span>
                    <span slot="post" class="distance">{{item.distanceDesc}}</span>
                    <p slot="post" class="shop-info-address">{{item.address}}</p>
                    <p slot="post" class="businessHours">营业时间:{{item.businessHours}}</p>

                </Radio>
                <p slot="post" class="number">电话:<a v-for="(phoneItem,index) in item.phone" :href="call(phoneItem)"> <span v-if="index!==0">/</span>{{phoneItem}}</a></p>
                
            </li>
        </ul>
        <div v-else class="null-cont">
            <img src="../images/null.png">
            <div class="logistics_distribution">
                <p>所在地区没有门店</p>
                <p>您可以改为物流配送，将直接送货上门</p>
                <a href="#/" class="router-link-active">
                    <button>改为物流配送</button>
                </a>
            </div>
            
        </div>
        <transition name="aside">
            <router-view></router-view>
        </transition>
    </page>
</template>
<script>
    import Vue from 'vue';
    import {Root, Page, Button, Toast, Modal,RadioItem, RadioMixin} from 'gome-ui-kit';
    import http from 'gome-utils-http'
    import httpFilters from 'gome-utils-http-filters';
    import query from 'gome-utils-query'
    import eventbus from 'gome-utils-eventbus'
    import Nav from '../widgets/nav/nav.vue';
    import islogin from '../utils/islogin.js';
    import cookie from 'gome-utils-cookie';
    export default Vue.extend({
        mixins: [RadioMixin],
        components: {
            page: Page,
            btn:Button,
            navigator: Nav,
            Radio: RadioItem,
            
            
        },
        computed: {
             addressdisable () {
                //前二级锁定，用配送的四级地址的
                return this.$store.state.data.address.provinceName + this.$store.state.data.address.cityName
            },
            address () {
                //第三级，如果没有选择过地址，则使用当前司机地址的第三级
                //如果配置过了地址了，则使用配置过的第三级地址
                return this.$store.getters['addressSelector/getCurrentArea'][2].name || this.$store.state.data.address.districtName
            },
            
        },
        
        data () {
            return {
                storeAddressList: [],
                radioStore: [],
                index: this.$store.getters['addressSelector/getIndex'],
                lock: this.$store.getters['addressSelector/getLock'],
                telphone:'',
            }
        },
        created () {
            
            this.type = this.$store.getters['addressSelector/getType']
            this.$store.subscribe((mutations, state) => {
                if(mutations.type == "setAddressType"){
                    this.type = this.$store.getters['addressSelector/getType']
                }
            });

            /*请求四级接口*/
            this.$store.commit('setAddressType', 'store');

            this.setAddressCode()
            this.updateAddressList()
            
            //侦听,取第四级别
            eventbus.only('addressSelector.exit', () => {
                if(!this.$store || !this)return;
                this.$router.back();
                this.updateAddressList();
            })
        },
        methods: {
            //查找是否有门店已经选择过
            matchStoreAddress (storeId) {
                const result = this.storeAddressList.filter(item => {
                    if(item.storeId == storeId)
                        return true
                })
                return result[0] ? result[0] : '';
            },
            /*电话**/
            call(telphone){
                return 'tel:'+telphone;
            },
            editAddress (index) {

                this.$store.commit('setLock', 1);
                //切换为四级地址控件门店类型
                this.$store.commit('setAddressType', 'store');
                this.$store.commit('setIndex', index);
                this.$store.commit('setLevel', 3);

                ///this.setAddressCode()

                this.$nextTick(() => {
                    this.$router.push('/storeAddress/addressSelector')
                })
                //return '/storeAddress/addressSelector'
            },
            updateAddressList () {
                const data = {
                    addr_type: this.$store.getters['addressSelector/getType'],
                    lv_one: this.$store.getters['addressSelector/getAddressCode'].province_id || cookie.parse().gps_provinceid,
                    lv_two: this.$store.getters['addressSelector/getAddressCode'].city_id     || cookie.parse().gps_cityid,
                    lv_thr: this.$store.getters['addressSelector/getAddressCode'].district_id || cookie.parse().gps_districtid,
                }
                if(this.$store.getters['addressSelector/getAddressCode'].town_id){
                    data.lv_fou = this.$store.getters['addressSelector/getAddressCode'].town_id
                }

                /*新加经纬度参数*/
                //上海
                // data.gpsLongitude = 121.473701 || '';
                // data.gpsLatitude = 31.230416 || '';
                // data.coordinateName = 'google' || '';
                //39.9591482006,116.4661567545
                //鹏润

                // data.gpsLongitude = 116.466156 || '' ;
                // data.gpsLatitude = 39.959148 || '';
                // data.coordinateName = 'google' || '';

                data.gpsLongitude = this.$store.state.longitude || '' || 116.466156;
                data.gpsLatitude = this.$store.state.latitude || '' || 39.959148;
                data.coordinateName = 'google' || '';
                

                http({
                    url: '//' + window.location.host + '/public/addressArea',
                    type: 'post',
                    data
                })
                .then(data => {
                    if(data.areaLv4.length>0){
                        this.radioStore = data.areaLv4.map((item, index) => {

                        return {
                            isActive: item.current,
                            content: item.name,
                            phone: item.phone.split('/') || '',
                            
                            address: item.address || '',
                            businessHours : item.businessHours || '', //营业时间
                            isLately:item.isLately, //是否是推荐
                            distanceDesc :item.distanceDesc ,//距离
                            code:item.code
                        }
                            

                        })
                    }else{
                        this.radioStore =null;
                    }
                    this.$store.commit('updateAddressSelector', {
                        data
                    })
                    this.address = this.$store.state.$addressSelector.data;
                },xhr => {
                    try{
                        new Toast(JSON.parse(xhr.responseText).failReason)
                    }catch(e){
                        new Toast('获取四级地址失败')
                    }
                })
            },
            setAddressCode () {
                let data
                if(this.$store.state.data.storeAddress){
                    data = {
                        //刷新当前四级区域记录
                        //前两级不变
                        province_id: this.$store.state.data.storeAddress.provinceId,
                        city_id: this.$store.state.data.storeAddress.cityId,
                        //第三级，如果首页没有storeAddress变量，即没选过地址，则使用配送地址的第三级
                        district_id: this.$store.state.data.storeAddress.districtId,
                        //第四季，如果首页没有storeAddress变量，即没选过地址，则使用配送地址的第四级
                        //门店的第四级地址，是storeId，不是地址code
                        town_id: this.$store.state.data.storeAddress.storeId,
                    }
                }else{
                    data = {
                        province_id: this.$store.getters['addressSelector/getCurrentArea'][0].code  || cookie.parse().gps_provinceid,
                        city_id:     this.$store.getters['addressSelector/getCurrentArea'][1].code  || cookie.parse().gps_cityid,
                        district_id: this.$store.getters['addressSelector/getCurrentArea'][2].code  || cookie.parse().gps_districtid,   
                        town_id:     this.$store.getters['addressSelector/getCurrentArea'][3].code  || cookie.parse().gps_townid,
                    }
                }

                
                this.$store.commit('addressSelector/setAddressCode', data)

            },
            /**
             * 提交请求，保存当前选中的门店四级地址
             */
            save (item,idx) {
                //修改当前级
                http({
                    url: '//' + location.host + '/order_ajax.html',
                    type: 'post',
                    data: {
                        act: 'modStorePickAddress',
                        json: JSON.stringify({
                            //门店id
                            storeId: item.code,
                            //门店地址id
                            //若传空，后台走新增逻辑
                            //若传地址，后台走修改逻辑
                            //但使用时发觉，已有地址，传空，也会走修改逻辑
                            //所以先不传了，有问题再改
                            addressId: this.matchStoreAddress(item.code),
                            //商品类型
                            businessType: query.parse(window.location.search).source || '1',
                        })
                    }
                })
                .then(httpFilters.default)
                .then(data => {
                    this.$router.back();
                })
                .catch(e => {
                    new Toast(e.message)
                })
                
            }
        },
    });
</script>
<style lang='less'>
@import '../less/order.less';

.address-area{
    .flexbox();
    background-color: @white;
    padding: 0 .2rem;
    .set-line-height(1;.72rem;);
    
    .title{
        display: inline-block;
        width:1.3rem;
    }
    border-bottom: .01rem #e6e6e6 solid;
    font-size: @font-dark;
    .flexbox.v_center;
    .address {
        .flex1();
        .ellipsis();
        .set-line-height(1;.72rem;);
        padding-right: .2rem;
        padding-left:.1rem;
    }
    .link-ico{
        .flexbox.v_center;
        
    }
}
.store-list{
    background-color: @white;
    
}
.store-list li{
    height: 100% !important;
        
}
.store-list .radio{
    .recommend-tag{
        
        .set-line-height(1;.26rem;);
        background-color: #f6a623;
        color: @white;
        padding: 0 .04rem;
        font-size:@font-nm-sm - .02rem;
        border-radius: .03rem;
    }
    .distance{
        float: right;
        color: #a2a4a6;
    }
}
.store-list li{
    .number{
        margin: .1rem 0 @font-nm-sm 0;
        font-size: @font-nm - .02rem;
        padding-left: .64rem;
        color: #a2a4a6;
        a{
            color: #197fe7;
        }
    }

}
.store-list .radio p
{
    padding-right: 1.24rem;
    

}
.null-cont{
    padding-top: 2rem;
    .flexbox.v_center;
    img{
        .set-width-height(1;2.2rem;);
       
        margin: 0 auto;
    }
    .logistics_distribution{
        margin-top: 0;
    }
}
/*覆盖控件样式*/
.store-list.addr-list .radio .radio-content{
    font-size: @font-nm + .02rem;
}
.store-list.addr-list .radio.active {
    color: @gray-dark;
}
</style>