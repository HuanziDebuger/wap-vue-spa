/*
 * @Author: liuhuan 
 * @Date: 2017-08-04 15:07:10 
 * @Last Modified by: 
 * @Last Modified time: 
 */
 
<template>
<div class="giftBox-cont">
     <div class="giftBox-top">
        <div class="top-title">{{$store.state.globalState.promTitle}}</div>
        <div class="close-giftbox" @click="askClosed"></div>
    </div>
     <scroller class="gift-scroller" :direction="'vertical'">  
    <div 
    v-if="$store.state.globalState.giftGroupInfoList && $store.state.globalState.giftGroupInfoList.length>0"
    class="giftBox-center">
        <div
        v-for="(item,index) in $store.state.globalState.giftGroupInfoList"
        class="product-cont">
            <radio
            :groupNo="item.groupNo"
            :source="radioSource" 
            :index="index"
            :class="item.canSelect=='Y' ? 'radio-yes' : 'radio-no'"
            @click.native="sendCheckResult(item.canSelect=='Y' ? 'checked' : '',item.groupNo)"
            @onClick="onRadioClick">
            </radio> 
            <!--一个radio多个赠品-->
            <ul class="goods-box" v-if="item.goodsList && item.goodsList.length>0">
                <li v-for="goodsItem in item.goodsList">
                     <Product :img="goodsItem.skuImg">
                        <div slot ="mask" class="mask"
                        v-if="goodsItem.stateCode =='0'" 
                        :stateCode="goodsItem.stateCode">
                        {{goodsItem.stateDesc}}
                        </div>
                        <div slot="content" class="proInfo">
                            <p class="pro-name" 
                            :class="goodsItem.stateCode =='0'?'toGray':''">
                                {{goodsItem.skuName}}
                            </p>
                            <p class="price-total">
                                <em>&yen;{{goodsItem.price}}</em>
                                <span class="total" :class="goodsItem.stateCode =='0'?'toGray':''">
                                    ×{{goodsItem.num}}
                                </span>
                            </p>
                        </div>
                    </Product>
                </li>
            </ul>
           
        </div>
    </div>
    <div v-else :style="{'text-align':'center','margin-top':'30%'}">暂无赠品信息，请稍后再试！</div>
     </scroller>
    <div class="giftBox-bottom gray-color"
    :class="{'red-color':isConfirm}" 
    @click="toConfirm">确定</div>
</div>
</template>
<script>
import {Scroller,RadioItem,RadioMixin,Product,Toast} from 'gome-ui-kit'
import host from 'gome-utils-host'
export default {
    mixins:[RadioMixin],
    components:{
        Product,
        radio:RadioItem,
        scroller:Scroller,
    },
    data(){
        return {
            radioSource:[],
            isConfirm:false,
            checkedGoods:[],
        }
    },
    created(){
        //判断radio是否可选
        if(!this.$store.state.globalState.giftGroupInfoList) return;
        this.$store.state.globalState.giftGroupInfoList.forEach(item =>{
            if(item.canSelect=='Y'){ //判断是否可选
                if(item.isSelected=='Y'){//判断radio是否已经被选中
                    this.radioSource.push({
                        isActive:true,
                        isDisable:false
                    });
                    //确定按钮置灰
                    this.isConfirm = true;
                }else{
                    this.radioSource.push({
                        isActive:false,
                        isDisable:false
                    });
                }
                
            }else{
                 this.radioSource.push({
                    isActive:false,
                    isDisable:true
                });
            }
        })
         
       
    },
    methods:{
        //关闭按钮，触发父组件方法
        askClosed(){
            //判断是不是门店领赠品
            if(window.shopNo){
                window.location.href=`//${location.host}/shopping_cart.html`;
            }else{
                this.$emit('closedAside','true');
                //关闭按钮后初始化
                // this.radioSource.forEach((obj)=>{
                //     obj.isActive = false;
                // });
                //确定按钮置灰
                // this.isConfirm = false;
            }
            
            
        },
        //radio 触发
        sendCheckResult(msg,groupNo){
            if(msg =='checked'){ //判断是否可选状态
                //激活确定按钮
                this.isConfirm = true;
                //获取点击选中的商品信息
                this.checkedGoods=[];
                this.$store.state.globalState.giftGroupInfoList.forEach((groupList)=>{
                    if(groupNo == groupList.groupNo){
                        groupList.goodsList.forEach((goods)=>{
                            this.checkedGoods.push({
                                productId:goods.productId,
                                skuId:goods.skuId,
                                number:goods.num,
                                groupNo:groupNo,
                                type:this.$store.state.globalState.type,
                                mainItemId:this.$store.state.globalState.mainItemId||null
                            })
                        })
                    }
                })
            }
           
            
        },
        //确定触发
        async toConfirm(){
            if(this.isConfirm){
                //获取接口默认选中的商品数据
                if(this.checkedGoods.length == 0){
                    this.$store.state.globalState.giftGroupInfoList.forEach((groupList)=>{
                        if(groupList.isSelected=='Y'){
                            groupList.goodsList.forEach((goods)=>{
                                this.checkedGoods.push({
                                    productId:goods.productId,
                                    skuId:goods.skuId,
                                    number:goods.num,
                                    groupNo:groupList.groupNo,
                                    type:this.$store.state.globalState.type,
                                    mainItemId:this.$store.state.globalState.mainItemId||""
                                })
                            })
                        }
                    })
                }  
                try{    
                    //提交领取赠品确定请求
                    await this.$store.dispatch('sendGiftGoods',this.checkedGoods)
                    new Toast('赠品已加入购物车');
                    //调用下初始化-关闭浮层
                    setTimeout(()=>{this.askClosed();},500);                   
                }catch(e){                  
                    new Toast('赠品领取失败，稍后再试');
                }
                
            }
        },
    }
  
}
</script>
<style lang="less">
@import "~gome-ui-kit/components/less/var.less";
@import "~gome-ui-kit/components/less/utils.less";
@import "~gome-ui-kit/components/less/layout.less";
.giftBox-cont {
    .flexbox();
    .flexbox.vertical();
    color:@font-color-dark; 
    font-size:@font-nm;
    height:100%;
    //盒子的标题部分
    .giftBox-top {
        position:relative;
        height: .9rem;
        padding:0 .2rem;
        .top-title{
            font-size:@font-nm - 0.02rem;
            color:@font-color-dark;
            line-height:.9rem;
        }
        .close-giftbox{
            width:0.22rem;
            height:0.22rem;
            .background-image-nm(url(../../images/closeBtn.png));
            position:absolute;
            top:.27rem;
            right:.2rem;
        }
    }
   //盒子中间商品部分
    .giftBox-center{
        .flexbox();
        .flexbox.vertical();
        padding:0 .24rem 0 .28rem;
        overflow:hidden;
        .product-cont{    
            .flexbox();
            margin-top:.21rem;
            .radio{
                width:.4rem;
                height:.4rem;        
                margin-right:0.2rem;
                margin-top:0.42rem;
                &.radio-yes{
                    background-color:#fff;
                    border:1px solid @gray-border;
                    border-radius:100%;
                    //.background-image-nm(url(../../images/radio_uncheck.png));
                }
                &.radio-no{
                    .background-image-nm(url(../../images/radio_no.png));
                }
                &.active{
                    .background-image-nm(url(../../images/radio_checked.png));
                    border:none;
                    border-radius:0;
                }
            }
            
            .goods-box{
                .flexbox();
                .flexbox.vertical();
                flex:1;
                li{
                    //.flexbox();
                    .product{
                        //.flexbox();
                        margin-top:.1rem;
                        padding-bottom:0.02rem;     
                        a{          
                            .flexbox();
                            .container{
                                position:relative;
                                &.img{
                                    width: 1.2rem;
                                    height: 1.2rem;
                                    margin-right: 0.15rem;
                                    border:1px solid #ddd;
                                    background-color: @white;
                                }
                                .mask{
                                    width:.88rem;
                                    height:.88rem;
                                    background-color:#000;
                                    opacity:0.8;
                                    font-size:@font-nm;
                                    color:#fff;
                                    line-height:.88rem;
                                    text-align:center;
                                    border-radius:100%;
                                    position:absolute;
                                    top:.16rem;
                                    left:.16rem;
                                }
                                &.content{
                                    .flexitem(1);
                                    .pro-name{
                                        font-size:@font-nm-sm;
                                        color: @font-color-dark;
                                        margin-bottom: .2rem;
                                        line-height: 1.3;
                                        .set-ellipsis-line(2); 
                                        &.toGray{
                                            color:#b3b3b3;
                                        }
                                    }
                                    .price-total{
                                        .flexbox();
                                        font-size: @font-nm;
                                        line-height:@font-nm;
                                        em {
                                            color: @font-color-light;                        
                                            text-decoration:line-through;
                                        }
                                        .total{
                                            .flexitem(1);
                                            color: @font-color-dark;
                                            text-align:right;
                                            &.toGray{
                                                color:#b3b3b3;
                                            }
                                            
                                        }
                                    }
                                }
                            }  
                        }
                    }
                }
            }

        }        
    }
    //盒子底部确定按钮
    .giftBox-bottom {
        height:.9rem;
        font-size:@font-lg-sm + 0.02rem;
        line-height:.9rem;
        color:@white;
        text-align:center;
        margin-top:.38rem;
        &.gray-color{
            background-color:#e4e4e4;
        }
        &.red-color{
            background-color:#ff5c5c;
        }
    }
}
.gift-scroller{flex:1}
.proInfo{
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:space-between;

}

</style>

