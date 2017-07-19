webpackJsonp([1],{

/***/ 104:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(87);
__webpack_require__(88);
__webpack_require__(89);
__webpack_require__(132);
module.exports = __webpack_require__(13).Promise;

/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
                  var un = that === undefined;
                  switch (args.length) {
                                    case 0:
                                                      return un ? fn() : fn.call(that);
                                    case 1:
                                                      return un ? fn(args[0]) : fn.call(that, args[0]);
                                    case 2:
                                                      return un ? fn(args[0], args[1]) : fn.call(that, args[0], args[1]);
                                    case 3:
                                                      return un ? fn(args[0], args[1], args[2]) : fn.call(that, args[0], args[1], args[2]);
                                    case 4:
                                                      return un ? fn(args[0], args[1], args[2], args[3]) : fn.call(that, args[0], args[1], args[2], args[3]);
                  }return fn.apply(that, args);
};

/***/ }),

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var global = __webpack_require__(6),
    macrotask = __webpack_require__(84).set,
    Observer = global.MutationObserver || global.WebKitMutationObserver,
    process = global.process,
    Promise = global.Promise,
    isNode = __webpack_require__(22)(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function flush() {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();else last = undefined;
        throw e;
      }
    }last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function notify() {
      process.nextTick(flush);
    };
    // browsers with MutationObserver
  } else if (Observer) {
    var toggle = true,
        node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function notify() {
      node.data = toggle = !toggle;
    };
    // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    var promise = Promise.resolve();
    notify = function notify() {
      promise.then(flush);
    };
    // for other environments - macrotask based on:
    // - setImmediate
    // - MessageChannel
    // - window.postMessag
    // - onreadystatechange
    // - setTimeout
  } else {
    notify = function notify() {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    }last = task;
  };
};

/***/ }),

/***/ 125:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(10),
    aFunction = __webpack_require__(32),
    SPECIES = __webpack_require__(5)('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor,
      S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

/***/ }),

/***/ 132:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var LIBRARY = __webpack_require__(79),
    global = __webpack_require__(6),
    ctx = __webpack_require__(14),
    classof = __webpack_require__(21),
    $export = __webpack_require__(24),
    isObject = __webpack_require__(7),
    aFunction = __webpack_require__(32),
    anInstance = __webpack_require__(33),
    forOf = __webpack_require__(26),
    speciesConstructor = __webpack_require__(125),
    task = __webpack_require__(84).set,
    microtask = __webpack_require__(117)(),
    PROMISE = 'Promise',
    TypeError = global.TypeError,
    process = global.process,
    $Promise = global[PROMISE],
    process = global.process,
    isNode = classof(process) == 'process',
    empty = function empty() {/* empty */},
    Internal,
    GenericPromiseCapability,
    Wrapper;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1),
        FakePromise = (promise.constructor = {})[__webpack_require__(5)('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch (e) {/* empty */}
}();

// helpers
var sameConstructor = function sameConstructor(a, b) {
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function isThenable(it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function newPromiseCapability(C) {
  return sameConstructor($Promise, C) ? new PromiseCapability(C) : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function GenericPromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};
var perform = function perform(exec) {
  try {
    exec();
  } catch (e) {
    return { error: e };
  }
};
var notify = function notify(promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v,
        ok = promise._s == 1,
        i = 0;
    var run = function run(reaction) {
      var handler = ok ? reaction.ok : reaction.fail,
          resolve = reaction.resolve,
          reject = reaction.reject,
          domain = reaction.domain,
          result,
          then;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;else {
            if (domain) domain.enter();
            result = handler(value);
            if (domain) domain.exit();
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        reject(e);
      }
    };
    while (chain.length > i) {
      run(chain[i++]);
    } // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function onUnhandled(promise) {
  task.call(global, function () {
    var value = promise._v,
        abrupt,
        handler,
        console;
    if (isUnhandled(promise)) {
      abrupt = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    }promise._a = undefined;
    if (abrupt) throw abrupt.error;
  });
};
var isUnhandled = function isUnhandled(promise) {
  if (promise._h == 1) return false;
  var chain = promise._a || promise._c,
      i = 0,
      reaction;
  while (chain.length > i) {
    reaction = chain[i++];
    if (reaction.fail || !isUnhandled(reaction.promise)) return false;
  }return true;
};
var onHandleUnhandled = function onHandleUnhandled(promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function $reject(value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function $resolve(value) {
  var promise = this,
      then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor) {
    this._c = []; // <- awaiting reactions
    this._a = undefined; // <- checked in isUnhandled reactions
    this._s = 0; // <- state
    this._d = false; // <- done
    this._v = undefined; // <- value
    this._h = 0; // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false; // <- notify
  };
  Internal.prototype = __webpack_require__(37)($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function _catch(onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function PromiseCapability() {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
__webpack_require__(27)($Promise, PROMISE);
__webpack_require__(82)(PROMISE);
Wrapper = __webpack_require__(13)[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this),
        $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if (x instanceof $Promise && sameConstructor(x.constructor, this)) return x;
    var capability = newPromiseCapability(this),
        $$resolve = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(77)(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        resolve = capability.resolve,
        reject = capability.reject;
    var abrupt = perform(function () {
      var values = [],
          index = 0,
          remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++,
            alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this,
        capability = newPromiseCapability(C),
        reject = capability.reject;
    var abrupt = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (abrupt) reject(abrupt.error);
    return capability.promise;
  }
});

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(98);


/***/ }),

/***/ 84:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var ctx = __webpack_require__(14),
    invoke = __webpack_require__(112),
    html = __webpack_require__(75),
    cel = __webpack_require__(34),
    global = __webpack_require__(6),
    process = global.process,
    setTask = global.setImmediate,
    clearTask = global.clearImmediate,
    MessageChannel = global.MessageChannel,
    counter = 0,
    queue = {},
    ONREADYSTATECHANGE = 'onreadystatechange',
    defer,
    channel,
    port;
var run = function run() {
  var id = +this;
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function listener(event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [],
        i = 1;
    while (arguments.length > i) {
      args.push(arguments[i++]);
    }queue[++counter] = function () {
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (__webpack_require__(22)(process) == 'process') {
    defer = function defer(id) {
      process.nextTick(ctx(run, id, 1));
    };
    // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
    // Browsers with postMessage, skip WebWorkers
    // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function defer(id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
    // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function defer(id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
    // Rest old browsers
  } else {
    defer = function defer(id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Author: zhaoye 
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Date: 2017-01-03 19:47:26
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Last Modified by: zhaoye
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @Last Modified time: 2017-07-13 14:31:31
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


__webpack_require__(73);

__webpack_require__(104);

var _gomeUtilsBase = __webpack_require__(69);

var _gomeUtilsBase2 = _interopRequireDefault(_gomeUtilsBase);

var _gomeUtilsEventbus = __webpack_require__(9);

var _gomeUtilsEventbus2 = _interopRequireDefault(_gomeUtilsEventbus);

var _gomeUtilsEnv = __webpack_require__(19);

var _gomeUtilsCookie = __webpack_require__(70);

var _gomeUtilsCookie2 = _interopRequireDefault(_gomeUtilsCookie);

var _gomeUtilsQuery = __webpack_require__(31);

var _gomeUtilsQuery2 = _interopRequireDefault(_gomeUtilsQuery);

var _gomeUtilsHttp = __webpack_require__(72);

var _gomeUtilsHttp2 = _interopRequireDefault(_gomeUtilsHttp);

var _gomeUtilsAppVersion = __webpack_require__(90);

var _gomeUtilsAppVersion2 = _interopRequireDefault(_gomeUtilsAppVersion);

var _gomeUtilsHost = __webpack_require__(71);

var _gomeUtilsHost2 = _interopRequireDefault(_gomeUtilsHost);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function cb(cb, promisecb) {
    for (var _len = arguments.length, params = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        params[_key - 2] = arguments[_key];
    }

    if (cb) cb.apply(undefined, params);
    if (promisecb) promisecb.apply(undefined, params);
}
//老bridge的代理

var OldBridgeProxy = function () {
    function OldBridgeProxy() {
        _classCallCheck(this, OldBridgeProxy);
    }

    _createClass(OldBridgeProxy, [{
        key: '_setBridge',
        value: function _setBridge(bridge) {
            this._bridge = bridge;
        }
    }, {
        key: 'send',
        value: function send(msg, info) {
            return new Promise(function (resolve, reject) {
                //没消息名时
                if (typeof info == 'undefined' && typeof msg != 'undefined') {
                    info = msg;
                    if (typeof info == 'string') {
                        throw new Error('消息体必须是json对象而不是json字符串');
                        return;
                    }
                    if (_gomeUtilsEnv.system.ios) {
                        this._bridge.callHandler('send', JSON.stringify(info));
                    } else if (_gomeUtilsEnv.system.android) {
                        this._bridge.send(JSON.stringify(info));
                    }
                }
                //有消息名时
                if (typeof msg == 'string' && typeof info != 'undefined') {
                    if (typeof info == 'string') {
                        throw new Error('消息体必须是json对象而不是json字符串');
                        return;
                    }
                    if (_gomeUtilsEnv.system.ios) {
                        this._bridge.callHandler(msg, JSON.stringify(info));
                    } else if (_gomeUtilsEnv.system.android) {
                        this._bridge.send(msg, JSON.stringify(info));
                    }
                }
                resolve();
            }.bind(this));
        }
    }]);

    return OldBridgeProxy;
}();

var GomeJSBridge = function () {
    function GomeJSBridge() {
        _classCallCheck(this, GomeJSBridge);

        this._userInfo = null;

        this.Promise = Promise;

        this.http = _gomeUtilsHttp2.default;
        this.cookie = _gomeUtilsCookie2.default;
        this.query = _gomeUtilsQuery2.default;
        this.env = _gomeUtilsEnv.env;
        this.system = _gomeUtilsEnv.system;
        this.host = _gomeUtilsHost2.default;

        this.emit = _gomeUtilsEventbus2.default.emit;
        this.emitDOM = _gomeUtilsEventbus2.default.emitDOM;
        this.on = _gomeUtilsEventbus2.default.on;
        this.off = _gomeUtilsEventbus2.default.off;

        this.deprecated = new OldBridgeProxy();
    }

    _createClass(GomeJSBridge, [{
        key: 'mixin',
        value: function mixin(dest, src) {
            for (var key in src) {
                if (typeof dest[key] == 'undefined') {
                    dest[key] = src[key];
                }
            }
            return dest;
        }
    }, {
        key: 'back',
        value: function back(opts, ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (!_gomeUtilsEnv.env.hybrid) {
                    window.location.back();
                    cb(ok, resolve);
                } else if (_gomeUtilsEnv.env.hybrid || _gomeUtilsEnv.env.dev) {
                    navigator.gome.util.nativeUtils.nativeFinish(function () {
                        cb(ok, resolve);
                    }, function () {
                        cb(fail, resolve);
                    }, opts || {});
                }
            }));
        }
    }, {
        key: 'getAddress',
        value: function getAddress(opts, ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.hybrid) {
                    navigator.gome.util.nativeUtils.getAddressFourArea(function (data) {
                        data = typeof data === 'string' ? JSON.parse(data) : data;
                        //安卓63以前有bug，需要兼容
                        for (var key in data) {
                            data[key] = typeof data[key] == 'string' ? JSON.parse(data[key]) : data[key];
                        }
                        cb(ok, resolve, data);
                    }, function () {
                        cb(fail, reject, new Error('获取四级地址失败'));
                    });
                } else if (!_gomeUtilsEnv.env.hybrid) {
                    var _cookie = _gomeUtilsCookie2.default.parse();
                    var _query = _gomeUtilsQuery2.default.parse(window.location.search);
                    if (_query.cityjson) {
                        _query.cityjson = JSON.parse(decodeURIComponent(_query.cityjson));
                        var result = {
                            province: {
                                code: _query.cityjson.cityId,
                                name: _query.cityjson.cityName
                            },
                            city: {
                                code: _query.cityjson.cityId,
                                name: _query.cityjson.cityName
                            },
                            district: {
                                code: _query.cityjson.districtId,
                                name: _query.cityjson.districtName
                            },
                            town: {
                                code: _query.cityjson.townId,
                                name: _query.cityjson.townName
                            }
                        };
                        cb(ok, resolve, result);
                    } else if (_cookie.gps_cityid) {
                        var _result = {
                            province: {
                                code: _cookie['gps_provinceid']
                            },
                            city: {
                                code: _cookie['gps_cityid']
                            },
                            district: {
                                code: _cookie['gps_districtid']
                            },
                            town: {
                                code: _cookie['gps_townid']
                            }
                        };
                        cb(ok, resolve, _result);
                    } else {
                        //reject(new Error('获取四级地址失败'));
                        var _result2 = {
                            province: {
                                name: '北京',
                                code: '13000000'
                            },
                            city: {
                                name: '北京市',
                                code: '13020000'
                            },
                            district: {
                                name: '朝阳区(五环里)',
                                code: '11010200'
                            },
                            town: {
                                name: '全部区域',
                                code: '110102001'
                            }
                        };
                        cb(ok, resolve, _result2);
                    }
                } else {
                    cb(fail, reject, new Error('获取四级地址失败'));
                }
            }));
        }
        //has been deprecatd
        //大概72版本开始不需要再使用

    }, {
        key: 'getEnv',
        value: function getEnv(ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.hybrid) {
                    navigator.gome.util.nativeUtils.getAppEnvironment(function (data) {
                        data = typeof data == 'string' ? JSON.parse(data) : data;
                        data.environment = data.environment.toLowerCase();
                        cb(ok, resolve, data);
                    });
                } else {
                    if (_gomeUtilsEnv.env.live) {
                        cb(ok, resolve, { environment: 'pro' });
                    } else {
                        cb(ok, resolve, { environment: 'uat' });
                    }
                }
            }));
        }
    }, {
        key: 'getUserInfo',
        value: function getUserInfo(ok, fail) {
            var _this = this;

            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.hybrid) {
                    if (_gomeUtilsEnv.env.gome || _gomeUtilsEnv.env.gomeplus && !_gomeUtilsEnv.env.plusWebview) {
                        navigator.gome.util.nativeUtils.isLogin(function (data) {
                            data = typeof data == 'string' ? JSON.parse(data) : data;
                            if (data.isLogin == 'Y') {
                                navigator.gome.util.nativeUtils.getUserInfo(function (data) {
                                    data = typeof data == 'string' ? JSON.parse(data) : data;
                                    cb(ok, resolve, data, false);
                                }, function () {
                                    cb(fail, reject, new Error('获取用户信息失败'));
                                });
                            } else {
                                cb(fail, reject, new Error('获取用户信息失败'));
                            }
                        }, function () {
                            cb(fail, reject, new Error('获取用户信息失败'));
                        });
                    } else if (_gomeUtilsEnv.env.gomeplus && _gomeUtilsEnv.env.plusWebview) {
                        if (_this._userInfo) {
                            cb(ok, resolve, _this._userInfo);
                        } else {
                            cb(fail, reject, new Error('获取用户信息失败'));
                        }
                    }
                } else {
                    (0, _gomeUtilsHttp2.default)({
                        type: 'jsonp',
                        url: _gomeUtilsHost2.default.m + '/active/userAgent',
                        data: _gomeUtilsQuery2.default.parse(location.search) || {},
                        cb: 'jsoncallback',
                        isPostBody: 'Y',
                        isNeedLoading: 'N'
                    }).then(function (data) {
                        if (data.islogin == 'Y') {
                            cb(ok, resolve, {
                                profileId: data.uid,
                                userName: data.loginName
                            }, false);
                        } else {
                            cb(fail, reject, new Error('请先登录'));
                        }
                    });
                }
            }));
        }
    }, {
        key: 'getVersion',
        value: function getVersion(ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsAppVersion2.default != -1) {
                    cb(ok, resolve, _gomeUtilsAppVersion2.default);
                } else if (_gomeUtilsEnv.env.hybrid) {
                    navigator.gome.util.nativeUtils.getAppVersion(function (data) {
                        data = typeof data == 'string' ? JSON.parse(data) : data;
                        cb(ok, resolve, parseInt(data.dev_version));
                    });
                } else {
                    cb(ok, resolve, _gomeUtilsAppVersion2.default);
                }
            }));
        }
    }, {
        key: 'getUniqueId',
        value: function getUniqueId(ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.wap) {
                    try {
                        cb(ok, resolve, _gomeUtilsCookie2.default.parse()['__clickidc']);
                    } catch (e) {
                        cb(ok, resolve, '');
                        //reject(new Error('获取设备标识失败'))
                    }
                } else if (_gomeUtilsEnv.env.hybrid) {
                    if (_gomeUtilsEnv.env.dev) {
                        cb(ok, resolve, '1234567890');
                    } else {
                        try {
                            var uid = '';
                            if (_gomeUtilsEnv.system.android) {
                                uid = navigator.userAgent.match(/gome\/\d*\/([\w\-\d]*)\//)[1];
                            } else if (_gomeUtilsEnv.system.ios) uid = navigator.userAgent.match(/gome\/iphone\/\d*\/([\w\-\d]*)\//)[1];
                            cb(ok, resolve, uid);
                        } catch (e) {
                            cb(ok, resolve, '');
                            //reject(new Error('获取设备标识失败'))
                        }
                    }
                }
            }));
        }
    }, {
        key: 'http0',
        value: function http0(opt, ok, fail) {
            var _this2 = this;

            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.hybrid) {
                    opt.type = opt.type.toUpperCase();
                    navigator.gome.util.nativeRequest.sendNativeLayoutRequest(function (data) {
                        if (typeof data == 'string') data = data.replace(/\n/g, '');
                        data = typeof data === 'string' ? JSON.parse(data) : data;
                        if (data.isSuccess) {
                            if (data.isSuccess == 'N') {
                                cb(fail, reject, new Error(e.failReason || '请求失败'));
                            } else {
                                cb(ok, resolve, data);
                            }
                        } else {
                            cb(ok, resolve, data);
                        }
                    }, function (e) {
                        try {
                            e = typeof e === 'string' ? JSON.parse(e) : e;
                            cb(fail, reject, new Error(e.failReason || '请求失败'));
                        } catch (_e) {
                            cb(fail, reject, new Error('请求失败'));
                        }
                    }, _this2.mixin(opt, {
                        param: opt.data,
                        isNeedLoading: 'Y'
                    }));
                } else {
                    opt.data.keyProms = document.querySelector('input#keyProms').value;
                    opt.type = 'jsonp';
                    (0, _gomeUtilsHttp2.default)(_this2.mixin(opt, {
                        param: opt.data,
                        isNeedLoading: 'Y'
                    })).then(function (data) {
                        cb(ok, resolve, data);
                    }).catch(function () {
                        cb(fail, reject, new Error('请求失败'));
                    });
                }
            }));
        }
    }, {
        key: 'login',
        value: function login(opt, ok, fail) {
            var _this3 = this;

            return Promise.resolve(new Promise(function (resolve, reject) {
                if (!_gomeUtilsEnv.env.app && _gomeUtilsEnv.env.wap) {
                    //纯浏览器
                    window.location.href = _this3.host.m + '/login.html?return_url=' + _gomeUtilsBase2.default.encode(window.location.href);
                } else if (_gomeUtilsEnv.env.app) {
                    //app内嵌
                    if (_gomeUtilsEnv.env.hybrid) {
                        navigator.gome.app.nativeLogin.jumpToNativeLogin(function (data) {
                            data = typeof data === 'string' ? JSON.parse(data) : data;
                            if (data.jumpToNativeLogin == 'Y') {
                                cb(ok, resolve);
                            } else {
                                cb(fail, reject);
                            }
                        }, function () {
                            cb(fail, reject);
                        });
                    } else if (_gomeUtilsEnv.env.gome || _gomeUtilsEnv.env.gomeplus && !_gomeUtilsEnv.env.plusWebview) {
                        //在线app， 或新plus app，但容器为在线的webview
                        if (!window.location.href.match(/nlg\=1/)) {
                            window.location.href = window.location.origin + window.location.pathname + '?nlg=1';
                        }
                        cb(ok, resolve);
                    } else if (_gomeUtilsEnv.env.gomeplus && _gomeUtilsEnv.env.plusWebview) {
                        //新plus app，但容器为plus的webview
                        //兼容美信的jsbridge
                        window.AppInterface.call('/common/login', {
                            type: opt ? opt.type || '' : '',
                            activityId: opt ? opt.activityId || '' : '',
                            channelId: opt ? opt.channelId || '' : ''
                        }, function (data) {
                            data = typeof data === 'string' ? JSON.parse(data) : data;
                            if (data.success == true) {
                                _this3._userInfo = data.data;
                                cb(ok, resolve, data.data);
                            } else {
                                cb(fail, reject, new Error('登录失败'));
                            }
                        });
                    } //else{
                    //跳转用scheme，先写上，31版本再说，还不确定呢
                    //   window.location.href = host.m + '/login.html';
                    // }
                }
            }));
        }
    }, {
        key: 'logout',
        value: function logout(ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.wap) {
                    window.location.href = _gomeUtilsHost2.default.m + '/index.php?ctl=ucenter&act=loginOut';
                } else if (_gomeUtilsEnv.env.app) {
                    if (_gomeUtilsEnv.env.hybrid) {
                        navigator.gome.app.nativeLogin.jumpToNativeLogout(function (data) {
                            data = typeof data === 'string' ? JSON.parse(data) : data;
                            cb(ok, resolve);
                        }, function () {
                            cb(ok, reject, new Error('登出失败'));
                        });
                    } else {
                        //bridge
                        console.warn('bridge没有登出的方法');
                        cb(ok, resolve);
                    }
                }
            }));
        }
    }, {
        key: 'maima',
        value: function maima(ok, fail) {
            var _this4 = this;

            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.hybrid) {
                    _this4.getVersion().then(function (v) {
                        if (v >= 60) {
                            navigator.gome.util.nativeUtils.getMeasure(opt);
                            resolve(ok, resolve);
                        } else {
                            navigator.gome.util.nativeUtils.getMeasure(opt.pageName);
                            resolve(ok, resolve);
                        }
                    });
                } else {
                    cb(ok, resolve);
                }
            }));
        }
    }, {
        key: 'ready',
        value: function ready(ok, fail) {
            var _this5 = this;

            //测试环境下，gomebridge的状态被components接管
            if (_gomeUtilsEnv.env.dev && window.components && components.Config) {
                _gomeUtilsEnv.env.wap = components.Config.platform.wap;
                _gomeUtilsEnv.env.app = components.Config.platform.app;
                _gomeUtilsEnv.env.live = components.Config.platform.live;
                _gomeUtilsEnv.env.uat = components.Config.platform.uat;
                _gomeUtilsEnv.env.tslive = components.Config.platform.tslive;
            }
            return Promise.resolve(new Promise(function (resolve, reject) {
                //混合app
                if (_gomeUtilsEnv.env.hybrid) {
                    document.addEventListener('deviceready', function () {
                        cb(ok, resolve);
                    });
                } else if (_gomeUtilsEnv.env.app && !_gomeUtilsEnv.env.plusWebview) {
                    //webview嵌套，且不论处于哪个app容器中
                    //只要是原国美在线webview的话
                    //就走这个分支
                    if (_gomeUtilsEnv.env.dev) {
                        cb(ok, resolve);
                    }
                    if (_gomeUtilsEnv.system.android) {
                        var cnt = 0;
                        var interval = setInterval(function () {
                            if (window.bridge) {
                                _this5.deprecated._setBridge(bridge);
                                cb(ok, resolve);
                                clearInterval(interval);
                            }
                            if (cnt == 100) {
                                reject(new Error('10秒内bridge未初始化成功'));
                                clearInterval(interval);
                            }
                            cnt++;
                        }, 100);
                    } else if (_gomeUtilsEnv.system.ios) {
                        var connectWebViewJavascriptBridge = function connectWebViewJavascriptBridge(callback) {
                            if (window.WebViewJavascriptBridge) {
                                callback(WebViewJavascriptBridge);
                            } else {
                                document.addEventListener('WebViewJavascriptBridgeReady', function () {
                                    callback(WebViewJavascriptBridge);
                                }, false);
                            }
                        };

                        connectWebViewJavascriptBridge(function (bridge) {
                            _this5.deprecated._setBridge(bridge);
                            cb(ok, resolve);
                        });
                    }
                } else if (_gomeUtilsEnv.env.app && _gomeUtilsEnv.env.gomeplus && _gomeUtilsEnv.env.plusWebview) {
                    //webview嵌套，且处于美信webview中
                    /*
                    let cnt = 0;
                    const interval = setInterval(function(){
                        if(window.AppInterface){
                            cb(ok, resolve);
                            clearInterval(interval);
                        }
                        if(cnt == 100){
                            cb(fail, reject, new Error('10秒内AppInterface未初始化成功'))
                            clearInterval(interval);
                        }
                        cnt++;
                    }.bind(this),100);
                    */
                    //plus原生webview中使用domeready
                    document.addEventListener('DOMContentLoaded', function () {
                        cb(ok, resolve);
                    });
                } else if (_gomeUtilsEnv.env.wap && !_gomeUtilsEnv.env.app) {
                    //处于浏览器中
                    if (document.readyState == 'interactive' || document.readyState == 'complete') {
                        cb(ok, resolve);
                    } else {
                        document.addEventListener('DOMContentLoaded', function () {
                            cb(ok, resolve);
                        });
                    }
                }
            }));
        }
    }, {
        key: 'setTitle',
        value: function setTitle(title, ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.hybrid) {
                    if (title) {
                        navigator.gome.util.nativeUtils.showTitle(title);
                    }
                }
                cb(ok, resolve);
            }));
        }
    }, {
        key: 'setShareInfo',
        value: function setShareInfo(opt, ok, fail) {
            var _this6 = this;

            return Promise.resolve(new Promise(function (resolve, reject) {
                _this6.mixin(opt, {
                    type: 'button',
                    isShow: 'Y',
                    title: '',
                    shareDesc: '',
                    imageUrl: '',
                    link: '',
                    position: 'L',
                    method: 'goBack'
                });
                if (_gomeUtilsEnv.env.app) {
                    if (_gomeUtilsEnv.env.hybrid) {
                        if (navigator.userAgent.match(/gomeplus/)) {
                            var shareParams = {
                                'shareDesc': opt.shareDesc || '',
                                'shareUrl': opt.link || '',
                                'shareImageUrl': opt.imageUrl || '',
                                'title': opt.title || ''
                            };
                            if (_gomeUtilsEnv.env.gomeplus && _gomeUtilsEnv.env.plusWebview && _gomeUtilsAppVersion2.default >= 30) {
                                shareParams.sharePlatform = opt.sharePlatform || '0,2,3';
                            }
                            navigator.gome.util.nativeUtils.shareLink(shareParams);
                        } else {
                            if (opt.link && navigator.gome.util.nativeUtils.shareLink) {
                                _this6.getVersion().then(function (v) {
                                    if (v >= 60) {
                                        navigator.gome.util.nativeUtils.shareLink({
                                            'shareDesc': opt.shareDesc || '',
                                            'shareUrl': opt.link || '',
                                            'shareImageUrl': opt.imageUrl || '',
                                            'title': opt.title || ''
                                        });
                                    }
                                    cb(ok, resolve);
                                });
                            } else {
                                cb(fail, reject);
                            }
                        }
                    } else if (_gomeUtilsEnv.env.gome || _gomeUtilsEnv.env.gomeplus && !_gomeUtilsEnv.env.plusWebview) {
                        //此处判断env.gome为判断在gome环境中
                        //env.gomeplus && !env.plusWebview为判断融合app中非plusWebview的情况
                        var method = {
                            docObject: [{
                                type: opt.type,
                                is_show: opt.isShow,
                                title: opt.title,
                                share_desc: opt.shareDesc,
                                image_url: opt.imageUrl,
                                link: opt.link,
                                position: opt.position,
                                method: opt.method
                            }]
                            //容错
                        };if (_gomeUtilsEnv.env.gomeplus && _gomeUtilsEnv.env.plusWebview && _gomeUtilsAppVersion2.default >= 30) {
                            method.docObject[0].sharePlatform = opt.sharePlatform || '0,2,3';
                        }
                        if (_this6.system.ios && window.location.pathname.match(/shop-\d+\.html/)) {
                            _this6.deprecated._bridge.send(JSON.stringify(method));
                        } else {
                            _this6.deprecated.send(method);
                        }
                        cb(ok, resolve);
                    }
                } else {
                    cb(ok, resolve);
                }
            }));
        }
    }, {
        key: 'toast',
        value: function toast(data, ok, fail) {
            return Promise.resolve(new Promise(function (resolve, reject) {
                if (_gomeUtilsEnv.env.hybrid) {
                    navigator.gome.util.nativeUtils.showToast(data);
                } else {
                    _gomeUtilsEventbus2.default.emit('toast', data);
                    _gomeUtilsEventbus2.default.emitDOM('toast', data);
                }
                setTimeout(function () {
                    cb(ok, resolve);
                }, 1000);
            }));
        }
    }]);

    return GomeJSBridge;
}();

module.exports = new GomeJSBridge();

/***/ })

},[257]);
//# sourceMappingURL=bridge.js.map