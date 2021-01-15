
module.exports = function (app) {
    let api = {};
    let ServerUtil = require('../util/serverUtil');
    let serverUtil = new ServerUtil(app);

    // This api receives a RaceLog and make some analyses
    api.getReceResults = function (req, res) {
        console.time('Processing time');
        console.log(serverUtil.getFormatedTime(), 'post request on /heroes remote ip: ', req.connection.remoteAddress);


        // console.log(req.body.raceInfo.splice(1,Number.MAX_VALUE));
        let raceInfo = prepareData(req.body.raceInfo);

        if (raceInfo.wrongLaps.length > 0) {
            console.timeEnd('Processing time');
            res.status(400).send({ err: 'Please check raceInformation', wrongLaps: raceInfo.wrongLaps });
            return;
        }

        // procssing laps info
        raceInfo = getRaceInfo(raceInfo.raceLaps);

        // Sorting by total racetime
        raceInfo.sort(function(a, b){
            return a.raceTime < b.raceTime ? -1 : a.raceTime > b.raceTime ? 1 : 0;
        });

        // inserting final position
        let finishiers = 1
        raceInfo.forEach((element, index) => {
            if (element.lap > 3){ 
                raceInfo[index]['finish'] = true; 
                raceInfo[index]['position'] = finishiers++;
            } else {
                raceInfo[index]['finish'] = false; 
                raceInfo[index]['position'] = -1;
            }

        });


        console.timeEnd('Processing time');
        res.status(200).send({ raleInfo: raceInfo });
        return;
        // }).catch(err => {
        //     console.timeEnd('Processing time');
        //     res.status(500).send({ err: 'Sorry bro' });
        //     console.log(err);
        // });
    }

    function prepareData(raceData) {
        let wrongLaps = new Array();
        let raceLaps = new Array();

        // console.log(checkHeader(raceData[0]));
        if (checkHeader(raceData[0])) {
            raceData = raceData.splice(1, Number.MAX_VALUE);

            raceData.forEach(element => {
                let lap = element.split(';');
                if (validateLap(lap)) {
                    raceLaps.push({
                        time: lap[0],
                        heroCode: lap[1].split('–')[0],
                        heroName: lap[1].split('–')[1],
                        lap: lap[2],
                        lapTime: lap[3],
                        avgSpeed: lap[4]
                    });
                } else {
                    wrongLaps.push(lap);
                }
            });

            raceLaps.sort(function (a, b){
                return a.lap < b.lap ? -1 : a.lap > b.lap ? 1 : 0;
            });

        } else {
            throw "Wrong header";
        }
        return { raceLaps: raceLaps, wrongLaps: wrongLaps };
    }

    function validateLap(lap) {
        return lap.length === 5 ? true : false;
    }

    function getRaceInfo(raceLaps) {
        let heroes = new Array();
        let raceStatus = {};

        raceLaps.forEach(lap => {
            let inserted = false;
            for(let x=0; x<heroes.length; x++){               
                if (lap.heroCode === heroes[x].heroCode){
                    heroes[x].time = lap.time;
                    heroes[x].lap = lap.lap;
                    heroes[x].raceTime = parseFloat(heroes[x].raceTime) + getParsedTime(lap.lapTime);
                    heroes[x].avgSpeed = (parseFloat(heroes[x].avgSpeed) + getParserSpeed(lap.avgSpeed)) / 2;

                    inserted = true;
                    x = heroes.length;
                }
            }
            if (!inserted){
                heroes.push({
                    time: lap.time,
                    heroCode: lap.heroCode,
                    heroName: lap.heroName,
                    lap: lap.lap,
                    raceTime: getParsedTime(lap.lapTime),
                    avgSpeed: getParserSpeed(lap.avgSpeed)
                });
            }
        });

        return heroes;
    }

    function getParsedTime(lapTime){
        let hour = 0
        let min = 0;
        let sec = 0;

        if (lapTime.split(':').length === 3){
            hour = lapTime.split(':')[0];
            min = lapTime.split(':')[1];
            sec = lapTime.split(':')[2];
        } else if (lapTime.split(':').length === 2){
            min = lapTime.split(':')[0];
            sec = lapTime.split(':')[1];
        } else {
            sec = lapTime;
        }
        return parseFloat(parseInt(hour) * 3600 + parseInt(min) * 60 + parseFloat(sec));
    }

    function checkHeader(data) {
        return data.indexOf('Hora') !== -1 ? true : false;
    }

    function getParserSpeed(avgSpeed){
        avgSpeed.replace(',','.');
        return parseFloat(avgSpeed);
    }


    // { 
    //     code: 0,
    //     name: '',
    //     laps: 0,
    //     totalTime: '',


    return api;
}