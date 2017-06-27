const mongoose = require('mongoose')
const HouseSchema = new mongoose.Schema({
    name:{type:String},//楼盘名称
    houseDeveloper:{type:String},//开发商
    houseSaleLicense:{type:String},//销售许可证
    houseYears:{type:String},//产权及年限
    houseFeature:{type:String},//楼盘特点
    openTime:{type:String},//开盘时间
    deliverTime:{type:String},//交房时间

    housePrice:{type:String},//楼盘价格
    recentDiscount:{type:String},//近期优惠

    district:{type:String},//行政区
    houseAddr:{type:String},//楼盘地址
    salesAddr:{type:String},//售楼地址
    trafficCondition:{type:String},//交通状况
    hotspot:{type:String},//热点
    houseRoundMating:{type:String},//周边配套
    houseEducation:{type:String},//教育配套

    serviceProvider:{type:String},//物业
    servicePrice:{type:String},//物业费
    serviceProviderTel:{type:String},//物业电话
    carPositions:{type:String},//物业电话

    buildType:{type:String},//建筑类型
    houseAttr:{type:String},//楼盘属性
    buildArea:{type:String},//建筑面积
    occupyArea:{type:String},//占地面积
    houseGreeningRate:{type:String},//绿化率
    houseVolumeRate:{type:String},//容积率
    buildProgress:{type:String},//工程进度

    area:{type:String},//面积
    houseType:[{name:String,house_type:String,house_area:String,imgUrl:String}],//户型
    region:{type:String},//地区
    usage:{type:String},//用途
    houseWebsite:{type:String},//楼盘网站
    houseTel:{type:String},//楼盘电话
    houseDynamic:[{newsId:{type:mongoose.Schema.Types.ObjectId},thumbContent:String,title:String,newsDate:Date}],//楼盘动态
    houseMap:{type:String},//楼盘地图
    description:{type:String}//楼盘描述
})

const HouseModel = mongoose.model('House',HouseSchema);
module.exports = HouseModel;