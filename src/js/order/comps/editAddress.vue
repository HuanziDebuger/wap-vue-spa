<template>
    <page>
        <navigator>{{title}}</navigator>
        <div class="add_address">
            <ul class="list">
                <li class="item consignee">
                    <label class="title">收货人：</label><input v-model="info.name" class="desc" type="text" placeholder="" >
                </li>
                <li class="item phoneno">
                    <label class="title">手机号码：</label>
                    <input v-model="info.mobile" placeholder=""  class="desc" type="tel" maxlength="11" @click="onClick" @change="onInput" @input="onInput" :placeholder="info.placeholder" @blur="onBlur">
                </li>
                <li @click="editAddress" class="item nav address_area">
                    <span class="title">选择地区：</span>
                    <span class="desc" :class="[info.combindAddress == '请选择' ? 'addr_tip' : '']">
                        {{info.combindAddress}}
                    </span>
                    <i class="link-ico"></i>
                </li>
                <li class="item detail_address">
                    <label class="title">详细地址：</label><input class="desc" placeholder="" type="text" v-model="info.address">
                </li>
            </ul>
            <div class="save_btn">
                <btn @click.native="save" :class-name='"btn default red block"'>保存</btn>
            </div>
            <transition name="aside">
                <router-view></router-view>
            </transition>
        </div>
    </page>
</template>
<script>
    import Vue from 'vue';
    import {Button,Toast, Page} from 'gome-ui-kit';
    import http from 'gome-utils-http';
    import query from 'gome-utils-query';
    import eventbus from 'gome-utils-eventbus';
    import Nav from '../widgets/nav/nav.vue';
    import islogin from '../utils/islogin.js';
    export default Vue.extend({
        components: {
            'btn': Button,
            'page': Page,
            navigator: Nav
        },
        data () {
            return {
                //需要修改的地址的序号
                index: -1,
                info: {
                    name: '',
                    mobile: '',
                    combindAddress: '请选择',
                    address: '',
                    placeholder: '',
                },
                num:'',
                title: '添加新地址',
            }
        },
        created () {
            this.$watch('info.mobile',function(val){
                
                this.info.mobile = val;
            });
            if(!this.$store.state.$address.data){
                http({
                    url: '//' + location.host + '/order_ajax.html',
                    type:'post',
                    data: {
                        act: 'addressList',
                        json: JSON.stringify({
                            businessType: query.parse(window.location.search).source || 1,
                        })
                    }
                })
                .then(islogin)
                .then(function(data){
                    this.$store.commit('updateAddress', data)
                    
                    this.getEditingAddress()

                }.bind(this))
            }else{
                this.getEditingAddress()
            }

            eventbus.only('addressSelector.exit', () => {
                if(!this.$store || !this)return;
                const currentArea = this.$store.getters['addressSelector/getCurrentArea'].map(function(item){
                    return item.name
                });
                if(currentArea && currentArea.length == this.$store.getters['addressSelector/getLevel']
                    && currentArea[currentArea.length] != '请选择'){
                        this.info.combindAddress = currentArea.join('');
                }
                //同步数据
                this.info.provinceId = this.$store.getters['addressSelector/getAddress']['areaLv1'].code
                this.info.cityId     = this.$store.getters['addressSelector/getAddress']['areaLv2'].code
                this.info.districtId = this.$store.getters['addressSelector/getAddress']['areaLv3'].code
                this.info.townId     = this.$store.getters['addressSelector/getAddress']['areaLv4'].code
                //同步数据
                this.info.provinceName = this.$store.getters['addressSelector/getAddress']['areaLv1'].name
                this.info.cityName     = this.$store.getters['addressSelector/getAddress']['areaLv2'].name
                this.info.districtName = this.$store.getters['addressSelector/getAddress']['areaLv3'].name
                this.info.townName     = this.$store.getters['addressSelector/getAddress']['areaLv4'].name

                this.$router.back();
            })

        },
        methods:{
            /**
             * 打开四级地址选择弹层
             */
            editAddress () {
                this.$store.commit('setAddressType', 'default');
                this.$store.commit('setLevel', 4);
                if(this.$route.params.id){
                    this.$store.commit('setIndex', 3);
                    this.$store.commit('setLock', -1);
                    this.$router.push('/address/edit/' + this.$route.params.id + '/addressSelector')
                }else{
                    this.$store.commit('setIndex', 0);
                    this.$store.commit('setLock', -1);
                    this.$router.push('/address/add/addressSelector')
                }
            },
            onClick: function(){
                if(this.info.mobile == this.num){
                    this.info.mobile='';
                }

            },
            onBlur: function(){
                if(!this.info.mobile){
                    this.info.mobile = this.num;
                }
            },
            onInput: function(){
                
                if(this.info.mobile.match(/[^\d]+/)){
                    this.info.mobile = this.info.mobile.replace(/[^\d]+/,'')
                }
            },
            getEditingAddress () {
                //组合地址数据
                
                this.$store.state.$address.data.addressList.forEach( (item, index) => {
                    
                    if(item.id == this.$route.params.id){
                        this.index = index;
                    }
                })
                if(this.index >= 0){
                    const data = this.$store.state.$address.data.addressList[this.index]
                    for(let key in data){
                        this.info[key] = data[key];
                    }
                    this.info.combindAddress = data.provinceName + data.cityName + data.districtName + data.townName || '请选择',
                    this.info.placeholder = data.mobile ;
                    this.num = data.mobile;
                    
                    this.$store.commit('addressSelector/setAddressCode', {
                        province_id: data.proviceId,
                        city_id: data.cityId,
                        disctrict_id: data.districtId,
                        town_id: data.townId,
                    })
                }
                
            },
            save () {
                if(this.info.name && this.info.mobile &&this.info.address){
                    http({
                        url: '//' + location.host + '/ucenter/addAndUpdataOperate',
                        type: 'post',
                        data: {
                            add_id:      this.info.id || '',
                            consignee:   this.info.name,
                            mobile:      this.info.mobile,
                            province_id: this.info.provinceId,
                            city_id:     this.info.cityId,
                            district_id: this.info.districtId,
                            town_id:     this.info.townId,
                            address:     this.info.address,
                            source:      query.parse(window.location.search).source || '1',
                            isDefault:   'Y'
                        }
                    })
                    .then(islogin)
                    .then((data) => {
                        if(data.update_res == 1){
                            this.$router.back();
                        }else{
                            new Toast(data.failReason);
                        }
                        
                    })
                    .catch((xhr) => {
                        try{
                            var json = JSON.parse(xhr.responseText);
                            new Toast(json.failReason);
                        }catch(e){
                            new Toast('修改默认地址失败');
                        }
                    })
                }
                
            }
        }
    });
</script>
<style lang='less'>
    @import '../less/order.less';
    
    .add_address{
        .list{
            margin-bottom: .8rem;
            padding-left: .3rem;
            background-color: @white;
            .item {
                .flexbox();
                .flexbox.v_center;
                padding-right: .2rem;
                .set-line-height(1;.88rem;);
                .border-bot(@gray-dark-border);
                font-size: @font-nm-sm + .02rem;
                &.detail_address {
                    border-bottom: none;
                }
                .title{
                    width: 1.4rem;
                    color: @gray;
                    text-align: right;
                }
                .desc{
                    .layout.flex1;
                    color: @gray-dark;
                    text-align: left;
                    margin-right: .24rem;
                    line-height: .8rem;
                    color: @gray;
                    .set-ellipsis();
                    &.addr_tip{
                        text-align: right;
                    }
                }
            }
        }
        .save_btn{
            padding: 0 .25rem;
            margin-bottom: .4rem;
            .btn{
                .set-line-height(1;.84rem;);
                font-size: @font-lg-sm;
                border-radius: 1rem;
            }
        }
    }

 
</style>