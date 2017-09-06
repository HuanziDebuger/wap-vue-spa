 const a = {
     "proId": "P259878",
     "amount": "￥1500.00",
     "condition": "已购买1件",
     "desc": "以下商品参加：满1500.0元可换购商品1件",
     "discount": "已换购商品1件",
     "type": "加价换购（备注：）",
     "addSuccess": "Y",
     "openGiftLayer": "Y",
     "showGiftGetButton": "Y",
     "giftGetButtonDesc": "领取赠品",
     "promTitle": "购已满400元，最多可领取1套赠品",
     "giftGroupInfoList": [{
             "groupNo": "111",
             "canSelect": "Y",
             "isSelected": "Y",
             "goodsList": [{
                     "skuId": "1130021833",
                     "productId": "9140024561",
                     "num": "10",
                     "skuImg": "//gfs17.gomein.net.cn/T1T6LvBvCv1RCvBVdK_120.jpg",
                     "skuName": "Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…",
                     "price": "3199.00",
                     "stateCode": "1",
                     "stateDesc": "有货"
                 },
                 {
                     "skuId": "1130021833",
                     "productId": "9140024561",
                     "num": "10",
                     "skuImg": "//gfs17.gomein.net.cn/T1.ZWTBCYv1RCvBVdK_120.jpg",
                     "skuName": "Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…",
                     "price": "3199.00",
                     "stateCode": "1",
                     "stateDesc": "有货"
                 }
             ]
         },
         {
             "groupNo": "222",
             "canSelect": "N",
             "isSelected": "Y",
             "goodsList": [{
                 "skuId": "1130021833",
                 "productId": "9140024561",
                 "num": "10",
                 "skuImg": "//gfs18.gomein.net.cn/T1.ZWTBCYv1RCvBVdK_160.jpg",
                 "skuName": "Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…",
                 "price": "3199.00",
                 "stateCode": "0",
                 "stateDesc": "无货"
             }]
         },
         {
             "groupNo": "333",
             "canSelect": "Y",
             "isSelected": "Y",
             "goodsList": [{
                 "skuId": "1130021833",
                 "productId": "9140024561",
                 "num": "10",
                 "skuImg": "//gfs15.gomein.net.cn/T1PZCvBTWg1RCvBVdK_160.jpg",
                 "skuName": "Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…",
                 "price": "3199.00",
                 "stateCode": "1",
                 "stateDesc": "有货"
             }]
         },
         {
             "groupNo": "444",
             "canSelect": "Y",
             "isSelected": "Y",
             "goodsList": [{
                 "skuId": "1130021833",
                 "productId": "9140024561",
                 "num": "10",
                 "skuImg": "//gfs15.gomein.net.cn/T1PZCvBTWg1RCvBVdK_160.jpg",
                 "skuName": "Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…",
                 "price": "3199.00",
                 "stateCode": "1",
                 "stateDesc": "有货"
             }]
         },
         {
             "groupNo": "555",
             "canSelect": "Y",
             "isSelected": "Y",
             "goodsList": [{
                 "skuId": "1130021833",
                 "productId": "9140024561",
                 "num": "10",
                 "skuImg": "//gfs15.gomein.net.cn/T1PZCvBTWg1RCvBVdK_160.jpg",
                 "skuName": "Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…",
                 "price": "3199.00",
                 "stateCode": "1",
                 "stateDesc": "有货"
             }]
         },
         {
             "groupNo": "666",
             "canSelect": "Y",
             "isSelected": "Y",
             "goodsList": [{
                 "skuId": "1130021833",
                 "productId": "9140024561",
                 "num": "10",
                 "skuImg": "//gfs15.gomein.net.cn/T1PZCvBTWg1RCvBVdK_160.jpg",
                 "skuName": "Genanx格男仕夏季新款方s收到了风科技控件离开家离开家了的的的律师费第设计是…",
                 "price": "3199.00",
                 "stateCode": "1",
                 "stateDesc": "有货"
             }]
         }
     ],
     "giftGetButtoncode": "lingqu",
     "mainItemId": "121212121",
     "emptyIdentifier": 1
 }
 Mock.mock(
     '//cart.m.uatplus.com/shop_cart/joinOrderAdd?sourse=1&isNpop=N&promId=P3529329&isKdpPromotion=N', 'get', options => {
         console.log(options)
         return a
     }
 );