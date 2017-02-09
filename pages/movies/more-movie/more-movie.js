// pages/movies/more-movie/more-movie.js
var util = require("../../../utils/util.js");
var app = getApp();
Page({
  data: {
    navigateTitle: "",
    movies: {},
    requestUrl: {},
    totalCount: 0,
    isEmpty: true,
  },

  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    })
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣Top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl: dataUrl
    })

    util.http(dataUrl, this.processDoubanData);
  },

  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl + "?start=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var i = 0, movsubs = moviesDouban.subjects; i < movsubs.length; i++) {
      var subject = movsubs[i];
      var title = subject.title;
      if (title.length >= 0) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp);
    }
    //新加载的数据与原有的数据合并
    var totalMovies = {};
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    } else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }

    this.setData({
      movies: totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  onReady: function () {
    //页面初始化过程不应该操作跟UI相关的东西的，所以在onload中动态设置当前页面标题不生效。
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success: function (res) {
        // success
      }
    })
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?idsss=' + movieId,
      success: function (res) {
        // success
      }
    })
  }


})