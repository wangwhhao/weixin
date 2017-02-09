var util = require("../../utils/util.js");
var app = getApp();
Page({
    data: {
        inTheaters: {},
        comingSoon: {},
        top250: {},
        searchResult:{},
        containerShow: true,
        searchPanelShow: false
    },

    onLoad: function (event) {
        var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
        var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
        var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

        this.getMovieListData(inTheatersUrl, "inTheaters", "正在热映");
        this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
        this.getMovieListData(top250Url, "top250", "豆瓣Top250");
    },

    getMovieListData: function (url, settedKey, categoryTitle) {
        var that = this;
        wx.request({
            url: url,
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                "content-type": "json"
            },
            success: function (res) {
                // success
                // console.log(res);
                that.processDoubanData(res.data, settedKey, categoryTitle);
            },
            fail: function (error) {
                console.log(error);
            }
        })
    },

    processDoubanData: function (moviesDouban, settedKey, categoryTitle) {
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

        var readyData = {};
        readyData[settedKey] = {
            movies: movies,
            categoryTitle: categoryTitle
        };
        this.setData(readyData);
    },

    onMoreTap: function (event) {
        var category = event.currentTarget.dataset.category;
        wx.navigateTo({
            url: 'more-movie/more-movie?category=' + category,
            success: function (res) {
                // success
            }

        })
    },

    onMovieTap:function(event){
        var movieId = event.currentTarget.dataset.movieid;
        wx.navigateTo({
          url: 'movie-detail/movie-detail?idsss=' + movieId,
          success: function(res){
            // success
          }
        })
    },

    onBindFocus: function (event) {
        this.setData({
            containerShow: false,
            searchPanelShow: true
        })
    },

    onCancelSearch:function(event){
        this.setData({
            containerShow: true,
            searchPanelShow: false,
            searchResult:{}
        })
    },

    onBindBlur:function(event){
        var text = event.detail.value;
        var searchUrl = app.globalData.doubanBase +"/v2/movie/search?q=" + text;
        this.getMovieListData(searchUrl,"searchResult","");
    }
})