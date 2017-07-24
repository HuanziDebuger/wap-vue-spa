/*
 * @Author: zhaoye 
 * @Date: 2017-02-04 12:15:13 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-23 21:24:50

 */
<template>
    <ul v-if="radioStore" class="addr-list">
        <li  v-for="(item, idx) in radioStore" @click="onClick(idx)">
            <Radio v-if="(type == '4' || type == 'store') && index == 3"
                    :source="radioStore" 
                    :index="idx" 
                    @onClick="onRadioClick"
                    class ="shop-info-list"
                    >

                    <p slot="post" class="number">{{item.phone}}</p>
                    <p slot="post" class="shop-info-address">{{item.address}}</p>
            </Radio>
            <Radio v-else 
                    :source="radioStore" 
                    :index="idx" 
                    @onClick="onRadioClick"
                    >
                <i slot="post" class="check-icon"></i>
            </Radio>
        </li>
    </ul>
    <div v-else-if="(type == '4' || type == 'store')" class="logistics_distribution">
        <p>所在地区没有门店</p>
        <p>您可以改为物流配送，将直接送货上门</p>
        <router-link to="/">
            <button>改为物流配送</button>
        </router-link>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {RadioItem, RadioMixin} from 'gome-ui-kit';
    import http from 'gome-utils-http';
    import eventbus from 'gome-utils-eventbus'
    export default Vue.extend({
        props: ['index'],
        mixins: [RadioMixin],
        components: {
            Radio: RadioItem,
        },
        data () {
            return {
                radioStore: [],
                type: ''
            }
        },
        created () {
            this.type = this.$store.getters['addressSelector/getType']
            this.$store.subscribe((mutations, state) => {
                if(mutations.type == "setAddressType"){
                    this.type = this.$store.getters['addressSelector/getType']
                }
            });
            this.$store.watch(state => {
                
                if(state.$addressSelector.data){
                    if(state.$addressSelector.data['areaLv' + (this.index + 1)]
                       && state.$addressSelector.data['areaLv' + (this.index + 1)].length > 0){
                        this.radioStore = state.$addressSelector.data['areaLv' + (this.index + 1)].map((item, index) => {
                            return {
                                isActive: item.current,
                                content: item.name,
                                phone: item.phone || '',
                                address: item.address || '',
                            }
                        })
                    }else{
                        this.radioStore = null;
                    }
                }
            })
        },
        methods: {
            _numberToString (index) {
                let result = ''
                switch (index) {
                    case 1:
                        result = 'one';
                        break;
                    case 2:
                        result = 'two';
                        break;
                    case 3:
                        result = 'thr';
                        break;
                    case 4:
                        result = 'four';
                        break;
                }
                return result;
            },
            onClick (idx) {
                if(this.index < this.$store.getters['addressSelector/getLevel'] - 1){
                    this.getNextArea(idx)
                }else{
                    //修改当前级
                    this.$store.commit('updateAddressSelector', {
                        idx
                    })
                    const addressCode = {
                        province_id: this.$store.getters['addressSelector/getAddress']['areaLv1'].code,
                        city_id: this.$store.getters['addressSelector/getAddress']['areaLv2'].code,
                        district_id: this.$store.getters['addressSelector/getAddress']['areaLv3'].code,
                    }
                    if(this.$store.getters['addressSelector/getType'] != 'store' && this.$store.getters['addressSelector/getType'] != '4'){
                        addressCode.town_id = this.$store.getters['addressSelector/getAddress']['areaLv4'].code
                    }
                    this.$store.commit('addressSelector/setAddressCode', addressCode)
                    //门店四级地址
                    //前两级锁定，所以只更新这个级别
                    // if(this.$store.getters['addressSelector/getType'] == 'store' || this.$store.getters['addressSelector/getType'] == '4'){
                    //     this.$store.commit('updateStore', {
                    //         storeId: this.$store.getters['addressSelector/getAddress']['areaLv4'].code,
                    //         address: this.$store.getters['addressSelector/getAddress']['areaLv4'].address,
                    //         storePhone: this.$store.getters['addressSelector/getAddress']['areaLv4'].phone,
                    //         storeName: this.$store.getters['addressSelector/getAddress']['areaLv4'].name,
                    //         districtId: this.$store.getters['addressSelector/getAddress']['areaLv3'].code,
                    //         districtName: this.$store.getters['addressSelector/getAddress']['areaLv3'].name,
                    //     })
                    // }
                    eventbus.emit('addressSelector.exit')
                }
            },
            getNextArea (idx) {
                if(this.$store.getters['addressSelector/getData']['areaLv' + (this.index + 1)][idx]['current']){
                    return;
                }
                const data = {
                    addr_type: this.$store.getters['addressSelector/getType'],
                }
                data['lv_' + this._numberToString(this.index + 1)] = this.$store.getters['addressSelector/getData']['areaLv' + (this.index + 1)][idx]['code'];

                http({
                    url: '//' + window.location.host + '/public/addressArea',
                    type: 'post',
                    data
                })
                .then(data => {
                    //修改当前级
                    this.$store.commit('updateAddressSelector', {
                        data,
                        idx
                    })
                    this.$store.commit('scrollTo', this.index + 1)
                },xhr => {
                    try{
                        new Toast(JSON.parse(xhr.responseText).failReason)
                    }catch(e){
                        new Toast('获取四级地址失败')
                    }
                })
            }
        }
    })
</script>
<style lang='less'>
    @import './less/addessSelect.less';
    .addr-list {
		.radio{
            &.active {
                .check-icon {
                    background: url('../../images/red_check.png') no-repeat center;
                }
            }
		}
	}
    .logistics_distribution {
        margin-top: @font-sm * 10;
        text-align: center;
        font-size: .26rem;
        color: #666;
        p {
            margin-top: .2rem;
        }
        button {
            width: 2.8rem;
            height: .72rem;
            line-height: .72rem;
            text-align: center;
            font-size: .3rem;
            background-color: @theme;
            color: @white;
            margin-top: .3rem;
            border-radius: .4rem;
        }
    }
</style>