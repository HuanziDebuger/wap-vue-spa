
var isLogin = function(data){
    return new Promise(function(res, rej){
        
        if(data.isSuccess =='N' && (data.failReason == 'not_login' || data.login_state=='0') ){
            console.log('对不起，您还没有登录或登录已超时，请登录。')
            console.log(location.host);
            console.log(location.host.replace('cart',''));
            new Toast('对不起，您还没有登录或登录已超时，请登录。').$on('destroy', () => {
               
                window.location.href = '//'+ location.host.replace('cart.','') +"/login_out.html";
            });
            
        }else{
            res(data)
        }
    })
}
export default isLogin;

