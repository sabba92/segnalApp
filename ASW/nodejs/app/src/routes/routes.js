module.exports = function(app) {
    var controller = require('../controllers/controller');

    app.route('/api/register')
        .post(controller.register);

    app.route('/api/login')
        .post(controller.login);

    app.route('/api/categories')
        .post(controller.getCategories);

    app.route('/api/categoryById')
        .post(controller.categoryById);

    app.route('/api/findComment')
        .post(controller.findComment);

    app.route('/api/upload')
        .post(controller.upload)

    app.route('/api/comment')
        .post(controller.comment)

    app.route('/api/report')
        .post(controller.report)

    app.route('/api/highlightings')
        .post(controller.getHighlightings);

    app.route('/api/highlighting')
        .post(controller.getHighlighting);

    app.route('/api/userUploads')
        .post(controller.userUploads);

    app.route('/api/levelPoints')
        .post(controller.levelPoints);

    app.route('/api/getPoints')
        .post(controller.getPoints);

    app.route('/api/getReports')
        .post(controller.getReports);

    app.route('/api/ban')
        .post(controller.ban);

    app.route('/api/close')
        .post(controller.close);

    app.route('/api/updateUser')
        .post(controller.updateUser);

    app.use(controller.getIndex);
};
