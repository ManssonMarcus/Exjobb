var zoom = new Datamap({
  element: document.getElementById("container"),
  responsive: true,
  scope: 'world',
  // Zoom in on Africa
  setProjection: function(element) {
    var projection = d3.geo.equirectangular()
      .center([23, -3])
      .rotate([4.4, 0])
      .scale(200)
      .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    var path = d3.geo.path()
      .projection(projection);
    
    return {path: path, projection: projection};
  },
  fills: {
    defaultFill: "#ABDDA4",
    gt50: "#FA1",
    gt500: "#55F"
    
  },
  data: {
    'ZAF': { fillKey: 'gt50' },
    'ZWE': { fillKey: 'lt25' },
    'NGA': { fillKey: 'lt50' },
    'MOZ': { fillKey: 'eq50' },
    'MDG': { fillKey: 'eq50' },
    'EGY': { fillKey: 'gt75' },
    'TZA': { fillKey: 'gt75' },
    'LBY': { fillKey: 'eq0' },
    'DZA': { fillKey: 'gt500' },
    'SSD': { fillKey: 'pink' },
    'SOM': { fillKey: 'gt50' },
    'GIB': { fillKey: 'eq50' },
    'AGO': { fillKey: 'lt50' }
  }
});

var countryArray = [];
var occurrences = [];
var tempral = [];

$.ajax({
    //dataType: "json",
    url: 'http://kulturarvsdata.se/ksamsok/api?stylesheet=&x-api=lsh772&method=search&hitsPerPage=500&sort=serviceOrganization&startRecord='+40000+'&query=create_toTime%3E%3D1500+and+create_fromTime%3C%3D1900',
    type: 'GET',
    withCredentials: true,
})
.done(function(dataFromKsam) {

		$.getJSON("data.json", function(json) {
	    		
				var array = [];

	    		for (var i = 0 ; i < 200 ; i++) {
	    			array.push({name: json[i].CountryName, latitude: json[i].CapitalLatitude, longitude: json[i].CapitalLongitude, radius: 1});
	    		}
	    		
	    		zoom.bubbles(array, {
				 popupTemplate: function(geo, data) {
				   return "<div class='hoverinfo'>Bubble for " + data.name + "";
				 }
				});
		})


	function plot(occ){
		$.getJSON("data.json", function(json) {
	    		
				var array = [];

	    		for (var i = 0 ; i < json.length ; i++) {
	    			for (var j = 0 ; j < occ.length ; j++){
	    				if (json[i].CountryName == occ[j].place) {
	    					array.push({name: json[i].CountryName, latitude: json[i].CapitalLatitude, longitude: json[i].CapitalLongitude, radius: occ[j].value/2});
	    				}
	    			}
	    		}
	    		
	    		zoom.bubbles(array, {
				 popupTemplate: function(geo, data) {
				   return "<div class='hoverinfo'>Bubble for " + data.name + "";
				 }
				});
		});
	}

	var hits = dataFromKsam.getElementsByTagName("totalHits")[0].childNodes[0].nodeValue;		
	
	for (var i = 0 ; i < 500 ; i++){

		country = dataFromKsam.getElementsByTagName("countryName")[i];
		// museum = dataFromKsam.getElementsByTagName("serviceOrganization")[i];
		// place = dataFromKsam.getElementsByTagName("placeLabel")[i];
		// year =  dataFromKsam.getElementsByTagName("timeLabel")[i];
		// description = dataFromKsam.getElementsByTagName("desc")[i];

		if (country) {
			//workaround for checking if value exists in object-Array
			if (tempral.indexOf(country.childNodes[0].nodeValue) == -1) {
					occurrences.push({place: country.childNodes[0].nodeValue, value: 1});
					tempral.push(country.childNodes[0].nodeValue);
			}	
			else {
				occurrences[tempral.indexOf(country.childNodes[0].nodeValue)].value++;
			}		
		}
		if (i+1 == 500) {
			plot(occurrences);
		}
	}

}).fail(function(req) {	
	console.log("err");
});


