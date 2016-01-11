var mongoose = require('mongoose'),
    Article = mongoose.model('Article');
var Manage = mongoose.model('Manage');
     var getErrorMessage = function(err) {
        if(err.errors) {
            for (var errName in err.errors) {
                if (err.errors[errName].message)
                return err.errors[errName].message;
            }
        } else {
            return 'Unknown server error';
        }
    };
exports.create = function(req, res) {
    var article = new Article(req.body);
    var manage = new Manage(req.session.manage)
    article.creator =manage;
    article.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json({success:true,
                article:article
                });
        }
    });
};
exports.list = function(req, res) {
    Article.find().sort('-created').populate('creator', 'fullName').
    exec(function(err, articles) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(articles);
        }
    });
};
exports.articleByID = function(req, res, next, id) {
    Article.findById(id).populate('creator', 'fullName').exec(function(err, article) {
        if (err) return next(err);
        if (!article) return next(new Error('Failed ti load atricle' + id));
        req.article = article;
        next();
    });
};
exports.read = function(req, res) {
    res.json(req.article);
};
exports.update = function(req, res) {
    var article = req.article;
    article.title = req.body.title;
    article.content = req.body.content;
    article.save(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};
exports.delete = function(req, res) {
    var article = req.article;
    article.remove(function(err) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(article);
        }
    });
};
exports.hasAuthorization = function(req, res, next) {
    if (req.article.creator.id !== req.session.manage.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};