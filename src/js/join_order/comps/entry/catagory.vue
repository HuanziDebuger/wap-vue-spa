/*
 * @Author: zhaoye 
 * @Date: 2017-07-29 18:15:51 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-07-30 02:25:52
 */
<template>
<div  @touchmove.prevent="function(){}">
    <div class="tab-nav" :class="{catagoring: isCatagoryShow}">
        <div class="radio-container">
            <Radio @click.native="catagorySwitch(0)" :source="radioSource" :index="0" @onClick="onRadioClick" class="item">
                <i slot="post">
                    <span v-if="isCatagoryShow">u</span>
                    <span v-else>d</span>
                </i>
            </Radio>
            <Radio @click.native="priceSwitch(1)" :source="radioSource" :index="1" @onClick="onRadioClick" class="item">
                <i slot="post">
                    <span v-if="priceHighFirst">高</span>
                    <span v-else-if="priceLowFirst">低</span>
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
                        <Radio @click.native="subCataClick(item, index)" :key="idx" v-for="(item, idx) in catagory.cata" :source="catagory.cata" :index="idx" @onClick="onRadioClick">
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
        this.$store.state.filterCatList.forEach(item => {
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
    },
    methods: {
        catagorySwitch (id) {
            this.lastPriority = id
            this.isCatagoryShow = this.isCatagoryShow ? false : true
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
            this.catagoryHide()
            await this.$store.dispatch('getProductList', {
                reset: true,
                sort: 3
            })
        },
        async commentFirst (id) {
            if(this.lastPriority == id)return
            this.lastPriority = id
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
<style lang="less" scoped>
@import "~gome-ui-kit/components/less/var.less";
@import "~gome-ui-kit/components/less/utils.less";
@import "~gome-ui-kit/components/less/layout.less";
@tab-nav-height: .88rem;
.border () {
    border-bottom: .02rem solid @gray-border;
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
                border-bottom: .04rem solid @red;
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
            max-height: 6rem;
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
                        border-left: .04rem solid @red;
                        color: @red;
                    }
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


