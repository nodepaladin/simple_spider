const mongoose = require('mongoose')
const HouseThumbSchema = new mongoose.Schema({
    name:{type:String},//楼盘名称
    houseDeveloper:{type:String},//开发商
    status:{type:String},//楼盘状态
    houseAddr:{type:String},//楼盘地址
    housePrice:{type:String},//楼盘价格
    recentDiscount:{type:String},//近期优惠
    houseIndexURL:{type:String},
    houseInfoUrl:{type:String},
    houseTypeUrl:{type:String},
    houseMapUrl:{type:String},
    houseDynamicsUrl:{type:String},
    housePhotosUrl:{type:String},
    houseVideosUrl:{type:String},
    updateDate:{type:String},
    thumbImgUrl:{type:String}
})

const HouseModel = mongoose.model('HouseThumb',HouseThumbSchema);
module.exports = HouseModel;