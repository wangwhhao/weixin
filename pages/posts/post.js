var postsData=require("../../data/posts-data.js")

Page({
  data: {
    //小程序总是会读取data对象来做数据绑定，
    //但是在onload事件执行之后发生的
  },

  onLoad: function () {
    // 页面初始化 options为页面跳转所带来的参数
    // this.data.post_key=postsData.postList
    this.setData({ 
      post_key: postsData.postList });
  },

  onPostTap:function(event){
    var postId=event.currentTarget.dataset.postid;
    // console.log("postid is"+postId);
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  },
  //target是当前点击的组件，这里指image；currentTarget是事件捕获的组件，这里指swiper。
  onSwiperTap:function(event){
    var postId=event.target.dataset.postid;
    // console.log("postid is"+postId);
    wx.navigateTo({
      url: "post-detail/post-detail?id=" + postId
    })
  }


})