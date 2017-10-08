
var app = getApp();
var open = false;
var config=require('../../config.js');
var name;
var text;
var Bmob = require('../../util/bmob.js');
Page({
    data:{
        userInfo:{nickName:"!!!",avatarUrl:"../../images/12.png"},
        mark: 0,
        newmark: 0,
        startmark: 0,
        endmark: 0,
        windowWidth: wx.getSystemInfoSync().windowWidth,
        wheight:wx.getSystemInfoSync().windowHeight+"px",
        staus: 1,
        translate: '',
        tabname: "开源一刻",
        _num: "",
        cts:[],
        tex:[],
        color: "color:#48b0a4",
        trans: "",
        wc1: " margin-left:-100%;",
        wc2: " margin-left:-100%;",
        wc3: " margin-left:-100%;",
        wc4: " margin-left:-100%;",
        wc5: " margin-left:-100%;",
        wc6: " margin-left:-100%;",
        conter: "1",
        //地图
        Height: 0,
        scale: 13,
        latitude: "",
        longitude: "",
        markers: [],
        controls: [{
            id: 1,
            iconPath: '/../../images/bg.png',
            position: {
                left: 320,
                top: 100 - 50,
                width: 20,
                height: 20
            },
            clickable: true
        },
            {
                id: 2,
                iconPath: '../../images/bg.png',
                position: {
                    left: 340,
                    top: 100 - 50,
                    width: 20,
                    height: 20
                },
                clickable: true
            }
        ],
        circles: [],
        //地图结束
        movies:[],
    },
    onLoad: function () {
        var that = this;
        //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
            wx.setStorageSync('userInfo',userInfo);
            that.setData({
                userInfo: userInfo
            });
            //判断缓存
            var name=wx.getStorageSync('username');
            var userid=wx.getStorageSync('userid');
            if(name||userid){
                //如果缓存里面有检查和现在的name是否相同
                if(name==userInfo.nickName){
                    console.log("没变化");
                }else if(userid){
                    console.log("换名字了");
                    var Diary = Bmob.Object.extend("Username");
                    var query = new Bmob.Query(Diary);
                    query.get(userid,{
                        success: function(result) {
                            result.set("username",userInfo.nickName);
                            result.save();
                            wx.setStorageSync('username',userInfo.nickName);
                        },
                        error: function(object, error) {
                        }
                    });
                }else{
                    console.log(userid)
                }
            }else{
                //注册
                var Diary = Bmob.Object.extend("Username");
                var diary = new Diary();
                diary.set("username",userInfo.nickName);
                diary.set("city",userInfo.city);
                diary.set("country",userInfo.country);
                diary.set("avatarUrl",userInfo.avatarUrl);
                //添加数据，第一个入口参数是null
                diary.save(null,{
                    success: function(result) {
                        console.log("日记创建成功, objectId:"+result.id);
                        wx.setStorageSync('username',userInfo.nickName);
                        wx.setStorageSync('userid',result.id);
                    },
                    error: function(result, error) {
                        console.log('创建日记失败');
                    }
                });
            }
        });
        var ts=this;
        var Diary = Bmob.Object.extend("Text");
        var query = new Bmob.Query(Diary);
// 查询所有数据
        var arrs=[];
//        var arr;
        query.find({
            success: function(results) {
                console.log("共查询到 " + results.length + " 条记录");
                for (var i = 0; i < results.length; i++) {
                    var object = results[i];
                    var obj=object.attributes;
                    obj.id=object.id;obj.data=object.updatedAt.substring(0,10);
                    arrs[i]=obj;
                    //console.log(obj)
                }
                ts.setData({
                    arr:arrs.reverse()
                })

                console.log(arrs.reverse())
            },
            error: function(error) {
                console.log("查询失败: " + error.code + " " + error.message);
            }
        });
    },
    //音乐开始
    //音乐列表页面
    //ranks:function(e){
    //    //将秒数转换为分秒的表示形式
    //    var formatSeconds = function(value) {
    //        var time = parseFloat(value);
    //        var m= Math.floor(time/60);
    //        var s= time - m*60;
    //        return  [m, s].map(formatNumber).join(':');
    //        function formatNumber(n) {
    //            n = n.toString()
    //            return n[1] ? n : '0' + n
    //        }
    //    }
    //        var self = this;
    //        var topid =e.target.dataset.num; //获取页面跳转传过来的参数
    //        this.setData({
    //            mus: "2",
    //            loading:true   //显示加载提示信息
    //        })
    //        //加载歌曲列表
    //        wx.request({
    //            url:config.config.hotUrl, //热门榜单接口
    //            data:{topid:topid},       //歌曲类别编号
    //            success:function(e){
    //                if(e.statusCode == 200){
    //                    var songlist=e.data.showapi_res_body.pagebean.songlist;
    //                             songlist.length=25;
    //                    //将时长转换为分秒的表示形式
    //                    for(var i=0;i<songlist.length;i++)
    //                    {
    //                        songlist[i].seconds = formatSeconds(songlist[i].seconds);
    //                    }
    //                    self.setData({
    //                        //获取第1首歌曲的图片作为该页顶部图片
    //                        board:e.data.showapi_res_body.pagebean.songlist[0].albumpic_big,
    //                        //保存歌曲列表
    //                        songlist:songlist,
    //                        loading:false //隐藏加载提示信息
    //                    });
    //                    //将歌曲列表保存到本地缓存中
    //                    wx.setStorageSync('songlist',songlist);
    //                }
    //            }
    //        });
    //},
    ////列表详情
    //songlist:function(e){
    ////页面载入事件处理函数
    //    var self = this;
    //    this.setData({
    //        mus: "3"})
    //    var songid =e.target.dataset.num; //获取页面跳转传过来的参数(歌曲对象)
    //    if(songid === undefined){ //未传入歌曲ID
    //        var curSong=wx.getStorageSync('curSong') || {}; //从缓存中获取歌曲
    //        if(curSong === undefined){ //缓存中无歌曲
    //            var song={songname:'未选择歌曲'}; //显示未选择歌曲
    //            this.setData({
    //                song:song
    //            })
    //        }else{
    //            this.setData({
    //                song:curSong
    //            });
    //        }
    //    }else{
    //        var songlist=wx.getStorageSync('songlist') || []; //从缓存中取出歌曲列表
    //        //在歌曲列表中查找songid指定的歌曲
    //        for(var i=0;i<songlist.length;i++){
    //            if(songlist[i].songid == songid){  //找到对应的歌曲
    //                this.setData({
    //                    song:songlist[i]   //更新歌曲
    //                });
    //                break;
    //            }
    //        }
    //        //缓存正在播放的歌曲
    //        wx.setStorageSync('curSong',this.data.song);
    //        console.log(this.data.song)
    //    }
    //},
    ////播放/暂停
    //playToggle:function(){
    //    var self = this;
    //    //没有歌曲要播放，则直接退出
    //    if(this.data.song.songname =='未选择歌曲'){
    //        return;
    //    }
    //    if(this.data.isPlaying){ //正在播放
    //        wx.stopBackgroundAudio(); //停止播放歌曲
    //
    //    }else{//未播放，则开始播放
    //        //播放歌曲
    //        wx.playBackgroundAudio({
    //            dataUrl: this.data.song.url || this.data.song.m4a,
    //            success: function(res){ }
    //        })
    //    }
    //    //更新播放状态
    //    this.setData({
    //        isPlaying:!this.data.isPlaying
    //    });
    //},
    ////保存输入的关键字
    //inputing:function(e){
    //    this.setData({
    //        value:e.detail.value  //更新搜索关键字
    //    });
    //},
    ////立即搜索按钮
    //bindSearch:function(){
    //    var self=this;
    //    this.setData({
    //        loading:!self.data.loading //更新立即搜索按钮的loading图标
    //    });
    //    //开始搜索
    //    wx.request({
    //        url:config.config.searchByNameUrl, //搜索接口
    //        data:{keyword:self.data.value},    //搜索关键字
    //        success:function(e){
    //            if(e.statusCode == 200){ //搜索成功
    //                self.setData({
    //                    list:e.data.showapi_res_body.pagebean.contentlist,  //更新搜索结果
    //                    loading:!self.data.loading
    //                });
    //                //将歌曲列表保存到本地缓存中
    //                wx.setStorageSync('songlist',e.data.showapi_res_body.pagebean.contentlist);
    //            }
    //        }
    //    });
    //},
    //musi:function(e){
    //   var n= e.target.dataset.mus;
    //    console.log(n)
    //    if (n == 1) {
    //        console.log("1")
    //        this.setData({
    //            mus: "1"
    //        })
    //    } else if (n == 2) {
    //        console.log("2")
    //        this.setData({
    //            mus: "2"
    //        })
    //    }else if (n == 3) {
    //        this.setData({
    //            mus: "3"
    //        })
    //    }else if (n == 4) {
    //        this.setData({
    //            mus: "4"
    //        })}
    //},
    ////音乐结束

    //我的收藏开始
    Tap:function(event){
        var p = event.currentTarget.id
        console.log (p+"url");
        wx.navigateTo({
            url:"../trend/trend?type="+p
        })
    },
    //美文欣赏开始
    Taps:function(event){
        var p = event.currentTarget.id
        console.log (p+"url");
        wx.navigateTo({
            url:"../trends/trends?type="+p
        })
    },
    //Tapss:function(event){
    //    var p = event.currentTarget.id
    //    console.log (p+"url");
    //    wx.navigateTo({
    //        url:"../trends/trends?type="+p
    //    })
    //},
    //调用微信登录接口
//点击菜单图标事件
    tap_ch: function (e) {
        //console.log("点击图标状态为" + open);
        //关闭状态
        if (open) {
            open = false;
            this.data.staus = 1;
            this.setData({
                translate: 'transform: translateX(0px)',
                trans: "transform: translateX(0px)",
                wc1: "-webkit-transition: All 1.2s ease-out 0s; margin-left:-80%;",
                wc3: "-webkit-transition: All 1s ease-out 0s; margin-left:-100%;",
                wc2: "-webkit-transition: All 0.8s  ease-out 0s; margin-left:-100%;",
                wc4: "-webkit-transition: All 0.6s  ease-out 0s; margin-left:-100%;",
                wc5: "-webkit-transition: All 0.4s ease-out 0s; margin-left:-100%;",
                wc6: "-webkit-transition: All 0.2s  ease-out 0s; margin-left:-100%;"
            })
        } else {
            open = true;
            this.data.staus = 2;
            this.setData({
                translate: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)',
                trans: 'transform: translateX(' + this.data.windowWidth * 0.75 + 'px)',
                wc1: "-webkit-transition: All 0.2s ease 0s; margin-left:40rpx;",
                wc3: "-webkit-transition: All 0.4s ease 0s; margin-left:40rpx;",
                wc2: "-webkit-transition: All 0.6s ease 0s; margin-left:40rpx;",
                wc4: "-webkit-transition: All 0.8s ease 0s; margin-left:40rpx;",
                wc5: "-webkit-transition: All 1s ease 0s; margin-left:40rpx;",
                wc6: "-webkit-transition: All 1.2s ease 0s; margin-left:40rpx;"
            })
        }
    },
    //设置
    sz: function () {
        console.log("sehzhi");
        wx.openSetting({
            success:function (){
                res.authSetting = {
                    "scope.userInfo": true,
                    "scope.userLocation": true
                }
            }
        })
    },
    //藏头诗
userNameInput:function(w){
    name= w.detail.value.substring(0,8);
    console.log(name)
},
    //藏头诗
uname:function(){
    var se=this;
        wx.request({
            url:"https://route.showapi.com/950-1?showapi_appid=44628&showapi_sign=0f8897306f0446f4bb207b1af5f894a6",
            data:{num:"5",type:"1",yayuntype:"1",key:name},
            success:function(e){
                if(e.statusCode == 200){
                   var li= e.data.showapi_res_body.list;
                    li.length=1;
                    se.setData({
                        cts:li,
                    })
                }
            }
        });
    },
   userText:function(w){
        text= w.detail.value;
       console.log(text);
    },
    urlTo: function (e) {

        this.setData({
            //点击页面初始化
            wc1: "-webkit-transition: All 1.2s ease-out 0.s; margin-left:-100%;",
            wc2: "-webkit-transition: All 1s  ease-out 0s; margin-left:-100%;",
            wc3: "-webkit-transition: All 0.8s ease-out 0s; margin-left:-100%;",
            wc4: "-webkit-transition: All 0.6s  ease-out 0s; margin-left:-100%;",
            wc5: "-webkit-transition: All 0.4s ease-out 0s; margin-left:-100%;",
            wc6: "-webkit-transition: All 0.2s  ease-out 0s; margin-left:-100%;",
            translate: 'transform: translateX(0px)',
            trans: 'transform: translateX(0px)',
            _num: e.target.dataset.num,
            color: ""
        });
        open = false;
        this.data.staus = 1;


        if (e.target.dataset.num == 1) {
            this.setData({
                tabname: "文章推送",
                conter: "1"
            })
        } else if (e.target.dataset.num == 2) {
            this.setData({
                tabname: "我的音乐",
                conter: "2"
            })
            wx.navigateTo({
                url:"../mius/mius"
            })
        }
        else if (e.target.dataset.num == 3){
            var _this = this;
            wx.getSystemInfo({
                success: function (res) {
                    //设置map高度，根据当前设备宽高满屏显示
                    _this.setData({
                        view: {
                            Height: res.windowHeight
                        }
                    })
                }
            })
            wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                    _this.setData({
                        latitude: res.latitude,
                        longitude: res.longitude,
                        markers: [{
                            id: "1",
                            latitude: res.latitude,
                            longitude: res.longitude,
                            width: 50,
                            height: 50,
                            iconPath: "../../images/bg.png",
                            title: ""
                        }],
                        circles: [{
                            latitude: res.latitude,
                            longitude: res.longitude,
                            color: '#FF0000DD',
                            fillColor: '#7cb5ec88',
                            radius: 3000,
                            strokeWidth: 1
                        }]
                    })
                }
            })
            this.setData({
                tabname: "我的地图",
                conter: "3"
            })
        }
        else if (e.target.dataset.num == 4) {

            var tsss=this;
            var Diary = Bmob.Object.extend("link");
            var query = new Bmob.Query(Diary);
            query.find({
                success: function(results) {
                    console.log("共查询到 " + results.length + " 条记录");
                    console.log(results);
                    var res=[];
                    var i = 0;
                    for (i ; i < results.length; i++) {
                        var object = results[i]; //movies
                        var obj=object.attributes;
                        res[i]={url:obj.imgurl};
                    }
                        tsss.setData({
                            movies:res
                        })
                },
                error: function(error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });

            this.setData({
                tabname: "美文欣赏",
                conter: "4"
            })
            var tss=this;
            var Diary = Bmob.Object.extend("beautiful");
            var query = new Bmob.Query(Diary);
            var arrss=[];
            query.find({
                success: function(results) {
                    console.log("共查询到 " + results.length + " 条记录");
                    var i = 0;
                    for (i ; i < results.length; i++) {
                        var object = results[i];
                        var obj=object.attributes;
                        obj.id=object.id;obj.data=object.updatedAt.substring(0,10);
                        arrss[i]=obj;
                    }
                    tss.setData({
                        arrs:arrss.reverse(),
                    })
                },
                error: function(error) {
                    console.log("查询失败: " + error.code + " " + error.message);
                }
            });
        }
        else if (e.target.dataset.num == 5) {
            this.setData({
                tabname: "藏头诗",
                conter: "5",
            })
        }
        else if (e.target.dataset.num == 6) {
            this.setData({
                tabname: "客服",
                conter: "6"
            })
        };

    },
})
