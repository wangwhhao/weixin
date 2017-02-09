var postsData = require("../../../data/posts-data.js")
var app =getApp(); 
Page({
    data: {

    },
    onLoad: function (option) {
        var postId = option.id;
        //存放在datadata，方便onCollectionTap函数获取postId
        this.setData({
            currentPostId: postId
        });
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        });

        //初始化收藏图片的状态
        //从缓存中读取所有的缓存状态
        var postsCollected = wx.getStorageSync('posts_collected');
        //缓存状态存在的情况下，读取所有缓存状态其中的一个
        //缓存状态不存在就添加进去false
        if (postsCollected) {
            var postCollected = postsCollected[postId];
            //把文章是否收藏的状态绑定到collected变量里
            this.setData({
                collected: postCollected
            })
        } else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
        //if条件为true说明音乐正在播放，此时改变被绑定数据的状态值为true，因为页面初始化默认其值为false。如果if条件为falsefalse，说明音乐没有播放，不用改变。
        //if条件后半部分表示，指代当前播放的音乐
        if(app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
            this.setData({
                isPlaying :true
            })
        }
        this.setMusicMonitor();

    },

    setMusicMonitor:function(event){
        //监听音乐播放和暂停
        var that = this;
        wx.onBackgroundAudioPlay(function() {
          that.setData({
              isPlaying:true
          })
          app.globalData.g_isPlayingMusic = true;
          app.globalData.g_currentMusicPostId = that.data.currentPostId;
        })

        wx.onBackgroundAudioPause(function() {
          that.setData({
              isPlaying:false
          })
          app.globalData.g_isPlayingMusic = false;
          app.globalData.g_currentMusicPostId = null;
        })

        wx.onBackgroundAudioStop(function() {
          that.setData({
              isPlaying:false
          })
          app.globalData.g_isPlayingMusic = false;
          app.globalData.g_currentMusicPostId = null;
        })
    },

    //点击收藏图片
    onCollectionTap: function (event) {
        //同步
        this.getPostsCollectedSync();
        //异步，根据业务来选择同步异步。
        // this.getPostsCollected();
    },

    getPostsCollected: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                //从缓存中读取所有的缓存状态
                var postsCollected = res.data;
                //读取所有缓存状态其中的一个,注意postId是在data中的postId变量中转得到的。
                var postCollected = postsCollected[that.data.currentPostId];
                //取反操作，收藏变未收藏；未收藏变收藏
                postCollected = !postCollected;
                //更新缓存值
                postsCollected[that.data.currentPostId] = postCollected;

                that.showToast(postsCollected, postCollected);
            }
        })
    },

    getPostsCollectedSync: function () {
        //从缓存中读取所有的缓存状态
        var postsCollected = wx.getStorageSync('posts_collected');
        //读取所有缓存状态其中的一个,注意postId是在data中的postId变量中转得到的。
        var postCollected = postsCollected[this.data.currentPostId];
        //取反操作，收藏变未收藏；未收藏变收藏
        postCollected = !postCollected;
        //更新缓存值
        postsCollected[this.data.currentPostId] = postCollected;

        this.showToast(postsCollected, postCollected);

    },

    showToast: function (postsCollected, postCollected) {
        //更新文章是否收藏的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })

        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
        })

    },

    //收藏文章不适合用showModal
    // showModal:function(postsCollected,postCollected){
    //     var that = this;
    //     console.log(that);
    //     wx.showModal({
    //         title:"收藏文章",
    //         content:postCollected?"收藏此文章？":"取消收藏此文章？",
    //         showCancel:true,
    //         cancelText:"不要",
    //         cancelColor:"#333",
    //         confirmText:"是的",
    //         confirmColor:"#f60",
    //         success:function(res){
    //             if(res.confirm){
    //                 //更新文章是否收藏的缓存值
    //     wx.setStorageSync('posts_collected', postsCollected);
    //     //更新数据绑定变量，从而实现切换图片
    //     that.setData({
    //         collected:postCollected
    //     })
    //             }
    //         }
    //     })
    // }

    onShareTap: function (event) {
        var itemList = [
            "分享给微信好友",
            "分享到朋友圈",
            "分享给QQ好友",
            "分享到新浪微博"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "#405f80",
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "右上角三个点是分享功能"
                })
            }
        })
    },

    onMusicTap: function (event) {
        var isPlaying = this.data.isPlaying;
        var postData = this.data.postData;
        if (isPlaying) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlaying: false
            })
        } else {
            wx.playBackgroundAudio({
                dataUrl: postData.music.dataUrl,
                title:postData.music.title,
                coverImgUrl:postData.music.coverImgUrl,  
            })
            this.setData({
                isPlaying: true
            })
        }
        //监听音乐播放和暂停最好放在onLoad
    }

})