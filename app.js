const Koa = require('koa');
const request = require('request');
// require('bluebird').promisifyAll(request);
const cheerio = require('cheerio');
const superagent = require('superagent')
const HouseModel = require('./app/HouseModel')
const HouseThumbModel = require('./app/HouseThumbModel')
const House = new HouseModel();
const HouseThumb = new HouseThumbModel();
const baseURL = 'http://www.373f.com';
const URL_houseList = '/xinfang/lpzx/lpzx-----------------1.html'
const app = new Koa();
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/test')

// getSpiderURLs(baseURL+URL_houseList)

//1.获取数据库中各个小区的简单数据
//2.*分别爬取每个小区的各个页面，返回的数据经过处理后存入数据库小区详细信息中
//主要爬取基本信息、楼盘动态、户型展示等页面


var infoUrls = []
 function getSpiderURLs(url) {
    request(url, function (err, res, body) {
        var $ = cheerio.load(body)
        var nextPageURL = $('a:contains("下一页")').attr('href')
        var lastPageURL = $('a:contains("尾页")').attr('href')
        var div_list = $('div.lou-list-list dl');
        console.log(div_list.length)
        for (let i = 0; i < div_list.length; i++) {
            let item = div_list[i];
            let title = $(item).children('dt').children('a').eq(0).attr('title')
            let thumbImgUrl = baseURL+$(item).children('dt').children('a').eq(0).children('img').attr('src')
            let price = $(item).children('dd').children('div.price').children('b').text()
            let status = $(item).children('dd').children('i.i2').text()
            let updateDate = $(item).children('dd').children('div.update').text()
            let addr = $(item).children('dd').children('div.price').prev().prev().prev().text()
            let developer = $(item).children('dd').children('div.price').prev().prev().text()
            let recentDiscount = $(item).children('dd').children('em').text()
            let indexURL = $(item).children('dt').children('a').eq(0).attr('href')
            let houseInfoURL = $(item).children('dd').children('div.price').prev().children().eq(0).attr('href')
            let houseTypeURL = $(item).children('dd').children('div.price').prev().children().eq(1).attr('href')
            let housePhotosURL = $(item).children('dd').children('div.price').prev().children().eq(2).attr('href')
            let houseVideoURL = $(item).children('dd').children('div.price').prev().children().eq(3).attr('href')
            let houseMapURL = $(item).children('dd').children('div.price').prev().children().eq(4).attr('href')
            let houseDynamicsURL = $(item).children('dd').children('div.price').prev().children().eq(5).attr('href')
            var params = {
                name:title,
                houseDeveloper:developer,
                status:status,
                houseAddr:addr,
                housePrice:price,
                recentDiscount:recentDiscount,
                houseInfoUrl:houseInfoURL,
                houseTypeUrl:houseTypeURL,
                houseMapUrl:houseMapURL,
                houseDynamicsUrl:houseDynamicsURL,
                updateDate:updateDate,
                housePhotosUrl:housePhotosURL,
                houseVideosUrl:houseVideoURL,
                thumbImgUrl:thumbImgUrl
            }

            var houseThumbnail = new HouseThumbModel(params)
            houseThumbnail.save()
        }
        if (nextPageURL==lastPageURL){
            console.log('结束'+infoUrls.length)
            return;
        }
        getSpiderURLs(baseURL+nextPageURL)
    })
}

function getInfoData(url) {
    // console.log(url)
    request('http://www.373f.com/xinfang/lpzx/138/jbxx.html', function (err, res, body) {
        var $ = cheerio.load(body);
        var dateDiv = $('.lou-head div:contains("更新日期")')
        var updateDate = $($(dateDiv).children('span')[0]).text();

    })
}

getHouseDetailData().then(function (result) {
    // console.log(result)
}, function (err) {

});

function requestPromise(url) {
    return new Promise(function (resovle, resject) {
        request(url, function (err, response, body) {
            if (err) reject(err)
            resovle(body)
        })
    })
}

async function getHouseDetailData() {
    //1.查询所有楼盘信息
    var houseThumbs = await HouseThumbModel.find()
    //2.爬取楼盘基本信息、楼盘动态、户型展示等页面
    for (let i = 0; i < houseThumbs.length; i++) {
        var houseThumb = houseThumbs[i];
        //爬取基本信息
        var info_body = await requestPromise(houseThumb.houseInfoUrl)
        var $1 = cheerio.load(info_body);
        var name = $1('div.lou-head h1').attr('title')
        var status = $1('div.lou-head em').text()
        var info_tbodys = $1('div.lou-cont-cont table tbody');
        //基本信息
        var phone = $1(info_tbodys[0]).children('tr').eq(0).children('td').children('div').children('span').text()
        var developer = $1(info_tbodys[0]).children('tr').eq(1).children('td').text()
        var saleLicense = $1(info_tbodys[0]).children('tr').eq(2).children('td').text()
        var years = $1(info_tbodys[0]).children('tr').eq(3).children('td').text()
        var feature = $1(info_tbodys[0]).children('tr').eq(4).children('td').text()
        var opentime = $1(info_tbodys[0]).children('tr').eq(5).children('td').text()
        var delivertime = $1(info_tbodys[0]).children('tr').eq(6).children('td').text()
        // console.log(phone + developer +saleLicense+property+feature+opentime+delivertime)
        //价格信息
        var price = $1(info_tbodys[1]).children('tr').eq(0).children('td').children('b').text()
        var recentDiscount = $1(info_tbodys[1]).children('tr').eq(1).children('td').text()
        //位置信息
        var district = $1(info_tbodys[2]).children('tr').eq(0).children('td').text()
        var addr = $1(info_tbodys[2]).children('tr').eq(1).children('td').text()
        var salesAddr = $1(info_tbodys[2]).children('tr').eq(2).children('td').text()
        var traffic = $1(info_tbodys[2]).children('tr').eq(3).children('td').text()
        var hotspot = $1(info_tbodys[2]).children('tr').eq(4).children('td').text()
        var education = $1(info_tbodys[2]).children('tr').eq(5).children('td').text()
        var roundMating = $1(info_tbodys[2]).children('tr').eq(6).children('td').text()
        //物业信息
        var carPositions = $1(info_tbodys[3]).children('tr').eq(0).children('td').text()
        var servicedeveloper = $1(info_tbodys[3]).children('tr').eq(1).children('td').text()
        var serviceCost = $1(info_tbodys[3]).children('tr').eq(2).children('td').text()
        var servicePhone = $1(info_tbodys[3]).children('tr').eq(3).children('td').text()
        //建筑信息
        var buildtype = $1(info_tbodys[4]).children('tr').eq(0).children('td').text()
        var property = $1(info_tbodys[4]).children('tr').eq(1).children('td').text()
        var buildarea = $1(info_tbodys[4]).children('tr').eq(2).children('td').text()
        var occupyarea = $1(info_tbodys[4]).children('tr').eq(3).children('td').text()
        var volumerate = $1(info_tbodys[4]).children('tr').eq(4).children('td').text()
        var greenrate = $1(info_tbodys[4]).children('tr').eq(5).children('td').text()
        //工程进度和描述
        var progress = $1($1('.lou-info-cont')[0]).text()
        var desc = $1($1('.lou-info-cont')[1]).children('p').text()
        // console.log(progress+desc)

        //爬取楼盘动态
        getNews(houseThumb.houseDynamicsUrl)
        async function getNews(url) {
            var dynamics_body = await requestPromise(url.indexOf('http')>-1?url:(baseURL+url))
            var $2 = cheerio.load(dynamics_body);
            var news_list = $2('div.lou-news-list dl')
            for (let j = 0; j < news_list.length; j++) {
                var news = news_list[j];
                var detailUrl = $(news).children('dt').children('a').attr('href')
                var detail_body = await requestPromise(detailUrl);
                let $3 = cheerio.load(detail_body)

            }
        }
        //爬取户型展示
        var housetype_body = await requestPromise(houseThumb.houseTypeUrl)
        var $3 = cheerio.load(housetype_body);
    }
}


app.listen(3008)