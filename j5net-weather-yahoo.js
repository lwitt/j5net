const http = require('http');

module.exports = (cb_weather) => {
    return {
        getYahooWeather: () => {

            console.log("getting weather from yahoo");

            var jsondata="";

            http.get("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D613673%20and%20u%3D'c'&format=json&callback=",
            function (res) {

                if (res.statusCode==200) {
                    res.on('data', function (chunk) {
                        jsondata+=chunk;
                    });

                    res.on('end', function() {

                        //console.log(jsondata);

                        var DAYS=["Mon","LUN","Tue","MAR","Wed","MER","Thu","JEU","Fri","VEN","Sat","SAM","Sun","DIM"];

                        var j = JSON.parse(jsondata);

                        if (j && j.query && j.query.results) {

                            var temp=parseInt(j.query.results.channel.item.condition.temp);
                            var code=parseInt(j.query.results.channel.item.condition.code);
                            var city=j.query.results.channel.location.city;

                            //j
                            var jday1=j.query.results.channel.item.forecast[0].day;
                            for (var i=0;i<DAYS.length/2;i++)
                                if (DAYS[i*2].localeCompare(jday1)==0) day1=DAYS[i*2+1];

                            var low1=parseInt(j.query.results.channel.item.forecast[0].low);
                            var high1=parseInt(j.query.results.channel.item.forecast[0].high);
                            var code1=parseInt(j.query.results.channel.item.forecast[0].code);

                            var forecast1 = JSON.stringify({day:day1,low:low1,high:high1,code:code1});

                            //j+1
                            var jday2=j.query.results.channel.item.forecast[1].day;
                            for (var i=0;i<DAYS.length/2;i++)
                                if (DAYS[i*2].localeCompare(jday2)==0) day2=DAYS[i*2+1];

                            var low2=parseInt(j.query.results.channel.item.forecast[1].low);
                            var high2=parseInt(j.query.results.channel.item.forecast[1].high);
                            var code2=parseInt(j.query.results.channel.item.forecast[1].code);

                            var forecast2 = JSON.stringify({day:day2,low:low2,high:high2,code:code2});


                            // j+2
                            var jday3=j.query.results.channel.item.forecast[2].day;
                            for (var i=0;i<DAYS.length/2;i++)
                                if (DAYS[i*2].localeCompare(jday3)==0) day3=DAYS[i*2+1];

                            var low3=parseInt(j.query.results.channel.item.forecast[2].low);
                            var high3=parseInt(j.query.results.channel.item.forecast[2].high);
                            var code3=parseInt(j.query.results.channel.item.forecast[2].code);

                            var forecast3 = JSON.stringify({day:day3,low:low3,high:high3,code:code3});


                            // j+3
                            var jday4=j.query.results.channel.item.forecast[3].day;
                            for (var i=0;i<DAYS.length/2;i++)
                                if (DAYS[i*2].localeCompare(jday4)==0) day4=DAYS[i*2+1];

                            var low4=parseInt(j.query.results.channel.item.forecast[3].low);
                            var high4=parseInt(j.query.results.channel.item.forecast[3].high);
                            var code4=parseInt(j.query.results.channel.item.forecast[3].code);

                            var forecast4 = JSON.stringify({day:day4,low:low4,high:high4,code:code4});


                            // j+4
                            var jday5=j.query.results.channel.item.forecast[4].day;
                            for (var i=0;i<DAYS.length/2;i++)
                                if (DAYS[i*2].localeCompare(jday5)==0) day5=DAYS[i*2+1];

                            var low5=parseInt(j.query.results.channel.item.forecast[4].low);
                            var high5=parseInt(j.query.results.channel.item.forecast[4].high);
                            var code5=parseInt(j.query.results.channel.item.forecast[4].code);

                            var forecast5 = JSON.stringify({day:day5,low:low5,high:high5,code:code5});

                            cb_weather(city,code,temp,forecast1,forecast2,forecast3,forecast4,forecast5);

                        }
                    });
                }
            }).on('error', function(e) { console.log("Got error during HTTP request!");});
        }
    }
}
