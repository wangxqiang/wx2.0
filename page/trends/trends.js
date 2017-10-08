var WxParse = require('../../wxParse/wxParse.js');
var config=require('../../config.js'); //导入配置文件
var Bmob = require('../../util/bmob.js');
Page({
    data: {
        type:"",
    },
    onLoad:function (option) {
        var that = this;
        var url = option.type;
        console.log(url)
        var Diary = Bmob.Object.extend("beautiful");
        var query = new Bmob.Query(Diary);
        query.get(url, {
            success: function(result) {
                var article =result.attributes.html;
                WxParse.wxParse('article', 'html', article, that, 5);
            },
            error: function(object, error) {

            }
        });
    },
})