(function($)
{
	$.fn.meteo=function(options){
		//CLONE DOM NE FONCTIONNE PAS EN COMMENTAIRE
		//Valeur par défaut
		var defauts={
			//taille
				height: 200,
				width: 300,
			//position
				top: 200,
				left: 300,
			//location
				city: 'bordeaux',
			//color
				'background-color': '#dedede',
			//draggable activation [true/false]
				isDraggable: true,
			//temperature choice [F/C]
				temperature: "C",
			//API choice [en/ch]
				API : "ch"
		};
		//Modification des paramètres par défaut
		var options = $.extend(defauts, options);
		//Save data if there is not internet connection
		var plugin_data = {
			description : 'null',
			degres : 0,
			img : "https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.Mf4206a3ce023448e7afabde4f78737f1o0%26pid%3D15.1&f=1",
			city : options.city
		}
		//our tamplate
		function weather_template(){
			var  weather_template = '<div class="meteo">';
			weather_template += '<div class="meteoImg">';
			weather_template += '<img src="https://images.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.Mf4206a3ce023448e7afabde4f78737f1o0%26pid%3D15.1&f=1"/>';
			weather_template += '</div>';
			weather_template += '<div class="content">';
			weather_template += '<div class="time">00:00:00 - AM</div>';
			weather_template += '<div class="city">Bordeaux</div>';
			weather_template += '<div class="description">Cloudy</div>';
			weather_template += '<div class="degres">21°</div>';
			weather_template += '<button class="refresh" >refresh</button>';
			weather_template += '</div>';
			weather_template += '</div>';

			return weather_template;
		}
		//our css
		var css = {
			meteo : {
				height: '200px',
				width: '300px',
				'background-color': '#007D6D',
				position: 'absolute',
				padding: '0px 15px',
				'border-radius': '7px',
				'-webkit-box-shadow': '5px 7px 8px 0px rgba(50, 50, 50, 0.75)',
				'-moz-box-shadow' : '5px 7px 8px 0px rgba(50, 50, 50, 0.75)',
				'box-shadow' : '5px 7px 8px 0px rgba(50, 50, 50, 0.75)'
			},
			meteoImg : {
				'vertical-align': 'middle',
				position: 'relative',
				display: 'inline-block',
				'min-height': '200px'
			},
			img :{
				height: '120px',
				'border-radius': '90px'	,
				'background-color': '#ffffff'
			},
			content : {
				display: 'inline-block',
				position: 'relative',
				padding: '0px',
				'min-height': '200px',
				'vertical-align': 'middle',
				'min-width': '150px',
			},
			city : {
				'font-size': '30px',
				'margin-top': '40px',
				'margin-left': '5px',
			},
			description : {
				'margin-left': '5px',
			},
			degres : {
				'margin-left': '60px',
				'font-size': '50px',
			},
			refresh : {
				'font-size': '13px',
				position: 'absolute',
				right: '0px',
				bottom: '10px'
			},
			time : {
				'font-size': '13px',
				color: '#101918',
				position: 'absolute',
				right: '0px',
				top: '10px',
			}
		}
		//our API US
		var weather_API_Openweather = {
			api_key: 'dbaedce7ec8958875d7bb6ee2298d829',
			city: function(city){
				return 'http://api.openweathermap.org/data/2.5/weather?APPID='+this.api_key+'&q='+city;
			},
			getPicture: function (ico) {
			 return 'http://api.openweathermap.org/img/w/'+ico;
			}
		};
		//our API ch
		var weather_API_CH = {
			city: function(city){
				return 'http://www.prevision-meteo.ch/services/json/'+city;
			}
		}

		//check data in OPTIONS
		function checkOptions(options) {
			if(options.height < 200){
				options.height = 200;
			}
			if(options.width < 300){
				options.width = 300;
			}
			if(options.top < 0){
				options.top = 0;
			}
			if(options.left < 0){
				options.left = 0;
			}
			if(options.temperature != "C" || options.temperature != "F"){
				options.temperature = "C";
			}
			if(options.API != "ch" || options.API != "en"){
				options.API == "ch";
			}
		}

		//check draggable
		function beDraggable(weather_plugin, selected) {
			$.holdReady(true);
			if(!$.fn.draggable && selected){
				$.getScript( "https://code.jquery.com/ui/1.12.1/jquery-ui.js")
				//$.getScript( "assets/js/jquery-ui.min.js")
					.done(function () {
						weather_plugin.draggable({
							zIndex: 1,
							cursor: "crosshair",
							opacity: 0.6,
							//CLONE NE MARCHE PAS
							/*helper: "clone",
							revert: "invalid",
							stop: function( event, ui ) {
								$('.pluginMeteo')
									.last()
									.after(
										$(ui.helper).clone(true, true)
											.draggable({
												container: "parent",

											})
											.css({
												top: ui.offset.top,
												left: ui.offset.left
											})
											//.attr('id', $(this).attr(id))
									);
								this.remove();
							}*/
						});

						$.holdReady(false);
					})
					.fail(function () {
						console.log('error file not loaded');
					});
			}
		}

		//return currentTime
		function writeTime(weather_plugin){
			setInterval(function(){
				var currentTime = new Date();
				var h = currentTime.getHours();
				var m = currentTime.getMinutes();
				var s = currentTime.getSeconds();
				var suffix = "AM";

				if(h >= 12){suffix = "PM";h = h - 12;}
				if(h == 0){h = 12;}
				if(h < 10){h = "0" + h ;}
				if(m < 10){m = "0" + m ;}

				$(".time", weather_plugin).text(h+":"+m+":"+s+" - "+suffix);
			},1000);
		}

		//create template
		function createTemplate(weather_plugin, options) {
			//template créer
			weather_plugin.html(weather_template());

			$('.meteo', weather_plugin).css($.extend(css.meteo, options));;

			//on divise les valeurs par 2
			var options_halft = {
				//height : (defauts.height/2)+"px",
				width : (options.width/2)+"px",
				top: 0,
				left: 0
			};
			options_halft = $.extend(options, options_halft);
			$('.meteoImg', weather_plugin).css($.extend(css.meteoImg, options_halft));
			$('.meteoImg img', weather_plugin).css(css.img);
			$('.meteoImg img', weather_plugin).css({'margin-top': ((options.height-120)/2)});
			$('.content', weather_plugin).css($.extend(css.content, options_halft));
			$('.city', weather_plugin).css(css.city);
			$('.city', weather_plugin).css({'margin-top': ((options.height-120)/2)});
			$('.time', weather_plugin).css(css.time);
			$('.refresh', weather_plugin).css(css.refresh);
			$('.degres', weather_plugin).css(css.degres);
			$('.description', weather_plugin).css(css.description);
		}

		//Convertion fonction
		function kelvinToFahrenheit(kelvin) {
			return (kelvin - 273.15)* 1.80 + 32;
		}
		function fahrenheitToCelcius(fahrenheit) {
			return (fahrenheit - 32) * 5/9;
		}
		function celciusToFahrenheit(celcius) {
			return (celcius * 9/5) + 32 ;
		}

		//Action when data is receive or not
		function loadAPIToTemplate(weather_plugin, plugin_data, options) {
			var data_API= getAPI(options.city, options.API);
			data_API
				.then(function (data) {
					console.log('API "' + options.API + '" - Data loaded - city '+ options.city);
					//choose the best
					if(options.API=="en"){
						plugin_data = getDataToOpenWeather(JSON.parse(data));
					} else {
						plugin_data = getDataToPrevisionCH(JSON.parse(data));
					}
					//réécriture du template
					rewriteTemplate(weather_plugin, plugin_data);
				})
				.catch(function (data) {
						console.log('API "' + options.API + '" - /!\\ API unreached - city /!\\ ' + options.city);
					}
				);
		}

		//create Promise AJAX without .ajax()
		function getAPI(city, API) {
			// On établit une promesse en retour
			var weather_data = new Promise( function (resolve, reject) {

				// On instancie un XMLHttpRequest
				var client = new XMLHttpRequest();
				if(API == "en"){
					client.open('GET', weather_API_Openweather.city(city));
					//console.log(weather_API_Openweather.city(city));
				} else {
					client.open('GET', weather_API_CH.city(city));
					//console.log(weather_API_CH.city(city));
				}
				client.send();

				client.onload = function () {
					if (this.status >= 200 && this.status < 300) {
						// On utilise la fonction "resolve" lorsque this.status vaut 2xx
						resolve(this.response);
					} else {
						// On utilise la fonction "reject" lorsque this.status est différent de 2xx
						reject(this.statusText);
					}
				};
				client.onerror = function () {
					reject(this.statusText);
				};
			});

			return weather_data;
		}

		//Update Template
		function rewriteTemplate(weather_plugin, plugin_data){
			$(".degres", weather_plugin).text(plugin_data.degres);
			$(".description", weather_plugin).text(plugin_data.description);
			$(".meteoImg img", weather_plugin).attr("src",plugin_data.img);
			$(".city", weather_plugin).text(plugin_data.city);
		}

		//getData with API openweather
		function getDataToOpenWeather(data) {
			plugin_data.description = data.weather[0].description + " humidity : " + data.main.humidity+"%";
			plugin_data.degres = kelvinToFahrenheit(data.main.temp);
			if(options.temperature == "C"){
				plugin_data.degres = Math.round(fahrenheitToCelcius(plugin_data.degres))+"°";
			} else {
				plugin_data.degres = Math.round(plugin_data.degres) + "F";
			}
			plugin_data.img = weather_API_Openweather.getPicture(data.weather[0].icon);

			return plugin_data;
		}
		//getDATA with API prevision-meteo
		function getDataToPrevisionCH(data) {
			plugin_data.description = data.current_condition.condition + " humidity : " + data.current_condition.humidity+"%";
			plugin_data.degres = data.current_condition.tmp;
			if(options.temperature == "F"){
				plugin_data.degres = celciusToFahrenheit(plugin_data.degres)+"F";
			} else {
				plugin_data.degres += "°";
			}
			plugin_data.img = data.current_condition.icon_big;

			return plugin_data;
		}

		//manage animation .clone()
		function manageAnimation(weather_plugin) {
			//refresh API with click button
			$('.refresh ', weather_plugin).on('click', function(e) {
				loadAPIToTemplate(weather_plugin, plugin_data, options);
			});
			//Make the plugin visible
			$('.meteo ', weather_plugin).on('mousedown', function(e) {
				$('.meteo').css({"z-index": 0});
				$(this).css({"z-index": 1});
			});

		}

		//création du plugin
		return this.each(function() {
			//Lisibility
			var weather_plugin = $(this);
			//Verification des valeurs 
			checkOptions(options);
			//Verifier que Draggable existe
			beDraggable(weather_plugin, options.isDraggable);
			//Sur le template
			createTemplate(weather_plugin, options);
			//Calculer le temps
			writeTime(weather_plugin);
			//Demande API
			loadAPIToTemplate(weather_plugin, plugin_data, options);

			//Animation
			manageAnimation(weather_plugin);
		});
	};
})(jQuery);