const mongoose = require('mongoose')
const HouseNewsSchema = new mongoose.Schema({
    title:{type:String},//资讯标题
    intro:{type:String},//资讯简介
    content:{type:String},//资讯内容
    updateTime:{type:String},//资讯更新时间
    imgs:[{imgUrl:String}]
})

const HouseNewsModel = mongoose.model('HouseThumb',HouseNewsSchema);
module.exports = HouseNewsModel;