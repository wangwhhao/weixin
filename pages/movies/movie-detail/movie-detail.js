var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    var movieId = options.idsss;
    var url = app.globalData.doubanBase +
      "/v2/movie/subject/" + movieId;
    util.http(url, this.processDoubanData)
  },

  processDoubanData: function (data) {
    if (!data) {
      return;
    }
    var director = {
      avatar: "",
      name: "",
      id: ""
    }

    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
    }
    director.name = data.directors[0].name;
    director.id = data.directors[0].id;

    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      summary: data.summary,
      casts: util.convertTocastString(data.casts),
      castsInfo: util.convertTocastInfo(data.casts)
    }
    this.setData({
      movie: movie
    })
  },

  onPreviewImage: function (event) {
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: 'src', // 当前显示图片的http链接
      urls: [src] // 需要预览的图片http链接列表
    })
  }

})