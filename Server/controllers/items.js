var mongoose = require('mongoose'),
    Item = mongoose.model('Item');
var formidable = require('formidable');
var path = require('path');
var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message)
                return err.errors[errName].message;
        }
    } else {
        return 'Unknown server error';
    }
};
exports.create = function (req, res) {
    var item = new Item(req.body);
    item.seller = req.user;
    item.imagesUrl = req.body.filepaths;
    if(item.stock===0)
    item.state="noStock"
    else
    item.state = "selling";
    item.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(item);
        }
    });
};

exports.list = function (req, res) {
    Item.find().sort('-created').populate('seller', 'firstName lastName fullName').exec(function (err, items) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(items);
        }
    });
};

exports.itemByID = function (req, res, next, id) {
    Item.findById(id).populate('seller', 'firstName lastName fullName college')//或者使用populate('seller','xx'),其中xx为限定返回的内容
        .exec(function (err, item) {
            if (err)
                return next(err);
            if (!item) return next(new Error('载入商品信息' + id + '失败'));
            req.item = item;
            next();
        });
};

exports.itemByType = function (req, res, next, type) {
    var itemType='';
    switch(type){
        case 'life': itemType='生活用品';break;
        case 'study': itemType='学习用品';break;
        case 'book': itemType='图书';break;
        case 'computer': itemType='电脑配件';break;
        case 'electronic': itemType='电子产品';break;
        case 'others': itemType='其他';break;
    }
            req.itemType=itemType
            next();

};
exports.showlist = function (req, res) {
    Item.find({ itemType: req.itemType }).find().sort('-created').populate('seller', 'firstName lastName fullName').exec(function (err, items) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
             res.json(items);
        }
    });
   
};

exports.renderPublish = function (req, res, next) {
    if (req.user) {
        res.render('item', {
            title: 'Publish items Form',
            messages: req.flash('error')
        });
    } else {
        return res.redirect('/signin');
    }
};
exports.read = function (req, res) {
    res.json(req.item);
};
exports.parseForm = function (req, res, next) {
    var form = new formidable.IncomingForm();
    console.log(__dirname);
    form.uploadDir =path.resolve(__dirname,'..','..','Client/uploadImages/');
    form.encoding = 'utf-8';
    form.maxFieldsSize = 2 * 1024 * 1024;
    form.maxFields = 1000;
    form.multiples = true;
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (err)
            return next(err);
        req.body = fields;
        if (files.img.length > 1) {
            req.body.filepaths = new Array();
            for (var i in files.img) {
                if (!files.img[i].type.match('image/*')) {
                    return res.status(400).send({
                        message: '请上传正确的图片格式文件'
                    });
                }
                req.body.filepaths[i] = setImageUrl((files.img[i].path));
            }
        }
        else
            req.body.filepaths =setImageUrl((files.img.path))
        next();
    });
};
function setImageUrl(path){
    var index=path.indexOf("uploadImages");
    return '/uploadImages/'+path.substring(index+13);
}