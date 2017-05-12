const http = require('http');

module.exports = (cbWeather,country,city,key) => {
    return {
        getData: () => {

            console.log("getting weather from Weather Underground");

            var jsondata="";

            http.get("http://api.wunderground.com/api/"+key+"/forecast10day/q/"+country+"/"+city+".json",
            function (res) {

                if (res.statusCode==200) {
                    res.on('data', function (chunk) {
                        jsondata+=chunk;
                    });

                    res.on('end', function() {

                        // console.log(jsondata);

                        var j = JSON.parse(jsondata);

                        if (j && j.response && j.forecast) {
                              var code="",temp="";
                              var forecasts=[];

                              for (var i=0;i<5;i++) {
                                    forecasts.push({
                                                day:  j.forecast.simpleforecast.forecastday[i].date.weekday_short,
                                                low:  parseInt(j.forecast.simpleforecast.forecastday[i].low.celsius),
                                                high: parseInt(j.forecast.simpleforecast.forecastday[i].high.celsius),
                                                code: j.forecast.simpleforecast.forecastday[i].icon
                                    });
                              }

                              console.log(forecasts);
                              cbWeather(city,code,temp,forecasts);

                        }
                    });
                }
            }).on('error', function(e) { console.log("Got error during HTTP request!");});
        }
    }
}
