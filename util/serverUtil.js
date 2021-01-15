const moment = require('moment');

module.exports = class OrderMatch {
    setServerError(err) {
        console.error('err', { dt_created: new Date().toISOString(), msg: err });
    }
    
    getHttpUserData() {
        let request = require('request');
        return new Promise((resolve, reject) => {
            request('https://jsonplaceholder.typicode.com/users', { json: true }, (err, res, body) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(body);
                return;
            });
        });
    }    

    saveElasticsearchInteractionData(time, interaction, ip) {
        let request = require('request');
        return new Promise((resolve, reject) => {
            request({
                url: "http://elasticsearch:9200/interaction/_doc/",
                method: "POST",
                json: true,
                body: { time: time, interaction: interaction, i: ip }
            }, function (err, response, body){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(body);
                return;
            });
        });
    } 

    getFormatedTime(){
        return moment().format('DD/MM/YYYY hh:mm:ss.SSSSS');
    }
};