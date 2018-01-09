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

const windDirectionLocalization = {
      "Norh" :    "N",
      "NNE" :     "NNE",
      "NE" :      "NE",
      "ENE" :     "ENE",
      "East" :    "E",
      "ESE" :     "ESE",
      "SE" :      "SE",
      "SSE" :     "SSE",
      "South" :   "S",
      "SSW" :     "SSO",
      "SW" :      "SO",
      "WSW" :     "OSO",
      "West" :    "O",
      "WNW" :     "ONO",
      "NW" :      "NO",
      "NNW" :     "NNO"
};


module.exports = (cbWeather,home_country,home_city,obs_country,obs_city,key) => {
      return {
            getData: () => {

                  console.log(("["+new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + '] - [weather] getting weather from Weather Underground').white);

                  const URLS = [    "http://api.wunderground.com/api/"+key+"/conditions/q/"+obs_country+"/+"+obs_city+".json",
                                    "http://api.wunderground.com/api/"+key+"/forecast10day/q/"+home_country+"/"+home_city+".json",
                                    "http://api.wunderground.com/api/"+key+"/astronomy/q/"+home_country+"/"+home_city+".json"];

                  var forecasts=[], current={}, astronomy={};

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
                                                                  for (var i=0;i<10;i++) {
                                                                        forecasts.push({
                                                                              day:  dayLocalization[j.forecast.simpleforecast.forecastday[i].date.weekday_short],
                                                                              low:  parseInt(j.forecast.simpleforecast.forecastday[i].low.celsius),
                                                                              high: parseInt(j.forecast.simpleforecast.forecastday[i].high.celsius),
                                                                              code: j.forecast.simpleforecast.forecastday[i].icon
                                                                        });
                                                                  }
                                                            }
                                                            if (j.current_observation) {
                                                                  current.code = j.current_observation.icon;
                                                                  current.temp = j.current_observation.temp_c;
                                                                  current.wind_dir = windDirectionLocalization[j.current_observation.wind_dir];
                                                                  current.wind_degrees = j.current_observation.wind_degrees;
                                                                  current.wind_kph = j.current_observation.wind_kph;
                                                                  current.wind_gust_kph = j.current_observation.wind_gust_kph;
                                                                  current.pressure_mb= j.current_observation.pressure_mb;
                                                            }

                                                            if (j.sun_phase) {
                                                                  astronomy.sunrise = j.sun_phase.sunrise.hour+":"+j.sun_phase.sunrise.minute;
                                                                  astronomy.sunset = j.sun_phase.sunset.hour+":"+j.sun_phase.sunset.minute;
                                                            }

                                                      }
                                                      callback(null);
                                                });
                                          }
                                    }).on('error', function(e) {
                                          console.log((new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString() + ' - Got error during HTTP request!').red);
                                          callback(e);
                                    });
                              },
                              function(err){
                                    if (!err) {
                                          cbWeather(home_city,current,forecasts,astronomy);
                                    }
                              }
                        );
                  }
            }
      }
