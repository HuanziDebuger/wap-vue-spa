/*
 * @Author: zhaoye 
 * @Date: 2017-02-04 12:15:16 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-04-13 18:04:27
 */
<template>
    <caside class="address-selector" :position="80">
        <scroller class="as-partial addr-selected-list " :direction="'horizontal'">
            <div 
                class="tab" 
                :class="{'active': index === idx , 'disabled': idx <= lock}" 
                v-for="(item, idx) in $store.getters['addressSelector/getCurrentArea']" 
                @click="onClick(idx)"
                >{{item.name}}</div>
        </scroller>
        <swiper ref="swiper" :list="list" :options="options" >
            <slider slot="slider" v-for="(item, idx) in list" :options="options" class="addr-list-box">
                <scroller ref="scrollers" :direction="'vertical'" >
                    <list v-if="address" :index="idx"></list>
                </scroller>
            </slider>
        </swiper>
    </caside>
</template>
<script>
import Vue from 'vue';
import {Aside, Swiper, Slider, Scroller, Toast} from 'gome-ui-kit';
import list from './addressList.vue';
import eventbus from 'gome-utils-eventbus';
import http from 'gome-utils-http';
import cookie from 'gome-utils-cookie';
export default Vue.extend({
    components: {
        'caside': Aside,
        'swiper': Swiper,
        'scroller': Scroller,
        'slider': Slider,
        'list': list
    },
    data () {
        return {
            list: [1,2,3,4],
            options: {
                //  wrapperWidth: 414,
                perSliders: 1,
                dontDrag: true
            },
            url: '//' + window.location.host + '/public/addressArea',
            index: this.$store.getters['addressSelector/getIndex'],
            lock: this.$store.getters['addressSelector/getLock'],
            address: {}
        }
    },
    created () {
        this.$store.subscribe((mutations, state) => {
            if(mutations.type == "scrollTo"){
                if(this.$refs.swiper)
                    this.$refs.swiper.scrollTo(this.$store.getters['addressSelector/getIndex']);
            }
        });
        let data = {
            addr_type: this.$store.getters['addressSelector/getType'],
        }
        //有bug先注释
        if(data.addr_type == '4' || data.addr_type == 'store'){
            data.lv_one = this.$store.getters['addressSelector/getAddressCode'].province_id || cookie.parse().gps_provinceid
            data.lv_two = this.$store.getters['addressSelector/getAddressCode'].city_id || cookie.parse().gps_cityid
            data.lv_thr = this.$store.getters['addressSelector/getAddressCode'].district_id || cookie.parse().gps_districtid
        }else{
            data.lv_one = this.$store.getters['addressSelector/getAddressCode'].province_id || cookie.parse().gps_provinceid
            data.lv_two = this.$store.getters['addressSelector/getAddressCode'].city_id || cookie.parse().gps_cityid
            data.lv_thr = this.$store.getters['addressSelector/getAddressCode'].district_id || cookie.parse().gps_districtid
            data.lv_fou = this.$store.getters['addressSelector/getAddressCode'].town_id || cookie.parse().gps_townid
        }
        
        http({
            url: this.url,
            type: 'post',
            data
        })
        .then(data => {
            this.$store.commit('updateAddressSelector', {
                data
            })
            this.address = this.$store.state.$addressSelector.data;
            console.log(this.address)
            
            this.$store.commit('scrollTo', this.$store.getters['addressSelector/getIndex'])
        },xhr => {
            try{
                new Toast(JSON.parse(xhr.responseText).failReason)
            }catch(e){
                new Toast('获取四级地址失败')
            }
        })
    },
    mounted () {
        eventbus.on('swiper.scrollTo', index => {
            this.index = index
        }, this.$refs.swiper._uid)
        //TODO !!!! 这里的scroller高度计算还是有问题，目前先强行算了，囧啊
        var scrollers = this.$el.querySelectorAll('.scroller-container');
        var tab = scrollers[0];
        for(var i=1; i < scrollers.length; i++){
            var el = scrollers[i];
            el.style.height= (document.documentElement.clientHeight - tab.offsetHeight) + "px";
        }
    },
    methods: {
        onClick (index) {
            if(this.$store.getters['addressSelector/getLock'] > index-1 && this.$store.getters['addressSelector/getLock'] != 0){
                return;
            }
            this.index = index;
            this.$store.commit('scrollTo', index)
            //this.$refs.swiper.scrollTo(index)
        },
    }
})
</script>
<style lang='less'>
     @import './less/addessSelect.less';
    .addr-selected-list{
        background-color: @white;
        .border-bot(@gray-dark-border);
        box-sizing: border-box;
        height:.9rem;
        .scroller{
           line-height:.9rem; 
        }
    .tab {
        height:.9rem;
        line-height:.8rem;
        .flexbox();
        text-align:center;
        box-sizing: border-box;
        font-size: @font-nm;
        margin: 0 .15rem;
        &.active {
            color: @red;
            height:100%;
            border-bottom: .04rem solid @red;
        }
        &.disabled {
            color: @gray-light;
        }
    }
}
    
</style>