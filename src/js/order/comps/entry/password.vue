<template>
    <div>
        <ul class="list password-list" v-if="$store.state.data.canUseKeyt=='Y'">
            <li>
                <input value="1" id="m-type" class="hide">
                <h2>美口令:</h2>
                <div class="flex1 password-cont">
                    <input  placeholder="使用美口令，请输入" id="data-word" :disabled="isInputDisabled" maxlength="30" :value="msg" lazy @input=" propertychange" v-model="msg" :class="{disabled:errorShow}">

                </div>
                <div class="state-box">
                    <!-- v-if="$store.keytStatus==1" -->
                    <div>
                        <btn :class-name="className" class="useBtn" @click.native="checkPassword" v-show="isShow">使用</btn>
                        <span class="clear-icon" v-show = 'errorShow'></span>
                        <span class="success-icon" v-show = 'successShow'></span>
                    </div>
                    <!-- <span v-if="$store.keytStatus==2" class="clear-icon" v-show = 'errorShow'></span> -->
                </div>
            </li>
        </ul>
    
    </div>
    
</template>
<script>
    import Vue from 'vue';
    import {Button,Toast} from 'gome-ui-kit';
    import query from 'gome-utils-query';
    import eventbus from 'gome-utils-eventbus';
    import http from 'gome-utils-http';
    import islogin from '../../utils/islogin.js';
    export default Vue.extend({
        components: {
            'btn': Button
        },
        data () {
            return {
                msg: '',
                isShow:false,
                errorShow:false,
                successShow:false,
                className: "default red ",
                isInputDisabled: false
            }
        },
        methods:{
            propertychange: function(e){
                
                if(this.msg){
                    this.isShow = true;
                    this.errorShow = false;
                }else{
                    this.isShow = false;
                    this.errorShow = false;
                    
                    
                }

            },
            checkPassword:function(){
                
                http({
                    url: '//' + location.host + '/order_ajax.html',
                    type: 'post',
                    data: {
                        act: 'useKeyt',
                        json: JSON.stringify({
                            //businessType: 1, /*购物车类型*/
                            businessType:query.parse(window.location.search).source || '1',
                            keyt: this.msg,
                        })
                        
                    }
                })
                .then(islogin)
                .then((data) => {
                    if(data){
                        if(data.isSuccess != 'Y'){
                            this.isShow = false;
                            this.errorShow = true;
                            if (data.isSessionExpired == 'Y'){
                                new Toast('对不起，您还没有登录或登录已超时，请登录。').$on('destroy', () => {
                                    /*window.location.href = wap_https_url+"/login.html";*/
                                })
                            }else{
                                new Toast(data.failReason);
                                return false;
                            }
                        }else{
                            new Toast('使用成功');
                            this.isInputDisabled = true;
                            this.isShow = false;
                            this.successShow = true;
                            eventbus.emit('updateEntryData');
                        }
                    }else if(data.isSuccess == 'N'){
                        if (data.failReason == 'not_login'){
                            new Toast('对不起，您还没有登录或登录已超时，请登录。').$on('destroy', () => {
                                /*window.location.href = wap_https_url+"/login.html";*/
                            })
                        }else{
                            new Toast(data.failReason);
                        }

                    }else{
                        new Toast('系统繁忙，请稍后重试~')
                    }

                })
                .catch(() => {
                    new Toast('请求失败')
                })

            }
        },
        computed: {

        },

    });
</script>
<style lang='less'>
    @import '../../less/order.less';
    .hide{
        display: none;
    }
    .password-list {
        input {
            &[disabled="disabled"] {
                background-color: @white;
            }
        }
    }
    .password-list li {
        .flexbox();
        .flexbox.v_center;
        line-height: @font-nm * 2;
        padding: @list-padding 0;
        font-size: @font-dark;
        .password-cont {
            font-size: @font-dark;
            color: @gray-light;
            padding-right: @font-sm * 1.5;
            margin-left: @font-sm;
            input{
                width: 100%;
                &.disabled {
                    color: @gray-light;
                }
            }
        }
    }
    .password-list p.disabled {
        color: @gray-light;
        font-size: @font-dark;

    }
    .password-list .state-box{
        .flexbox();
        .flexbox.v_center;
        .useBtn{
            margin-right: @font-sm * 1.5;
            line-height: @font-nm * 2;
        }
        .clear-icon {
            float: right;
            position: relative;
            .set-width-height(1;.3rem;);
            .background-image-nm(url(../../images/meikouling_wrong.png));
            margin-right: @font-lg;
            .text-right();
            overflow: hidden;
            margin-top: @font-nm-sm/2;
        }
        .success-icon{
            float: right;
            position: relative;
            .set-width-height(1;.28rem;);
            .background-image-nm(url(../../images/meikouling_right.png));
            margin-right: @font-lg;
            .text-right();
            overflow: hidden;
            margin-top: @font-nm-sm/2;
        }
    }

</style>