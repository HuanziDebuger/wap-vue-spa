/*
 * @Author: zhaoye 
 * @Date: 2017-07-29 18:15:51 
 * @Last Modified by: liuhuan
 * @Last Modified time: 2017-09-08 15:37:20
 */
<template>
<div  @touchmove.prevent="function(){}" v-if="$store.state.filterCatList && $store.state.filterCatList.length > 0">
    <div class="tab-nav" :class="{catagoring: isCatagoryShow}">
        <div class="radio-container">
            <Radio @click.native="catagorySwitch(0)" :source="radioSource" :index="0" @onClick="onRadioClick" class="item">
                <i slot="post">
                    <span v-if="isCatagoryShow" class="up_arrow">上</span>
                    <span v-else class="gray-arrow" :class="{down_arrow:radioSource[0].isActive}">下</span>
                </i>
            </Radio>
            <Radio @click.native="priceSwitch(1)" :source="radioSource" :index="1" @onClick="onRadioClick" class="item">
                <i slot="post">
                    <span v-if="priceHighFirst" class="up_arrow">高</span>
                    <span v-else-if="priceLowFirst" class="down_arrow">低</span>
                    <span v-else>无</span>
                </i>
            </Radio>
            <Radio @click.native="saleFirst(2)" :source="radioSource" :index="2" @onClick="onRadioClick" class="item"></Radio>
            <Radio @click.native="commentFirst(3)" :source="radioSource" :index="3" @onClick="onRadioClick" class="item"></Radio>
        </div>
        <div class="catagory-container" v-show="isCatagoryShow">
            <div class="catagory-content">
                <Scroller :direction="'vertical'" class="catagory main-catagory">
                    <Radio  :key="index" v-for="(item, index) in catagoryRadioSource" :source="catagoryRadioSource" :index="index" @onClick="onRadioClick">
                    </Radio>
                </Scroller>
                <Scroller :direction="'vertical'" class="catagory sub-catagory">
                    <div :key="index" v-show="catagory.isActive"  v-for="(catagory, index) in catagoryRadioSource">
                        <Radio @click.native="subCataClick(item, index)" :key="idx" v-for="(item, idx) in catagory.cata" :source="catagory.cata" :index="idx" @onClick="onRadioClick" class="diffRadio">
                        </Radio>
                    </div>
                    <!--<Radio @click.native="subCatClick(item, index)" v-for="(item, index) in subCataRadioSource" :source="subCataRadioSource" :index="index" @onClick="onRadioClick"></Radio>-->
                </Scroller>
            </div>
            <div @click="catagoryHide" @touchmove="catagoryHide" class="catagory-blocker"></div>
        </div>
    </div>
    <div class="blocker" v-show="isCatagoryShow"></div>
</div>
<!--商品列表接口异常时，默认展示tab导航-->
<div v-else class="tab-nav">
    <div class="radio-container">
        <span class="item">全部分类</span>
        <span class="item">价格</span>
        <span class="item">销量</span>
        <span class="item">评价</span>
    </div>
</div>
</template>
<script>
import {RadioItem, RadioMixin, Page, Scroller, Button} from 'gome-ui-kit'
import eventbus from 'gome-utils-eventbus'
export default {
    mixins: [RadioMixin],
    components: {
        Radio: RadioItem,
        Page,
        Scroller,
        Button,
    },
    data () {
        return {
            lastPriority: 0,
            priceHighFirst: false,
            priceLowFirst: false,
            isCatagoryShow: false,
            radioSource: [
                {
                    isActive: true,
                    content: '全部分类',
                },
                {
                    isActive: false,
                    content: '价格'
                },
                {
                    isActive: false,
                    content: '销量'
                },
                {
                    isActive: false,
                    content: '评价'
                },
            ],
            catagoryRadioSource: [],
            subCataRadioSource: [],
        }
    },
    computed:{
    },
    created () {
        this.catagoryRadioSource.push({
            isActive: true,
            content: '全部分类',
            cata: [
                {
                    content: '全部分类',
                    isActive: true,
                    catId: ''
                }
            ]
        })
        this.$store.subscribe((mutation, state) => {
            if (mutation.type == 'syncCatagory') {
                this.catagoryRadioSource = []
                state.filterCatList.forEach(item => {
                    const cata = []
                    item.catList.map(cat => {
                        cata.push({
                            content: cat.catName,
                            isActive: false,
                            catId: cat.catId,
                        })
                    })
                    this.catagoryRadioSource.push({
                        isActive: false,
                        cata,
                        content: item.catName,
                        catId: item.catId,
                    })
                    
                })
                //默认展示第一项全部分类
                this.catagoryRadioSource.unshift({
                    isActive: true,
                    content: '全部分类',
                    cata: [
                        {
                            content: '全部分类',
                            isActive: true,
                            catId: ''
                        }
                    ]
                });
            }
        })
       
        
        
    },
    methods: {
        catagorySwitch (id) {
            this.lastPriority = id
            this.isCatagoryShow = this.isCatagoryShow ? false : true
            //重置价格状态
            this.priceHighFirst=false
            this.priceLowFirst = false
        },
        catagoryHide () {
            this.isCatagoryShow = false
        },
        async priceSwitch (id) {
            this.lastPriority = id
            this.catagoryHide()
            let sort           
            if(!this.priceHighFirst && !this.priceLowFirst){
                this.priceHighFirst = true
                this.priceLowFirst = false
                sort = 1
            }else{
                if(!this.priceHighFirst){
                    this.priceHighFirst = true
                    this.priceLowFirst = false
                    sort = 1
                }else{
                    this.priceHighFirst = false
                    this.priceLowFirst = true
                    sort = 2
                }
            }
            await this.$store.dispatch('getProductList', {
                reset: true,
                sort
            })
        },
        async saleFirst (id) {
            if(this.lastPriority == id)return
            this.lastPriority = id
            //重置价格状态
            this.priceHighFirst=false
            this.priceLowFirst = false
            this.catagoryHide()
            await this.$store.dispatch('getProductList', {
                reset: true,
                sort: 3
            })
        },
        async commentFirst (id) {
            if(this.lastPriority == id)return
            this.lastPriority = id
            //重置价格状态
            this.priceHighFirst=false
            this.priceLowFirst = false
            this.catagoryHide()
            await this.$store.dispatch('getProductList', {
                reset: true,
                sort: 4
            })
        },
        async subCataClick (subCatagory,index) {
            this.catagoryRadioSource.forEach((subCata, idx) => {
                if(index != idx){
                    subCata.cata.forEach(item => {
                        item.isActive = false
                    })
                }
            })            
            if(this.$store.state.nextCatagoryId == subCatagory.catId)return
            this.catagoryHide()
            await this.$store.dispatch('getProductList', {
                reset: true,
                sort: 3,
                catId:subCatagory.catId
            })
        }
    }
}
</script>
<style>
.aside-container {
    z-index: 9999;
}
</style>

<style lang="less" scoped>
@import "~gome-ui-kit/components/less/var.less";
@import "~gome-ui-kit/components/less/utils.less";
@import "~gome-ui-kit/components/less/layout.less";

@tab-nav-height: .88rem;
.border () {
    border-bottom: 1px solid @gray-border;
}
.blocker {
    height: @tab-nav-height;
}
.tab-nav {
    background: none;
    z-index: @z-min + 100;
    &.catagoring {
        position: fixed;
        top: @tab-nav-height;
        height: 100%;
        width: 100%;
    }
    .radio-container {
        background: @white;
        .flexbox();
        .border();
        .item {
            .flexitem(1);
            .set-line-height(1;@tab-nav-height;);
            text-align: center;
            font-size: @font-nm;
            &.active {
                color: @red;
                border-bottom: 2px solid @red;
            }            
            i{
                position:relative;
                span{
                    width:.15rem;
                    height:.08rem;
                    border-left:.1rem solid transparent;
                    border-right:.1rem solid transparent;                    
                    position:absolute;
                    top:.15rem;
                    left:.15rem;
                    text-indent:-8888rem;
                    &.gray-arrow{
                      border-top:.1rem solid @gray-light;  
                    }
                    &.up_arrow{
                        border-bottom:.1rem solid @red; 
                    }
                    &.down_arrow{                    
                        border-top:.1rem solid @red;
                    }
                }
                
            }
        }
    }
    .catagory-container {
        .flexitem(1);
        .flexbox();
        .flexbox.vertical();
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        .catagory-content {
            .flexbox();
            // min-height: 3rem;
            height: 7.04rem;
            width: 100%;
            background-color: @gray-bg;
            .catagory {
                .radio {
                    display: block;
                    padding-left: .2rem;
                    font-size: @font-nm;
                    .set-line-height(1; .76rem;);
                    &.active {
                        background-color: @gray-bg;
                        border-left: 2px solid @red;
                        color: @red;
                    }
                    &.diffRadio{border:none;}
                }
            }
            .main-catagory {
                .flexitem(2);
                .radio {
                    background-color: @white;
                }
            }
            .sub-catagory {
                .flexitem(3);
                background-color: @gray-bg;
            }
        }
        .catagory-blocker {
            .flexitem(1);
        }
    }
}

</style>


