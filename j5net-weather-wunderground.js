const http = require('http');
const async = require('async');

const dayLocalization = {
      "Mon" : "lun",
      "Tue" : "mar",
      "Wed" : "mer",
      "Thu" : "jeu",
      "Fri" : "ven",
      "Sat" : "sam",
      "Sun" : "dim"
};

module.exports = (cbWeather,home_country,home_city,obs_country,obs_city,key) => {
      return {
            getData: () => {

                  console.log("getting weather from Weather Underground");

                  const URLS = [    "http://api.wunderground.com/api/"+key+"/conditions/q/"+obs_country+"/+"+obs_city+".json",
                                    "http://api.wunderground.com/api/"+key+"/forecast10day/q/"+home_country+"/"+home_city+".json"];

                  var forecasts=[],code="",temp=NaN;

                  async.each(
                        URLS,
                        function(url,callback){
                              var jsondata="";

                              http.get(url,
                                    function (res) {
                                          if (res.statusCode==200) {
                                                res.on('data', function (chunk) {
                                                      jsondata+=chunk;
                                                });

                                                res.on('end', function() {
                                                      var j = JSON.parse(jsondata);

                                                      if (j && j.response) {
                                                            if (j.forecast) {
                                                                  forecasts = [];
                                                                  for (var i=0;i<5;i++) {
                                                                        forecasts.push({
                                                                              day:  dayLocalization[j.forecast.simpleforecast.forecastday[i].date.weekday_short],
                                                                              low:  parseInt(j.forecast.simpleforecast.forecastday[i].low.celsius),
                                                                              high: parseInt(j.forecast.simpleforecast.forecastday[i].high.celsius),
                                                                              code: j.forecast.simpleforecast.forecastday[i].icon
                                                                        });
                                                                  }
                                                            }
                                                            if (j.current_observation) {
                                                                  code = j.current_observation.icon;
                                                                  temp = j.current_observation.temp_c;
                                                            }

                                                      }
                                                      callback(null);
                                                });
                                          }
                                    }).on('error', function(e) {
                                          console.log("Got error during HTTP request!");
                                          callback(e);
                                    });
                              },
                              function(err){
                                    if (!err) {
                                          cbWeather(home_city,code,temp,forecasts);
                                    }
                              }
                        );
                  }
            }
      }
