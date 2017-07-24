webpackJsonp([2],{105:function(e,n,t){"use strict";var i,o,r,s=t(56),a=t(8),c=t(17),u=t(27),l=t(30),f=t(9),v=t(37),d=t(38),p=t(32),m=t(98),h=t(61).set,g=t(90)(),y=a.TypeError,w=a.process,_=a.Promise,w=a.process,b="process"==u(w),P=function(){},k=!!function(){try{var e=_.resolve(1),n=(e.constructor={})[t(6)("species")]=function(e){e(P,P)};return(b||"function"==typeof PromiseRejectionEvent)&&e.then(P)instanceof n}catch(e){}}(),j=function(e,n){return e===n||e===_&&n===r},N=function(e){var n;return!(!f(e)||"function"!=typeof(n=e.then))&&n},O=function(e){return j(_,e)?new S(e):new o(e)},S=o=function(e){var n,t;this.promise=new e(function(e,i){if(void 0!==n||void 0!==t)throw y("Bad Promise constructor");n=e,t=i}),this.resolve=v(n),this.reject=v(t)},E=function(e){try{e()}catch(e){return{error:e}}},I=function(e,n){if(!e._n){e._n=!0;var t=e._c;g(function(){for(var i=e._v,o=1==e._s,r=0;t.length>r;)!function(n){var t,r,s=o?n.ok:n.fail,a=n.resolve,c=n.reject,u=n.domain;try{s?(o||(2==e._h&&J(e),e._h=1),!0===s?t=i:(u&&u.enter(),t=s(i),u&&u.exit()),t===n.promise?c(y("Promise-chain cycle")):(r=N(t))?r.call(t,a,c):a(t)):c(i)}catch(e){c(e)}}(t[r++]);e._c=[],e._n=!1,n&&!e._h&&U(e)})}},U=function(e){h.call(a,function(){var n,t,i,o=e._v;if(L(e)&&(n=E(function(){b?w.emit("unhandledRejection",o,e):(t=a.onunhandledrejection)?t({promise:e,reason:o}):(i=a.console)&&i.error&&i.error("Unhandled promise rejection",o)}),e._h=b||L(e)?2:1),e._a=void 0,n)throw n.error})},L=function e(n){if(1==n._h)return!1;for(var t,i=n._a||n._c,o=0;i.length>o;)if(t=i[o++],t.fail||!e(t.promise))return!1;return!0},J=function(e){h.call(a,function(){var n;b?w.emit("rejectionHandled",e):(n=a.onrejectionhandled)&&n({promise:e,reason:e._v})})},x=function(e){var n=this;n._d||(n._d=!0,n=n._w||n,n._v=e,n._s=2,n._a||(n._a=n._c.slice()),I(n,!0))},C=function e(n){var t,i=this;if(!i._d){i._d=!0,i=i._w||i;try{if(i===n)throw y("Promise can't be resolved itself");(t=N(n))?g(function(){var o={_w:i,_d:!1};try{t.call(n,c(e,o,1),c(x,o,1))}catch(e){x.call(o,e)}}):(i._v=n,i._s=1,I(i,!1))}catch(e){x.call({_w:i,_d:!1},e)}}};k||(_=function(e){d(this,_,"Promise","_h"),v(e),i.call(this);try{e(c(C,this,1),c(x,this,1))}catch(e){x.call(this,e)}},i=function(e){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},i.prototype=t(42)(_.prototype,{then:function(e,n){var t=O(m(this,_));return t.ok="function"!=typeof e||e,t.fail="function"==typeof n&&n,t.domain=b?w.domain:void 0,this._c.push(t),this._a&&this._a.push(t),this._s&&I(this,!1),t.promise},catch:function(e){return this.then(void 0,e)}}),S=function(){var e=new i;this.promise=e,this.resolve=c(C,e,1),this.reject=c(x,e,1)}),l(l.G+l.W+l.F*!k,{Promise:_}),t(33)(_,"Promise"),t(59)("Promise"),r=t(16).Promise,l(l.S+l.F*!k,"Promise",{reject:function(e){var n=O(this);return(0,n.reject)(e),n.promise}}),l(l.S+l.F*(s||!k),"Promise",{resolve:function(e){if(e instanceof _&&j(e.constructor,this))return e;var n=O(this);return(0,n.resolve)(e),n.promise}}),l(l.S+l.F*!(k&&t(54)(function(e){_.all(e).catch(P)})),"Promise",{all:function(e){var n=this,t=O(n),i=t.resolve,o=t.reject,r=E(function(){var t=[],r=0,s=1;p(e,!1,function(e){var a=r++,c=!1;t.push(void 0),s++,n.resolve(e).then(function(e){c||(c=!0,t[a]=e,--s||i(t))},o)}),--s||i(t)});return r&&o(r.error),t.promise},race:function(e){var n=this,t=O(n),i=t.reject,o=E(function(){p(e,!1,function(e){n.resolve(e).then(t.resolve,i)})});return o&&i(o.error),t.promise}})},339:function(e,n,t){e.exports=t(46)},46:function(n,t,i){"use strict";function o(e){return e&&e.__esModule?e:{default:e}}function r(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function s(e,n){for(var t=arguments.length,i=Array(t>2?t-2:0),o=2;o<t;o++)i[o-2]=arguments[o];e&&e.apply(void 0,i),n&&n.apply(void 0,i)}var a=function(){function e(e,n){for(var t=0;t<n.length;t++){var i=n[t];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(n,t,i){return t&&e(n.prototype,t),i&&e(n,i),n}}();i(50),i(77);var c=i(47),u=o(c),l=i(3),f=o(l),v=i(12),d=i(26),p=o(d),m=i(5),h=o(m),g=i(4),y=o(g),w=i(67),_=o(w),b=i(48),P=o(b),k=function(){function e(){r(this,e)}return a(e,[{key:"_setBridge",value:function(e){this._bridge=e}},{key:"send",value:function(e,n){return new Promise(function(t,i){if(void 0===n&&void 0!==e){if("string"==typeof(n=e))throw new Error("消息体必须是json对象而不是json字符串");v.system.ios?this._bridge.callHandler("send",JSON.stringify(n)):v.system.android&&this._bridge.send(JSON.stringify(n))}if("string"==typeof e&&void 0!==n){if("string"==typeof n)throw new Error("消息体必须是json对象而不是json字符串");v.system.ios?this._bridge.callHandler(e,JSON.stringify(n)):v.system.android&&this._bridge.send(e,JSON.stringify(n))}t()}.bind(this))}}]),e}(),j=function(){function n(){r(this,n),this._userInfo=null,this.Promise=Promise,this.http=y.default,this.cookie=p.default,this.query=h.default,this.env=v.env,this.system=v.system,this.host=P.default,this.emit=f.default.emit,this.emitDOM=f.default.emitDOM,this.on=f.default.on,this.off=f.default.off,this.deprecated=new k}return a(n,[{key:"mixin",value:function(e,n){for(var t in n)void 0===e[t]&&(e[t]=n[t]);return e}},{key:"back",value:function(e,n,t){return Promise.resolve(new Promise(function(i,o){v.env.hybrid?(v.env.hybrid||v.env.dev)&&navigator.gome.util.nativeUtils.nativeFinish(function(){s(n,i)},function(){s(t,i)},e||{}):(window.location.back(),s(n,i))}))}},{key:"getAddress",value:function(e,n,t){return Promise.resolve(new Promise(function(e,i){if(v.env.hybrid)navigator.gome.util.nativeUtils.getAddressFourArea(function(t){t="string"==typeof t?JSON.parse(t):t;for(var i in t)t[i]="string"==typeof t[i]?JSON.parse(t[i]):t[i];s(n,e,t)},function(){s(t,i,new Error("获取四级地址失败"))});else if(v.env.hybrid)s(t,i,new Error("获取四级地址失败"));else{var o=p.default.parse(),r=h.default.parse(window.location.search);if(r.cityjson){r.cityjson=JSON.parse(decodeURIComponent(r.cityjson));var a={province:{code:r.cityjson.cityId,name:r.cityjson.cityName},city:{code:r.cityjson.cityId,name:r.cityjson.cityName},district:{code:r.cityjson.districtId,name:r.cityjson.districtName},town:{code:r.cityjson.townId,name:r.cityjson.townName}};s(n,e,a)}else if(o.gps_cityid){var c={province:{code:o.gps_provinceid},city:{code:o.gps_cityid},district:{code:o.gps_districtid},town:{code:o.gps_townid}};s(n,e,c)}else{var u={province:{name:"北京",code:"13000000"},city:{name:"北京市",code:"13020000"},district:{name:"朝阳区(五环里)",code:"11010200"},town:{name:"全部区域",code:"110102001"}};s(n,e,u)}}}))}},{key:"getEnv",value:function(e,n){return Promise.resolve(new Promise(function(n,t){v.env.hybrid?navigator.gome.util.nativeUtils.getAppEnvironment(function(t){t="string"==typeof t?JSON.parse(t):t,t.environment=t.environment.toLowerCase(),s(e,n,t)}):v.env.live?s(e,n,{environment:"pro"}):s(e,n,{environment:"uat"})}))}},{key:"getUserInfo",value:function(e,n){var t=this;return Promise.resolve(new Promise(function(i,o){v.env.hybrid?v.env.gome||v.env.gomeplus&&!v.env.plusWebview?navigator.gome.util.nativeUtils.isLogin(function(t){t="string"==typeof t?JSON.parse(t):t,"Y"==t.isLogin?navigator.gome.util.nativeUtils.getUserInfo(function(n){n="string"==typeof n?JSON.parse(n):n,s(e,i,n,!1)},function(){s(n,o,new Error("获取用户信息失败"))}):s(n,o,new Error("获取用户信息失败"))},function(){s(n,o,new Error("获取用户信息失败"))}):v.env.gomeplus&&v.env.plusWebview&&(t._userInfo?s(e,i,t._userInfo):s(n,o,new Error("获取用户信息失败"))):(0,y.default)({type:"jsonp",url:P.default.m+"/active/userAgent",data:h.default.parse(location.search)||{},cb:"jsoncallback",isPostBody:"Y",isNeedLoading:"N"}).then(function(t){"Y"==t.islogin?s(e,i,{profileId:t.uid,userName:t.loginName},!1):s(n,o,new Error("请先登录"))})}))}},{key:"getVersion",value:function(e,n){return Promise.resolve(new Promise(function(n,t){-1!=_.default?s(e,n,_.default):v.env.hybrid?navigator.gome.util.nativeUtils.getAppVersion(function(t){t="string"==typeof t?JSON.parse(t):t,s(e,n,parseInt(t.dev_version))}):s(e,n,_.default)}))}},{key:"getUniqueId",value:function(e,n){return Promise.resolve(new Promise(function(n,t){if(v.env.wap)try{s(e,n,p.default.parse().__clickidc)}catch(t){s(e,n,"")}else if(v.env.hybrid)if(v.env.dev)s(e,n,"1234567890");else try{var i="";v.system.android?i=navigator.userAgent.match(/gome\/\d*\/([\w\-\d]*)\//)[1]:v.system.ios&&(i=navigator.userAgent.match(/gome\/iphone\/\d*\/([\w\-\d]*)\//)[1]),s(e,n,i)}catch(t){s(e,n,"")}}))}},{key:"http0",value:function(n,t,i){var o=this;return Promise.resolve(new Promise(function(r,a){v.env.hybrid?(n.type=n.type.toUpperCase(),navigator.gome.util.nativeRequest.sendNativeLayoutRequest(function(n){"string"==typeof n&&(n=n.replace(/\n/g,"")),n="string"==typeof n?JSON.parse(n):n,n.isSuccess&&"N"==n.isSuccess?s(i,a,new Error(e.failReason||"请求失败")):s(t,r,n)},function(e){try{e="string"==typeof e?JSON.parse(e):e,s(i,a,new Error(e.failReason||"请求失败"))}catch(e){s(i,a,new Error("请求失败"))}},o.mixin(n,{param:n.data,isNeedLoading:"Y"}))):(n.data.keyProms=document.querySelector("input#keyProms").value,n.type="jsonp",(0,y.default)(o.mixin(n,{param:n.data,isNeedLoading:"Y"})).then(function(e){s(t,r,e)}).catch(function(){s(i,a,new Error("请求失败"))}))}))}},{key:"login",value:function(e,n,t){var i=this;return Promise.resolve(new Promise(function(o,r){!v.env.app&&v.env.wap?window.location.href=i.host.m+"/login.html?return_url="+u.default.encode(window.location.href):v.env.app&&(v.env.hybrid?navigator.gome.app.nativeLogin.jumpToNativeLogin(function(e){e="string"==typeof e?JSON.parse(e):e,"Y"==e.jumpToNativeLogin?s(n,o):s(t,r)},function(){s(t,r)}):v.env.gome||v.env.gomeplus&&!v.env.plusWebview?(window.location.href.match(/nlg\=1/)||(window.location.href=window.location.origin+window.location.pathname+"?nlg=1"),s(n,o)):v.env.gomeplus&&v.env.plusWebview&&window.AppInterface.call("/common/login",{type:e?e.type||"":"",activityId:e?e.activityId||"":"",channelId:e?e.channelId||"":""},function(e){e="string"==typeof e?JSON.parse(e):e,1==e.success?(i._userInfo=e.data,s(n,o,e.data)):s(t,r,new Error("登录失败"))}))}))}},{key:"logout",value:function(e,n){return Promise.resolve(new Promise(function(n,t){v.env.wap?window.location.href=P.default.m+"/index.php?ctl=ucenter&act=loginOut":v.env.app&&(v.env.hybrid?navigator.gome.app.nativeLogin.jumpToNativeLogout(function(t){t="string"==typeof t?JSON.parse(t):t,s(e,n)},function(){s(e,t,new Error("登出失败"))}):(console.warn("bridge没有登出的方法"),s(e,n)))}))}},{key:"maima",value:function(e,n){var t=this;return Promise.resolve(new Promise(function(n,i){v.env.hybrid?t.getVersion().then(function(t){t>=60?(navigator.gome.util.nativeUtils.getMeasure(opt),n(e,n)):(navigator.gome.util.nativeUtils.getMeasure(opt.pageName),n(e,n))}):s(e,n)}))}},{key:"ready",value:function(e,n){var t=this;return v.env.dev&&window.components&&components.Config&&(v.env.wap=components.Config.platform.wap,v.env.app=components.Config.platform.app,v.env.live=components.Config.platform.live,v.env.uat=components.Config.platform.uat,v.env.tslive=components.Config.platform.tslive),Promise.resolve(new Promise(function(n,i){if(v.env.hybrid)document.addEventListener("deviceready",function(){s(e,n)});else if(v.env.app&&!v.env.plusWebview){if(v.env.dev&&s(e,n),v.system.android)var o=0,r=setInterval(function(){window.bridge&&(t.deprecated._setBridge(bridge),s(e,n),clearInterval(r)),100==o&&(i(new Error("10秒内bridge未初始化成功")),clearInterval(r)),o++},100);else if(v.system.ios){!function(e){window.WebViewJavascriptBridge?e(WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){e(WebViewJavascriptBridge)},!1)}(function(i){t.deprecated._setBridge(i),s(e,n)})}}else v.env.app&&v.env.gomeplus&&v.env.plusWebview?document.addEventListener("DOMContentLoaded",function(){s(e,n)}):v.env.wap&&!v.env.app&&("interactive"==document.readyState||"complete"==document.readyState?s(e,n):document.addEventListener("DOMContentLoaded",function(){s(e,n)}))}))}},{key:"setTitle",value:function(e,n,t){return Promise.resolve(new Promise(function(t,i){v.env.hybrid&&e&&navigator.gome.util.nativeUtils.showTitle(e),s(n,t)}))}},{key:"setShareInfo",value:function(e,n,t){var i=this;return Promise.resolve(new Promise(function(o,r){if(i.mixin(e,{type:"button",isShow:"Y",title:"",shareDesc:"",imageUrl:"",link:"",position:"L",method:"goBack"}),v.env.app){if(v.env.hybrid)if(navigator.userAgent.match(/gomeplus/)){var a={shareDesc:e.shareDesc||"",shareUrl:e.link||"",shareImageUrl:e.imageUrl||"",title:e.title||""};v.env.gomeplus&&v.env.plusWebview&&_.default>=30&&(a.sharePlatform=e.sharePlatform||"0,2,3"),navigator.gome.util.nativeUtils.shareLink(a)}else e.link&&navigator.gome.util.nativeUtils.shareLink?i.getVersion().then(function(t){t>=60&&navigator.gome.util.nativeUtils.shareLink({shareDesc:e.shareDesc||"",shareUrl:e.link||"",shareImageUrl:e.imageUrl||"",title:e.title||""}),s(n,o)}):s(t,r);else if(v.env.gome||v.env.gomeplus&&!v.env.plusWebview){var c={docObject:[{type:e.type,is_show:e.isShow,title:e.title,share_desc:e.shareDesc,image_url:e.imageUrl,link:e.link,position:e.position,method:e.method}]};v.env.gomeplus&&v.env.plusWebview&&_.default>=30&&(c.docObject[0].sharePlatform=e.sharePlatform||"0,2,3"),i.system.ios&&window.location.pathname.match(/shop-\d+\.html/)?i.deprecated._bridge.send(JSON.stringify(c)):i.deprecated.send(c),s(n,o)}}else s(n,o)}))}},{key:"toast",value:function(e,n,t){return Promise.resolve(new Promise(function(t,i){v.env.hybrid?navigator.gome.util.nativeUtils.showToast(e):(f.default.emit("toast",e),f.default.emitDOM("toast",e)),setTimeout(function(){s(n,t)},1e3)}))}}]),n}();n.exports=new j},61:function(e,n,t){"use strict";var i,o,r,s=t(17),a=t(85),c=t(52),u=t(39),l=t(8),f=l.process,v=l.setImmediate,d=l.clearImmediate,p=l.MessageChannel,m=0,h={},g=function(){var e=+this;if(h.hasOwnProperty(e)){var n=h[e];delete h[e],n()}},y=function(e){g.call(e.data)};v&&d||(v=function(e){for(var n=[],t=1;arguments.length>t;)n.push(arguments[t++]);return h[++m]=function(){a("function"==typeof e?e:Function(e),n)},i(m),m},d=function(e){delete h[e]},"process"==t(28)(f)?i=function(e){f.nextTick(s(g,e,1))}:p?(o=new p,r=o.port2,o.port1.onmessage=y,i=s(r.postMessage,r,1)):l.addEventListener&&"function"==typeof postMessage&&!l.importScripts?(i=function(e){l.postMessage(e+"","*")},l.addEventListener("message",y,!1)):i="onreadystatechange"in u("script")?function(e){c.appendChild(u("script")).onreadystatechange=function(){c.removeChild(this),g.call(e)}}:function(e){setTimeout(s(g,e,1),0)}),e.exports={set:v,clear:d}},77:function(e,n,t){"use strict";t(64),t(65),t(66),t(105),e.exports=t(16).Promise},85:function(e,n,t){"use strict";e.exports=function(e,n,t){var i=void 0===t;switch(n.length){case 0:return i?e():e.call(t);case 1:return i?e(n[0]):e.call(t,n[0]);case 2:return i?e(n[0],n[1]):e.call(t,n[0],n[1]);case 3:return i?e(n[0],n[1],n[2]):e.call(t,n[0],n[1],n[2]);case 4:return i?e(n[0],n[1],n[2],n[3]):e.call(t,n[0],n[1],n[2],n[3])}return e.apply(t,n)}},90:function(e,n,t){"use strict";var i=t(8),o=t(61).set,r=i.MutationObserver||i.WebKitMutationObserver,s=i.process,a=i.Promise,c="process"==t(28)(s);e.exports=function(){var e,n,t,u=function(){var i,o;for(c&&(i=s.domain)&&i.exit();e;){o=e.fn,e=e.next;try{o()}catch(i){throw e?t():n=void 0,i}}n=void 0,i&&i.enter()};if(c)t=function(){s.nextTick(u)};else if(r){var l=!0,f=document.createTextNode("");new r(u).observe(f,{characterData:!0}),t=function(){f.data=l=!l}}else if(a&&a.resolve){var v=a.resolve();t=function(){v.then(u)}}else t=function(){o.call(i,u)};return function(i){var o={fn:i,next:void 0};n&&(n.next=o),e||(e=o,t()),n=o}}},98:function(e,n,t){"use strict";var i=t(13),o=t(37),r=t(6)("species");e.exports=function(e,n){var t,s=i(e).constructor;return void 0===s||void 0==(t=i(s)[r])?n:o(t)}}},[339]);
//# sourceMappingURL=bridge.js.map