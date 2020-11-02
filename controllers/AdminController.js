const User = require('../models').User;

module.exports = {
    index: function(req, res) {
        return res.render('admin/index.html');
    }
}