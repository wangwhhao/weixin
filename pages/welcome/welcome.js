Page({
    onTap:function(){
        //跳转到带tab的页面需要用switchTab，如果不跳转到带tab的页面还用navigateTo或者redirectTo
        wx.switchTab({
          url: '../posts/post'
        });
    }
})