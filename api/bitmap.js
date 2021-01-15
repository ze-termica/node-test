
module.exports = function (app) {
    let api = {};
    let ServerUtil = require('../util/serverUtil');
    let serverUtil = new ServerUtil(app);

    // Be aware that we have a limitation of 2.048 characteres for this request
    api.getBitmapElementNumbers = function (req, res) {
        console.time('Processing time');
        console.log(serverUtil.getFormatedTime(), 'post request on /bitmap remote ip: ', req.connection.remoteAddress);

        var arr = JSON.parse(req.query.vector);
        console.log(arr);

        // validating vector. The allowed values must be betweeb 0 and 15
        try {
            validateVector(arr);
        } catch (err) {
            console.log(err);
            console.timeEnd('Processing time');
            res.status(400).send({ err: err });
        }

        // Processing vector
        let items = [];
        try {
            items = countItems(arr);
        } catch (err) {
            console.timeEnd('Processing time');
            res.status(500).send({ err: err });
        }

        // formating
        items.forEach((element, index) => {
            items[index] = 'N' + index + '=' + element;
        });

        res.status(200).send({result: items});
        return;
    }

    api.sum = function (a, b) {
        console.log('run sum');
        return a + b;
    }

    // Counting the elements from input vector
    function countItems(arr) {
        let items = new Array(16).fill(0);
        console.log('X = '+items);

        arr.forEach(element => {
            items[element]++;
        });

        console.log('X = '+arr);
        console.log('X = '+items);
        return items;
    }

    function validateVector(arr) {
        for (let x = 0; x < arr.lenght; x++) {
            if (arr[x] < 0 || arr[x] > 15) {
                throw "Wrong vector the values must be > 0 and < 16";
            }
            // console.log(x);
        };
        return true;
    }

    return api;
}