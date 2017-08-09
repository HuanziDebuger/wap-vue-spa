/*
 * @Author: liuhuan 
 * @Date: 2017-08-04 15:07:10 
 * @Last Modified by: 
 * @Last Modified time: 
 */
<template>
    <div>
        <section v-for="(item,index) in giftGroupInfoList" class="product-cont">
            <coption 
            :source="item.optionSource" 
            :index="0" @onClick="onOptionClick"
            :class="item.canSelect ? 'radio-yes' : 'radio-no'">
            </coption>
            <!--一个radio多个赠品-->
            <ul class="goods-box">
                <li v-for="goodsItem in item.goodsList">
                     <Product                        
                        :href="121212"
                        :img="xxx">
                        <div slot ="mask">aadsdasd</div>
                        <div slot="content">
                            <p class="pro-name">{{goodsItem.proName}}</p>
                            <p class="price-total">
                                <em>&yen;{{goodsItem.price}}</em>
                                <span class="total">x{{goodsItem.totalNum}}</span>
                            </p>
                        </div>
                    </Product>
                </li>
            </ul>
           
        </section>
    </div>
</template>
<script>
import {OptionItem,OptionMixin,Product} from 'gome-ui-kit'
export default {
    mixins:[OptionMixin],
    components:{
        Product,
        coption:OptionItem,
    },
    data(){
        return {
            giftGroupInfoList:[
                {
                    groupNo:'121212',
                    canSelect:true,
                    goodsList:[
                        {
                            proName:'Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…',
                            price:'75.00',
                            totalNum:'10'

                        },
                        {
                            proName:'Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…',
                            price:'75.00',
                            totalNum:'10'

                        }

                    ],
                    optionSource: [
                        {
                            isActive: false,
                            isDisable:false
                        }
                        
                    ]
                },
                {
                    groupNo:'121212',
                    canSelect:false,
                    goodsList:[
                        {
                            proName:'Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…',
                            price:'75.00',
                            totalNum:'10'

                        }
                    ],
                    optionSource: [
                        {
                            isActive: false,
                            isDisable:true
                        }
                        
                    ]

                },
                {
                    groupNo:'121212',
                    canSelect:true,
                    goodsList:[
                        {
                            proName:'Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…',
                            price:'75.00',
                            totalNum:'10'

                        }
                    ],
                    optionSource: [
                        {
                            isActive: false,
                            isDisable:false
                        }
                    ]


                }
                       
                        
            ],
            source: [
                {
                    isActive:false,
                    isDisable:false
                },
                {
                    isActive:false,
                    isDisable:false
                },
                {
                    isActive:false,
                    isDisable:false
                }
            ]
        }
    },
    created(){
        //此处触发actions
         //this.$store.dispatch('getProductList')
        //  this.giftGroupInfoList.forEach(group => {
        //      this.optionSource.push({
        //         //isDisable: group ?
        //      })
        //  })
    },
    methods:{
        doCheck(){
            // if(this.getAttribute('class')=='radio-checked'){
            //     this.removeAttribute('radio-checked');
            // }else{
            //     this.setAttribute('class','radio-checked');
            // }
            console.log(111);
        },
        unchecked(){
            console.log(222);
            //不可选择
        }
    }
  
}
</script>
<style lang="less">
@import "~gome-ui-kit/components/less/var.less";
@import "~gome-ui-kit/components/less/utils.less";
@import "~gome-ui-kit/components/less/layout.less";
section.product-cont{    
    .flexbox();
    margin-top:.21rem;
    .option{
        width:.4rem;
        height:.4rem;        
        margin-right:0.4rem;
        margin-top:0.4rem;
        &.radio-yes{
            background-color:#fff;
            border:.02rem solid @gray-border;
            border-radius:100%;
        }
        &.radio-no{
            .background-image-nm(url(../../images/radio_no.png));
        }
        &.active{
            .background-image-nm(url(../../images/radio_checked.png));
        }
    }
    
    .goods-box{
        flex:1;
        .product{
            margin-top:.1rem;     
            a{          
                .flexbox();
                .container{
                    &.img{
                        width: 1.2rem;
                        height: 1.2rem;
                        margin-right: 0.15rem;
                        border:1px solid #4e4e4e;
                        background-color: @white;
                    }
                    &.content{
                        .flexitem(1);
                        .pro-name{
                            font-size:@font-nm-sm;
                            color: @font-color-dark;
                            margin-bottom: .2rem;
                            line-height: 1.3;
                            .set-ellipsis-line(2); 
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
                                
                            }
                        }
                    }
                }  
            }
        }
    }     
   
    
   

}
</style>

