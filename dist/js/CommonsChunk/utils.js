webpackJsonp([0],{

/***/ 100:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * @Author: zhaoye 
 * @Date: 2017-02-16 20:56:03 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-02-20 13:00:42
 */
exports.default = {
    //默认情况
    default: function _default(data) {
        return new Promise(function (resolve, reject) {
            if (data.isSuccess == 'Y') {
                resolve(data);
            } else if (data.isSuccess == 'N') {
                reject(new Error(data.failReason || data.msgContent || '网络请求错误'));
            }
        });
    }
};

/***/ }),

/***/ 19:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
/*
 * @Author: zhaoye 
 * @Date: 2017-01-03 17:17:04 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-03-06 13:39:50
 */

/**
 * @param Object 
 * 通过ua判断的环境变量
 */
var env = {

    /****按终端分*****/
    //wap，浏览器中
    wap: false,
    //app中，包含网页嵌套和混合app本地页面
    app: false,
    //混合app
    hybrid: false,
    //微信
    wechat: false,

    /****特殊容器*****/
    //国美在线容器
    gome: false,
    //美信容器
    gomeplus: false,
    plusWebview: false,
    /****按环境分*****/
    //开发模式（混合app专用）
    dev: false,
    //线上环境
    live: false,
    //uat环境
    uat: false,
    //预生产
    tslive: false,

    //什么都判断不出来    
    unknown: false

    //判断是否开发模式（仅混合app）
};if (window.navigator.userAgent.match(/dev/)) {
    env.dev = true;
    env.hybrid = true;
}

//判断环境
if (window.location.host.match(/gome\.com\.cn|gomeplus\.com/)) {
    env.live = true;
} else if (window.location.host.match(/uat.*\.com/)) {
    env.uat = true;
} else if (window.location.host.match(/tslive\.com\.cn/)) {
    env.tslive = true;
} else {
    env.unknown = true;
}

//通过域名判断站点
if (window.location.host.match(/gome\.com\.cn|atguat\.com\.cn/)) {
    env.gome = true;
} else if (window.location.host.match(/gomeplus\.com|uatplus\.com/)) {
    env.gomeplus = true;
}

//判断终端
if (window.location.href.match(/^file\:\/\//) || env.dev) {
    //用于混合app的判断
    env.app = true;
    env.hybrid = true;
}
if (window.navigator.userAgent.match(/gome/)) {
    //用于wap内嵌app的判断（判断ua）
    env.app = true;
    //容器判断站点
    //再判断ua，如果出现冲突，ua覆盖域名
    if (window.navigator.userAgent.match(/gomeplus/)) {
        env.gomeplus = true;
        env.gome = false;
        if (window.navigator.userAgent.match(/\/(plus$|plus[^_])/)) {
            env.plusWebview = true;
        }
    } else {
        env.gomeplus = false;
        env.gome = true;
    }
} else if (window.navigator.userAgent.match(/MicroMessenger/i)) {
    env.wechat = true;
    env.wap = true;
} else {
    env.wap = true;
}
if (window.location.href.match(/^http/)) {
    env.wap = true;
}

//系统判断
var system = {
    android: false,
    ios: false
};
if (window.navigator.userAgent.match(/android/i)) {
    system.android = true;
} else if (window.navigator.userAgent.match(/iPhone|iPad/i)) {
    system.ios = true;
}
if (env.unknown && window.PackConfig) {
    env[PackConfig.PLATFORM.toLowerCase()] = true;
    env[PackConfig.ENV.toLowerCase()] = true;
}

//第三方环境复写
if (window.GomeBridgePreConfig && window.GomeBridgePreConfig.env) {
    for (var key in GomeBridgePreConfig.env) {
        env[key] = GomeBridgePreConfig.env[key];
    }
}

exports.env = env;
exports.system = system;
exports.default = {
    env: env,
    system: system
};

/***/ }),

/***/ 259:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(69);
__webpack_require__(70);
__webpack_require__(19);
__webpack_require__(9);
__webpack_require__(71);
__webpack_require__(72);
__webpack_require__(100);
module.exports = __webpack_require__(31);


/***/ }),

/***/ 31:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = function () {
    function Query() {
        _classCallCheck(this, Query);
    }

    _createClass(Query, [{
        key: 'parse',
        value: function parse(query) {
            query = query.replace(/^\?/, '');
            var arr = query.split(/&/);
            var result = {};
            for (var i = 0; i < arr.length; i++) {
                var keyvalue = arr[i].split(/\=/);
                result[keyvalue[0]] = keyvalue[1];
            }
            return result;
        }
    }, {
        key: 'queryify',
        value: function queryify(json, prefix) {
            prefix = prefix || "?";
            var query = prefix;
            for (var key in json) {
                query += key + '=' + json[key] + '&';
            }
            return query.replace(/\&$/, '');
        }
    }]);

    return Query;
}();

exports.default = new Query();

/***/ }),

/***/ 69:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
 * $Id: base64.js,v 2.15 2014/04/05 12:58:57 dankogai Exp dankogai $
 *
 *  Licensed under the BSD 3-Clause License.
 *    http://opensource.org/licenses/BSD-3-Clause
 *
 *  References:
 *    http://en.wikipedia.org/wiki/Base64
 * 
 * modefied by zhaoye 
 */

var version = "2.1.9";
// if node.js, we use Buffer
var buffer;
// if (typeof module !== 'undefined' && module.exports) {
//     try {
//         buffer = require('buffer').Buffer;
//     } catch (err) {}
// }
// constants
var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var b64tab = function (bin) {
    var t = {};
    for (var i = 0, l = bin.length; i < l; i++) {
        t[bin.charAt(i)] = i;
    }return t;
}(b64chars);
var fromCharCode = String.fromCharCode;
// encoder stuff
var cb_utob = function cb_utob(c) {
    if (c.length < 2) {
        var cc = c.charCodeAt(0);
        return cc < 0x80 ? c : cc < 0x800 ? fromCharCode(0xc0 | cc >>> 6) + fromCharCode(0x80 | cc & 0x3f) : fromCharCode(0xe0 | cc >>> 12 & 0x0f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
    } else {
        var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
        return fromCharCode(0xf0 | cc >>> 18 & 0x07) + fromCharCode(0x80 | cc >>> 12 & 0x3f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
    }
};
var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
var utob = function utob(u) {
    return u.replace(re_utob, cb_utob);
};
var cb_encode = function cb_encode(ccc) {
    var padlen = [0, 2, 1][ccc.length % 3],
        ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
        chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? '=' : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? '=' : b64chars.charAt(ord & 63)];
    return chars.join('');
};
var btoa = function btoa(b) {
    return b.replace(/[\s\S]{1,3}/g, cb_encode);
};
var _encode = buffer ? function (u) {
    return (u.constructor === buffer.constructor ? u : new buffer(u)).toString('base64');
} : function (u) {
    return btoa(utob(u));
};
var encode = function encode(u, urisafe) {
    return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g, function (m0) {
        return m0 == '+' ? '-' : '_';
    }).replace(/=/g, '');
};
var encodeURI = function encodeURI(u) {
    return encode(u, true);
};
// decoder stuff
var re_btou = new RegExp([
//因为webpack uglify之后就报错了噩噩噩噩噩，只能这样了
decodeURI('%5B%C3%80-%C3%9F%5D%5B%C2%80-%C2%BF%5D'), decodeURI('%5B%C3%80-%C3%9F%5D%5B%C2%80-%C2%BF%5D') + '{2}', decodeURI('%5B%C3%80-%C3%9F%5D%5B%C2%80-%C2%BF%5D') + '{3}'].join('|'), 'g');
var cb_btou = function cb_btou(cccc) {
    switch (cccc.length) {
        case 4:
            var cp = (0x07 & cccc.charCodeAt(0)) << 18 | (0x3f & cccc.charCodeAt(1)) << 12 | (0x3f & cccc.charCodeAt(2)) << 6 | 0x3f & cccc.charCodeAt(3),
                offset = cp - 0x10000;
            return fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00);
        case 3:
            return fromCharCode((0x0f & cccc.charCodeAt(0)) << 12 | (0x3f & cccc.charCodeAt(1)) << 6 | 0x3f & cccc.charCodeAt(2));
        default:
            return fromCharCode((0x1f & cccc.charCodeAt(0)) << 6 | 0x3f & cccc.charCodeAt(1));
    }
};
var btou = function btou(b) {
    return b.replace(re_btou, cb_btou);
};
var cb_decode = function cb_decode(cccc) {
    var len = cccc.length,
        padlen = len % 4,
        n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
        chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 0xff), fromCharCode(n & 0xff)];
    chars.length -= [0, 0, 2, 1][padlen];
    return chars.join('');
};
var atob = function atob(a) {
    return a.replace(/[\s\S]{1,4}/g, cb_decode);
};
var _decode = buffer ? function (a) {
    return (a.constructor === buffer.constructor ? a : new buffer(a, 'base64')).toString();
} : function (a) {
    return btou(atob(a));
};
var decode = function decode(a) {
    return _decode(String(a).replace(/[-_]/g, function (m0) {
        return m0 == '-' ? '+' : '/';
    }).replace(/[^A-Za-z0-9\+\/]/g, ''));
};
// export Base64
module.exports = {
    VERSION: version,
    atob: atob,
    btoa: btoa,
    fromBase64: decode,
    toBase64: encode,
    utob: utob,
    encode: encode,
    encodeURI: encodeURI,
    btou: btou,
    decode: decode
};
// if ES5 is available, make Base64.extendString() available
if (typeof Object.defineProperty === 'function') {
    var noEnum = function noEnum(v) {
        return { value: v, enumerable: false, writable: true, configurable: true };
    };
    module.exports.extendString = function () {
        Object.defineProperty(String.prototype, 'fromBase64', noEnum(function () {
            return decode(this);
        }));
        Object.defineProperty(String.prototype, 'toBase64', noEnum(function (urisafe) {
            return encode(this, urisafe);
        }));
        Object.defineProperty(String.prototype, 'toBase64URI', noEnum(function () {
            return encode(this, true);
        }));
    };
}

/***/ }),

/***/ 70:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookie = function () {
    function Cookie() {
        _classCallCheck(this, Cookie);
    }

    _createClass(Cookie, [{
        key: 'parse',
        value: function parse() {
            try {
                var cookieArr = document.cookie.split(';');
                var cookieMap = {};
                cookieArr.forEach(function (item) {
                    cookieMap[item.split('=')[0].trim()] = item.split('=')[1].trim();
                });
                return cookieMap;
            } catch (e) {
                return {};
            }
        }
    }, {
        key: 'set',
        value: function set(c_name, value, time, domain) {
            var expires = time == null ? "" : ";expires=" + new Date(new Date().getTime() + Number(time)).toGMTString();
            domain = !domain ? '' : ';domain=' + domain;
            document.cookie = c_name + "=" + escape(value) + domain + expires + ';path=/';
        }
    }]);

    return Cookie;
}();

exports.default = new Cookie();

/***/ }),

/***/ 71:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.host = undefined;

var _gomeUtilsEnv = __webpack_require__(19);

var _gomeUtilsAppVersion = __webpack_require__(90);

var _gomeUtilsAppVersion2 = _interopRequireDefault(_gomeUtilsAppVersion);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @Author: zhaoye 
 * @Date: 2017-01-03 17:54:33 
 * @Last Modified by: zhaoye
 * @Last Modified time: 2017-05-31 10:17:06
 */

//站点域名

var host = {};

Object.defineProperty(host, '__root', {
    get: function get() {
        var _host = '';
        if (_gomeUtilsEnv.env.hybrid) {
            //混合app
            //国美在线
            if (_gomeUtilsEnv.env.gome) {
                if (_gomeUtilsEnv.env.live) _host = 'gome.com.cn';else if (_gomeUtilsEnv.env.uat) _host = 'atguat.com.cn';else if (_gomeUtilsEnv.env.tslive) _host = 'tslive.com.cn';else _host = 'gome.com.cn';
            } else {
                //默认美信
                if (_gomeUtilsEnv.env.live) _host = 'gomeplus.com';else if (_gomeUtilsEnv.env.uat) _host = 'uatplus.com';else if (_gomeUtilsEnv.env.tslive)
                    //瞎写的
                    _host = 'tsliveplus.com';else _host = 'gomeplus.com';
            }
        } else {
            if (location.href.match(/gome\.com\.cn|atguat/)) {
                if (_gomeUtilsEnv.env.live) _host = 'gome.com.cn';else if (_gomeUtilsEnv.env.uat) _host = 'atguat.com.cn';else if (_gomeUtilsEnv.env.tslive) _host = 'tslive.com.cn';else _host = 'gome.com.cn';
            } else {
                //默认美信
                if (_gomeUtilsEnv.env.live) _host = 'gomeplus.com';else if (_gomeUtilsEnv.env.uat) _host = 'uatplus.com';else if (_gomeUtilsEnv.env.tslive)
                    //瞎写的
                    _host = 'tsliveplus.com';else _host = 'gomeplus.com';
            }
        }
        return 'm.' + _host;
    }
});

//协议头
var protocal = '';

if (_gomeUtilsEnv.env.hybrid) {
    if (_gomeUtilsEnv.env.gome && _gomeUtilsEnv.system.ios && _gomeUtilsAppVersion2.default >= 75) {
        protocal = 'https:';
    } else if (_gomeUtilsEnv.env.gomeplus && _gomeUtilsEnv.system.ios) {
        protocal = 'https:';
    } else {
        protocal = 'http:';
    }
}

host.m = protocal + '//' + host.__root;
host.prom = protocal + '//prom.' + host.__root;
host.jr = protocal + '//jr.' + host.__root;
host.hd = protocal + '//hd.' + host.__root;
host.v = protocal + '//v.' + host.__root;
host.tuan = protocal + '//tuan.' + host.__root;
host.u = protocal + '//u.' + host.__root;
host.item = protocal + '//item.' + host.__root;
host.q = protocal + '//q.' + host.__root;
host.cart = protocal + '//cart.' + host.__root;
host.pt = protocal + '//pt.' + host.__root;
host.club = protocal + '//club.' + host.__root;
host.protocal = protocal;

host.service = {};
Object.defineProperty(host.service, '__root', {
    get: function get() {
        var _host = '';
        if (_gomeUtilsEnv.env.hybrid) {
            //混合app
            //国美在线
            if (!_gomeUtilsEnv.env.gome) {
                //默认美信
                if (_gomeUtilsEnv.env.live) _host = 'mobile.gomeplus.com';else if (_gomeUtilsEnv.env.uat) _host = 'mobile.uatplus.com';else if (_gomeUtilsEnv.env.tslive)
                    //瞎写的
                    _host = 'mobile.tsliveplus.com';else _host = 'mobile.gomeplus.com';
            } else {
                if (_gomeUtilsEnv.env.live) _host = 'mobile.gome.com.cn';else if (_gomeUtilsEnv.env.uat) _host = 'mobile.atguat.com.cn';else if (_gomeUtilsEnv.env.tslive) _host = 'mobile.tslive.com.cn';else _host = 'mobile.gome.com.cn';
            }
        } else {
            //混合app
            //国美在线
            if (location.href.match(/gome\.com\.cn|atguat/)) {
                if (_gomeUtilsEnv.env.live) _host = 'mobile.gome.com.cn';else if (_gomeUtilsEnv.env.uat) _host = 'mobile.atguat.com.cn';else if (_gomeUtilsEnv.env.tslive) _host = 'mobile.tslive.com.cn';else _host = 'mobile.gome.com.cn';
            } else {
                //默认美信
                if (_gomeUtilsEnv.env.live) _host = 'mobile.gomeplus.com';else if (_gomeUtilsEnv.env.uat) _host = 'mobile.uatplus.com';else if (_gomeUtilsEnv.env.tslive)
                    //瞎写的
                    _host = 'mobile.tsliveplus.com';else _host = 'mobile.gomeplus.com';
            }
        }
        return _host;
    }
});

host.service.cms = function () {
    var pre = void 0;
    if (!_gomeUtilsEnv.env.hybrid && !_gomeUtilsEnv.env.gome) {
        pre = 'https://prom-';
        if (!_gomeUtilsEnv.env.live) {
            pre = 'http://prom.';
        }
    } else {
        pre = protocal + '//prom-';
    }
    return pre + host.service.__root;
}();

function gomeplusRoot() {
    if (_gomeUtilsEnv.env.uat) {
        return 'pre.gomeplus.com';
    } else if (_gomeUtilsEnv.env.tslive) {
        return 'pre.gomeplus.com';
    } else {
        return 'pro.gomeplus.com';
    }
}

host.service.gomeplus = function () {

    if (_gomeUtilsEnv.env.uat) {
        return 'https://api-bs-pre.gomeplus.com';
    } else if (_gomeUtilsEnv.env.tslive) {
        return 'https://api-bs-pre.gomeplus.com';
    } else {
        return 'https://api-bs.gomeplus.com';
    }
}();

exports.host = host;
exports.default = host;

/***/ }),

/***/ 72:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
                                                                                                                                                                                                                                                                               * @Author: zhaoye 
                                                                                                                                                                                                                                                                               * @Date: 2017-02-16 21:00:49 
                                                                                                                                                                                                                                                                               * @Last Modified by: renqingyue
                                                                                                                                                                                                                                                                               * @Last Modified time: 2017-07-17 14:34:17
                                                                                                                                                                                                                                                                               */


exports.default = function (opt, ok, fail) {
    opt = mixin(opt, {
        url: '',
        //get,post,jsonp
        type: 'get',
        //params
        data: '',
        //true(default), false
        isNeedLoading: 'Y',
        //N(default)
        isPostBody: 'N',
        //启用cors
        cors: 'N'
    });
    //非混合app域名不同自动jsonp
    if (!_gomeUtilsEnv.env.hybrid && !opt.url.match(window.location.host) && opt.cors != 'N') {
        opt.type = 'jsonp';
    }
    return Promise.resolve(new Promise(function (resolve, reject) {
        //混合app app代理
        if (_gomeUtilsEnv.env.hybrid && !opt.type.match(/jsonp/i)) {
            opt.type = opt.type.toUpperCase();
            var request = mixin(opt, {
                param: opt.data,
                isNeedLoading: 'Y',
                isPostBody: 'N'
            });
            delete request['data'];
            navigator.gome.util.nativeRequest.sendNativeRequest(function (data) {
                data = typeof data === 'string' ? JSON.parse(data) : data;
                cb(ok, resolve, data);
            }, function (e) {
                try {
                    e = typeof e === 'string' ? JSON.parse(e) : e;
                    cb(fail, reject, new Error(e.failReason || '网络请求失败'));
                } catch (_e) {
                    reject(new Error('网络请求失败'));
                    cb(fail, reject, new Error('网络请求失败'));
                }
            }, request);
        } else if (opt.type.match(/jsonp/i)) {
            //jsonp
            if (opt.isNeedLoading == 'Y') {
                _gomeUtilsEventbus2.default.emit('loading.lazy');
                _gomeUtilsEventbus2.default.emitDOM('loading');
            }
            if (!opt.isPostBody || opt.isPostBody == 'N') {
                var param = encodeURI(JSON.stringify(opt.data));
                var script = document.createElement('script');
                script.setAttribute('defer', 'defer');
                script.setAttribute('async', 'async');
                script.src = opt.url + '?bust=' + new Date().getTime() + '&body=' + param + '&callback=' + (opt.cb || 'jsonp' + jsonpCntr);
            } else {
                var param = '';
                for (var key in opt.data) {
                    param += '&' + key + '=' + opt.data[key];
                }
                var script = document.createElement('script');
                script.setAttribute('defer', 'defer');
                script.setAttribute('async', 'async');
                script.src = opt.url + '?bust=' + new Date().getTime() + param + '&callback=' + (opt.cb || 'jsonp' + jsonpCntr);
            }
            var isResolved = false;
            var isRejected = false;
            var _ok = function _ok(data) {
                if (isRejected) return;
                isResolved = true;
                data = typeof data == 'string' ? data.replace(/\n/g, '') : data;
                try {
                    data = typeof data == 'string' ? JSON.parse(data) : data;
                    _gomeUtilsEventbus2.default.emit('loaded');
                    _gomeUtilsEventbus2.default.emitDOM('loaded');
                    cb(ok, resolve, data);
                } catch (e) {
                    _gomeUtilsEventbus2.default.emit('loaded');
                    _gomeUtilsEventbus2.default.emitDOM('loaded');
                    cb(fail, reject, data);
                }
            };
            window[opt.cb || 'jsonp' + jsonpCntr] = _ok;
            setTimeout(function () {
                if (isResolved || isRejected) return;
                isRejected = true;
                _gomeUtilsEventbus2.default.emit('loaded');
                _gomeUtilsEventbus2.default.emitDOM('loaded');
                cb(fail, reject, new Error('JSONP Error'));
            }, opt.timeout || 20000);
            script.onerror = function () {
                if (isResolved || isRejected) return;
                isRejected = true;
                _gomeUtilsEventbus2.default.emit('loaded');
                _gomeUtilsEventbus2.default.emitDOM('loaded');
                cb(fail, reject, new Error('JSONP Error'));
            };
            jsonpCntr++;
            document.body.appendChild(script);
        } else {
            //ajax
            var ajax = new window.XMLHttpRequest();
            if (opt.type.match(/get/i)) {
                opt.url = opt.url + _gomeUtilsQuery2.default.queryify(opt.data);
            }
            ajax.open(opt.type, opt.url, true);
            if (opt.isNeedLoading == 'Y') {
                _gomeUtilsEventbus2.default.emit('loading.lazy');
                _gomeUtilsEventbus2.default.emitDOM('loading');
            }
            ajax.setRequestHeader('Accept', '*/*');
            ajax.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
            if (opt.type.match(/get/i)) {
                ajax.send(null);
            } else if (opt.type.match(/post/i)) {
                var _param = "";
                for (var _key2 in opt.data) {
                    var obj = void 0;
                    if (_typeof(opt.data[_key2]) == 'object') obj = new Object(JSON.stringify(opt.data[_key2]));else obj = opt.data[_key2];
                    _param += encodeURIComponent(_key2) + "=" + obj + "&";
                }
                if (_param) _param = _param.replace(/\&$/, '');else _param = null;
                ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                ajax.send(_param);
            }
            ajax.onreadystatechange = function () {
                var result = void 0;
                if (ajax.readyState == 4) {
                    if (ajax.readyState == 4) {
                        ajax.onreadystatechange = function () {};
                        if (ajax.status >= 200 && ajax.status < 300 || ajax.status == 304 || ajax.status == 0 && window.location.protocol == 'file:') {
                            if (ajax.responseType == 'arraybuffer' || ajax.responseType == 'blob') result = ajax.response;else {
                                result = ajax.responseText;
                            }
                            try {
                                var data = JSON.parse(result);
                                _gomeUtilsEventbus2.default.emit('loaded');
                                _gomeUtilsEventbus2.default.emitDOM('loaded');
                                cb(ok, resolve, data);
                            } catch (e) {
                                _gomeUtilsEventbus2.default.emit('loaded');
                                _gomeUtilsEventbus2.default.emitDOM('loaded');
                                cb(ok, resolve, result);
                            }
                        } else {
                            _gomeUtilsEventbus2.default.emit('loaded');
                            _gomeUtilsEventbus2.default.emitDOM('loaded');
                            cb(fail, reject, new Error('网络请求失败'));
                        }
                    } else {
                        _gomeUtilsEventbus2.default.emit('loaded');
                        _gomeUtilsEventbus2.default.emitDOM('loaded');
                        cb(fail, reject, new Error('网络请求失败'));
                    }
                }
            };
        }
    }));
};

var _gomeUtilsEnv = __webpack_require__(19);

var _gomeUtilsEventbus = __webpack_require__(9);

var _gomeUtilsEventbus2 = _interopRequireDefault(_gomeUtilsEventbus);

var _gomeUtilsQuery = __webpack_require__(31);

var _gomeUtilsQuery2 = _interopRequireDefault(_gomeUtilsQuery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mixin(dest, src) {
    for (var key in src) {
        if (typeof dest[key] == 'undefined') {
            dest[key] = src[key];
        }
    }
    return dest;
}

function cb(cb, promisecb) {
    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
    }

    if (cb) cb.apply(undefined, params);
    if (promisecb) promisecb.apply(undefined, params);
}

var jsonpCntr = 0;

/***/ }),

/***/ 90:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _gomeUtilsEnv = __webpack_require__(19);

var version = -1; /*
                   * @Author: zhaoye 
                   * @Date: 2017-01-03 18:17:04 
                   * @Last Modified by:   zhaoye 
                   * @Last Modified time: 2017-02-22 12:58:17 
                   */

if (_gomeUtilsEnv.system.android && navigator.userAgent.match(/gome/)) version = navigator.userAgent.match(/gome[plus]{0,4}\/[iphone\/]{0,7}(\d*)/)[1];else if (_gomeUtilsEnv.system.ios && navigator.userAgent.match(/gome/)) version = navigator.userAgent.match(/gome[plus]{0,4}\/[iphone\/]{0,7}(\d*)/)[1];

exports.default = version;

/***/ })

},[259]);
//# sourceMappingURL=utils.js.map