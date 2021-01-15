const moment = require('moment');

module.exports = class OrderMatch {
    setServerError(err) {
        console.error('err', { dt_created: new Date().toISOString(), msg: err });
    }

    getFormatedTime(){
        return moment().format('DD/MM/YYYY hh:mm:ss.SSSSS');
    }
};