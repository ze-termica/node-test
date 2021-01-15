module.exports = function (app) {
    let api = app.api.bitmap;

    app.route('/bitmap').get(api.getBitmapElementNumbers);
}