var config=require('../../config.js'); //导入配置文件
Page({
    data: {
        //音乐分类
        mus:"1",
        wheight: wx.getSystemInfoSync().windowHeight-36 + "px",
        ranks:[
            {type:26,text:"热歌"},
            {type:23,text:"销量"},
            {type:18,text:"民谣"},
            {type:19,text:"摇滚"},
            {type:5,text:"内地"},
            {type:6,text:"港台"},
            {type:16,text:"韩国"},
            {type:17,text:"日本"},
            {type:3,text:"欧美"}
        ],
        board:'', //顶部图片
        songlist:[], //音乐列表
        loading:false, //加载标志
        music1:"../../images/music-s.png",
        music2:"../../images/playing.png",
        music3:"../../images/search.png",
        song:{},  //传入的歌曲信息
        isPlaying:false, //播放状态
        value:'', //搜索关键字
        loading:false, //按键前的loading图标
        list:[], //搜索结果
        //音乐结束

    },
    onLoad:function (option) {

    },
    //音乐开始
    //音乐列表页面
    ranks:function(e){
        //将秒数转换为分秒的表示形式
        var formatSeconds = function(value) {
            var time = parseFloat(value);
            var m= Math.floor(time/60);
            var s= time - m*60;
            return  [m, s].map(formatNumber).join(':');
            function formatNumber(n) {
                n = n.toString()
                return n[1] ? n : '0' + n
            }
        }
        var self = this;
        var topid =e.target.dataset.num; //获取页面跳转传过来的参数
        this.setData({
            mus: "2",
            loading:true   //显示加载提示信息
        })
        //加载歌曲列表
        wx.request({
            url:config.config.hotUrl, //热门榜单接口
            data:{topid:topid},       //歌曲类别编号
            success:function(e){
                if(e.statusCode == 200){
                    var songlist=e.data.showapi_res_body.pagebean.songlist;
                    songlist.length=25;
                    //将时长转换为分秒的表示形式
                    for(var i=0;i<songlist.length;i++)
                    {
                        songlist[i].seconds = formatSeconds(songlist[i].seconds);
                    }
                    self.setData({
                        //获取第1首歌曲的图片作为该页顶部图片
                        board:e.data.showapi_res_body.pagebean.songlist[0].albumpic_big,
                        //保存歌曲列表
                        songlist:songlist,
                        loading:false //隐藏加载提示信息
                    });
                    //将歌曲列表保存到本地缓存中
                    wx.setStorageSync('songlist',songlist);
                }
            }
        });
    },
    //列表详情
    songlist:function(e){
        //页面载入事件处理函数
        var self = this;
        this.setData({
            mus: "3"})
        var songid =e.target.dataset.num; //获取页面跳转传过来的参数(歌曲对象)
        if(songid === undefined){ //未传入歌曲ID
            var curSong=wx.getStorageSync('curSong') || {}; //从缓存中获取歌曲
            if(curSong === undefined){ //缓存中无歌曲
                var song={songname:'未选择歌曲'}; //显示未选择歌曲
                this.setData({
                    song:song
                })
            }else{
                this.setData({
                    song:curSong
                });
            }
        }else{
            var songlist=wx.getStorageSync('songlist') || []; //从缓存中取出歌曲列表
            //在歌曲列表中查找songid指定的歌曲
            for(var i=0;i<songlist.length;i++){
                if(songlist[i].songid == songid){  //找到对应的歌曲
                    this.setData({
                        song:songlist[i]   //更新歌曲
                    });
                    break;
                }
            }
            //缓存正在播放的歌曲
            wx.setStorageSync('curSong',this.data.song);
            console.log(this.data.song)
        }
    },
    //播放/暂停
    playToggle:function(){
        var self = this;
        //没有歌曲要播放，则直接退出
        if(this.data.song.songname =='未选择歌曲'){
            return;
        }
        if(this.data.isPlaying){ //正在播放
            wx.stopBackgroundAudio(); //停止播放歌曲

        }else{//未播放，则开始播放
            //播放歌曲
            wx.playBackgroundAudio({
                dataUrl: this.data.song.url || this.data.song.m4a,
                success: function(res){ }
            })
        }
        //更新播放状态
        this.setData({
            isPlaying:!this.data.isPlaying
        });
    },
    //保存输入的关键字
    inputing:function(e){
        this.setData({
            value:e.detail.value  //更新搜索关键字
        });
    },
    //立即搜索按钮
    bindSearch:function(){
        var self=this;
        this.setData({
            loading:!self.data.loading //更新立即搜索按钮的loading图标
        });
        //开始搜索
        wx.request({
            url:config.config.searchByNameUrl, //搜索接口
            data:{keyword:self.data.value},    //搜索关键字
            success:function(e){
                if(e.statusCode == 200){ //搜索成功
                    self.setData({
                        list:e.data.showapi_res_body.pagebean.contentlist,  //更新搜索结果
                        loading:!self.data.loading
                    });
                    //将歌曲列表保存到本地缓存中
                    wx.setStorageSync('songlist',e.data.showapi_res_body.pagebean.contentlist);
                }
            }
        });
    },
    musi:function(e){
        var n= e.target.dataset.mus;
        console.log(n)
        if (n == 1) {
            console.log("1")
            this.setData({
                mus: "1"
            })
        } else if (n == 2) {
            console.log("2")
            this.setData({
                mus: "2"
            })
        }else if (n == 3) {
            this.setData({
                mus: "3"
            })
        }else if (n == 4) {
            this.setData({
                mus: "4"
            })}
    },
    //音乐结束
})