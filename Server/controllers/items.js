var mongoose = require('mongoose'),
    Item = mongoose.model('Item');
var formidable = require('formidable');
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
    form.uploadDir = __dirname + "../../../Client/uploadImages/";
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
                req.body.filepaths[i] = files.img[i].path;
            }
        }
        else
            req.body.filepaths = files.img.path
        console.log(req.body.filepaths);
        next();
    });
};
