/*
 * @Author: zhudanmei 
 * @Date: 2017-02-23 19:54:23 
 * @Last Modified by: zhudanmei
 * @Last Modified time: 2017-08-20 20:31:44
 */
<script>
//vue
    import Vue from 'vue';
//ui-lib
    import {Button,Toast,Page, Modal} from 'gome-ui-kit';
//utils-lib
    import http from 'gome-utils-http';
    import eventbus from 'gome-utils-eventbus';
    import query from 'gome-utils-query';
    import islogin from './islogin.js';
    
    export default {
        
        methods: {
            submitOrder () {
                /*判断有没有收货地址*/
                if(this.$store.state.data.successMessage){
                    new Modal({
                        data:{
                            title: '提示',
                            content: '请填写收货人信息',
                            hasClose: false,
                            ok:'确定',
                            // classname: 'emptyAddressMsgbox'
                        },
                    
                    })
                }else{
                    //提交订单
                http({
                    //url: '//' + location.host + '/order_ajax.html',
                    url: '//' + location.host + '/cart.html',
                    type: 'post',
                    data: {
                        act: 'submitOrder',
                        pay_pwd_val: this.$store.state.payPassword, //支付密码
                        referee_no: this.$store.state.recommendMsg || '',  //推荐号
                        source:query.parse(window.location.search).source || '1',
                        
                    }
                    
                })
                .then(islogin)
                .then(data => {
                    
                    if(data.isSuccess=='Y'){
                       
                        /*TODO 设置cookie*/
                        var  omniture_order = document.getElementById("order_name_val").value;
                        if(omniture_order){
                            omniture_order = omniture_order.substring(0,omniture_order.length-1);
                        
                            document.cookie="mmStr="+escape(omniture_order)+";domain="+location.host.replace('cart.','')+";max-age=3600"; 
                            
                        } 
                        window.location.href = "//"+ location.host.replace('cart.','') +"/cashier.html?order_id=" + data.orderId+'&order_source=1&tm='+data.order_pay_val;
                        //window.location.href = "http://m.uatplus.com/cashier.html?order_id=" + data.orderId+'&order_source=1&tm='+data.order_pay_val;
                    }else if(data.isSuccess=='N'){
                        if(data.outOfType == "0"){ //主商品缺货
                            //缺货商品集合
                            this.$store.commit('updateMsgboxdata', data);
                            this.$store.state.$msgbox.isModalShow = true;
                        }else if(data.outOfType == "1"){ //赠品缺货
                                this.$store.commit('updategiveawaydata', data);
                                this.$store.state.$giveaway.isModalShow = true;
                        }else if(data.failReason == '密码错误请重新输入!' || data.failReason == '支付密码错误' || data.failCode == 'E001'){
                            new Toast(data.failReason);
                            //this.$store.state.$payPassword.isModalShow = true;
                        }else if(data.failCode == '0010010070'){
                            new Modal({
                                data:{
                                    title: '',
                                    content: '您已提交过一次，请勿重复提交，您可以在查看订单中继续支付',
                                    hasClose: false,
                                    ok:'查看订单',
                                    cancel:'返回购物车',
                                    classname: ''
                                },
                                created () {
                                    this.$on('cancel', () => {
                                        this.close();
                                        window.location.href = "//"+ location.host +"/shopping_cart.html";
                                       
                                    })
                                    this.$on('ok', () => {
                                        this.close();
                                        window.location.href = "//"+ location.host.replace('cart.','u.') +"/my_order.html";
                                    })
                                    
                                }
                            })
                        }else{
                            new Toast(data.failReason);
                        }
                        
                    }
                })
                }
                
            },
        },
    }
</script>