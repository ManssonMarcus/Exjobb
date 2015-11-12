/**
 * Main application controller
 *
 * You can use this controller for your whole app if it is small
 * or you can have separate controllers for each logical section
 * hej
 */
;(function() {

  angular
    .module('boilerplate')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope' ,'LocalStorage', 'QueryService', '$timeout'];


  function MainController($scope, LocalStorage, QueryService, $timeout) {



    // Local variables
    var alljson = [];
    var LSHjson = [];
    var weaponjson = [];
    var armourjson = [];
    var artjson = [];
    var clothesjson = [];
    var furniturejson = [];
    var garniturejson = [];
    var thejson = [];
    var materialRefineArray = [];
    var materialArray = [];
    var startYear;
    var snapSlider = document.getElementById('slider-snap');
    var snapValues = [
      document.getElementById('slider-snap-value-lower'),
      document.getElementById('slider-snap-value-upper')
    ];
    var text = document.getElementById('textId');
    var firstText = "";
    var secondText = "";
    var thirdText = "";
    var fourthText = "";
    var fifthText = "";
    var sixthText = "";
    var seventhText = "";
    var eighthText = "";
    


    
   

    //get datasets for all museums & LSH
    $.getJSON("geoData/LSH.json", function(json) {
      LSHjson = json;
    });
    $.getJSON("geoData/weapon.json", function(json) {
      weaponjson = json;
    });
    $.getJSON("geoData/armour.json", function(json) {
      armourjson = json;
    });
    $.getJSON("geoData/art.json", function(json) {
      artjson = json;
    });
    $.getJSON("geoData/clothes.json", function(json) {
      clothesjson = json;
    });
    $.getJSON("geoData/furniture.json", function(json) {
      furniturejson = json;
    });
    $.getJSON("geoData/garniture.json", function(json) {
      garniturejson = json;
    });
    $.getJSON("geoData/all.json", function(json) {
      alljson = json;
      thejson = json;
      materialRefineArray = json;
      getMaterials(thejson);
    });
    
    
    //function to get materials and put in the dropdown
    function getMaterials(array) {
      materialArray = [];
      for (var i = 0 ; i < array.length ; i++)  {
        var theMaterialArray = array[i].materialArray  
        for (var j = 0 ; j < array[i].materialArray.length ; j++) {
          var theMaterial = theMaterialArray[j].material;
          var year = array[i].yearInterval[0];
          if (materialArray.indexOf(theMaterial) == -1){
            materialArray.push(theMaterial);
          }
        } 
      }
      $scope.materials = materialArray;
    }


    
    //function to use the selected value from the dropdown
    $scope.showSelectMaterial = function(materialValue) {     
      var tempArray = [];
      console.log("---------------------------------------");
      for (var i = 0 ; i < materialRefineArray.length ; i++){
        for (var j = 0 ; j < materialRefineArray[i].materialArray.length ; j++){
          if (materialRefineArray[i].materialArray[j].material == materialValue) {
            var tempObject = materialRefineArray[i];
            tempObject.amount = tempObject.materialArray[j].materialAmount; 
            tempArray.push(tempObject);
            console.log(tempObject);
          }
        }
      }
      thejson = tempArray;
      setPlotYear(startYear, thejson);
    }


    //get texts for yearspans, write this iterative later
    jQuery.get('texts/1500-1550.txt', function(data) {
      firstText = data;
    });
    jQuery.get('texts/1550-1600.txt', function(data) {
      secondText = data;
    });
    jQuery.get('texts/1600-1650.txt', function(data) {
      thirdText = data;
    });    
    jQuery.get('texts/1650-1700.txt', function(data) {
      fourthText = data;
    });
    jQuery.get('texts/1700-1750.txt', function(data) {
      fifthText = data;
    });
    jQuery.get('texts/1750-1800.txt', function(data) {
      sixthText = data;
    });
    jQuery.get('texts/1800-1850.txt', function(data) {
      seventhText = data;
    });
    jQuery.get('texts/1850-1900.txt', function(data) {
      eighthText = data;
    });

    // 'controller as' syntax
    var self = this;
    

    // initialize map with center, zoom & colors
    var zoom = new Datamap({
      element: document.getElementById("mapContainer"),
      responsive: true,
      scope: 'world',

      // Zoom in ór out
      setProjection: function(element) {
        var projection = d3.geo.equirectangular()
          .center([15.44, 57.7605])
          .rotate([4.4, 0])
          .scale(200)
          .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
          .projection(projection);
        
        return {path: path, projection: projection};
      },
      fills: {
          //17 different fills for the amount
            '0f0': '#0f0',
            '2f0': '#2f0',
            '4f0': '#4f0',
            '6f0': '#6f0',
            '8f0': '#8f0',
            'af0': '#af0',
            'cf0': '#cf0',
            'ef0': '#ef0',
            'ff0': '#ff0',
            'fe0': '#fe0',
            'fc0': '#fc0',
            'fa0': '#fa0',
            'f80': '#f80',
            'f60': '#f60',
            'f40': '#f40',
            'f20': '#f20',
            'f00': '#f00',
            defaultFill: '#B2A464'
        },
    });

    // eventlistener for the bubbles
    $(zoom.svg[0][0]).on('click', '.bubbles', function(geography) {
      var country = geography.toElement.__data__.name;
      var yearInterval = geography.toElement.__data__.yearInterval;
      getArtifacts(country, yearInterval);
    });

    function getArtifacts(country, yearInterval){
      
      var startYear = yearInterval[0];
      var endYear = yearInterval[1];
      var list = document.createElement('ul');
      var headCountry = document.createElement('h1');
      headCountry.appendChild(document.createTextNode(country));
      list.appendChild(headCountry);

      $.ajax({
          //dataType: "json",
          url: 'http://kulturarvsdata.se/ksamsok/api?stylesheet=&x-api=test&method=search&hitsPerPage=200&query=place%3D%22'+country+'%22+and+create_toTime%3E%3D'+startYear+'+and+create_fromTime%3C%3D'+endYear,
          type: 'GET',
          withCredentials: true,
      })
      .done(function(theData) {

        hits = theData.getElementsByTagName("totalHits")[0].childNodes[0].nodeValue;

        var limit;

        if (hits > 50){
          limit = 50;
        }
        else {
          limit = hits;
        }
        for (var i = 0 ; i < limit ; i++) {
          var test = theData.getElementsByTagName("record")[i];
          //test = test.getElementsByTagName("RDF")[0];
          if(test){
            for (var j = 0 ; j<50 ; j++) {

              
            
              //var thisCountry = test.getElementsByTagName("countryName")[j];
              var object = test.getElementsByTagName("itemLabel")[j];
              var description = test.getElementsByTagName("description")[j];
              var image = test.getElementsByTagName("thumbnail")[j];

              if (description && object && image) {


                  var artefact = object.childNodes[0].nodeValue;
                  var info = description.childNodes[0].nodeValue;
                  var imgLink = image.childNodes[0].nodeValue;
               
                  var divItem = document.createElement('div');
                  var headItem = document.createElement('h2');
                  var textItem = document.createElement('p');
                  var imgItem = document.createElement('img');

                  headItem.setAttribute('class', artefact);
                  headItem.appendChild(document.createTextNode(artefact));
                  textItem.appendChild(document.createTextNode(info));
                  imgItem.setAttribute('src', imgLink);
                  
                  divItem.appendChild(headItem);
                  divItem.appendChild(textItem);
                  divItem.appendChild(imgItem);
                  list.appendChild(divItem);
              } 
              else if (description && object && !image) {


                  var artefact = object.childNodes[0].nodeValue;
                  var info = description.childNodes[0].nodeValue;
               
                  var divItem = document.createElement('div');
                  var headItem = document.createElement('h2');
                  var textItem = document.createElement('p');

                  headItem.setAttribute('class', artefact);
                  headItem.appendChild(document.createTextNode(artefact));
                  textItem.appendChild(document.createTextNode(info));
                  
                  divItem.appendChild(headItem);
                  divItem.appendChild(textItem);
                  list.appendChild(divItem);

              }
              
            }
          }
        }

        $.colorbox({html:list, width:'50%'});

      
      }).fail(function(req) { 
        console.log("err");
      });
    }

    //stupid way of initializing dots on the map, needs to change
    setTimeout(function(){ setPlotYear(startYear, thejson)}, 600);

    //Listen to radiobutton to assign right dataset to thejson
    $scope.newValue = function(value) {
      if (value == "LSH") {
        document.getElementById("radioWeapon").disabled = true;
        document.getElementById("weaponID").style.opacity=0.5;  
        document.getElementById("radioClothes").disabled = true;
        document.getElementById("clothesID").style.opacity=0.5; 
        document.getElementById("radioFurniture").disabled = true;
        document.getElementById("furnitureID").style.opacity=0.5; 
        document.getElementById("radioArt").disabled = true;
        document.getElementById("artID").style.opacity=0.5; 
        document.getElementById("radioGarniture").disabled = true;
        document.getElementById("garnitureID").style.opacity=0.5; 
        document.getElementById("radioArmour").disabled = true;
        document.getElementById("armourID").style.opacity=0.5; 
        thejson = LSHjson;
        materialRefineArray = LSHjson;
        setPlotYear(startYear, LSHjson);
        getMaterials(thejson);
      }
      else if (value == "all"){
        document.getElementById("radioWeapon").disabled = false;
        document.getElementById("weaponID").style.opacity=1.0; 
        document.getElementById("radioClothes").disabled = false;
        document.getElementById("clothesID").style.opacity=1.0; 
        document.getElementById("radioFurniture").disabled = false;
        document.getElementById("furnitureID").style.opacity=1.0; 
        document.getElementById("radioArt").disabled = false;
        document.getElementById("artID").style.opacity=1.0; 
        document.getElementById("radioGarniture").disabled = false;
        document.getElementById("garnitureID").style.opacity=1.0; 
        document.getElementById("radioArmour").disabled = false;
        document.getElementById("armourID").style.opacity=1.0; 
        thejson = alljson;
        materialRefineArray = alljson;
        setPlotYear(startYear, alljson);
        getMaterials(thejson);
      }
      else if (value == "weapon"){
        thejson = weaponjson;
        materialRefineArray = weaponjson;
        setPlotYear(startYear, weaponjson);
        getMaterials(thejson);
      }
      else if(value == "armour") {
        thejson = armourjson;
        materialRefineArray = armourjson;
        setPlotYear(startYear, armourjson);
        getMaterials(thejson);
      }
      else if(value == "art") {
        thejson = artjson;
        materialRefineArray = artjson;
        setPlotYear(startYear, artjson);
        getMaterials(thejson);
      }
      else if(value == "clothes") {
        thejson = clothesjson;
        materialRefineArray = clothesjson;
        setPlotYear(startYear, clothesjson);
        getMaterials(thejson);
      }
      else if(value == "furniture") {
        thejson = furniturejson;
        materialRefineArray = furniturejson;
        setPlotYear(startYear, furniturejson);
        getMaterials(thejson);
      }
      else if(value == "garniture") {
        console.log("yaya!");
        thejson = garniturejson;
        materialRefineArray = garniturejson;
        setPlotYear(startYear, garniturejson);
        getMaterials(thejson);
      }
    }

    function calcRadius(val){
      if (val == 0){return 0;}
      else if (10 >= val > 0){return 7;}
      else if (20 >= val > 10){return 8;}
      else if (30 >= val > 20){return 9;}
      else if (40 >= val > 30){return 10;}
      else if (50 >= val > 40){return 11;}
      else if (60 >= val > 50){return 12;}
      else if ( val > 60){return 13;}
    }
    function setFill(val) {
      
      if (val <= 50){return '0f0'}
      else if (100 >= val > 50){return '2f0'}
      else if (150 >= val > 100){return '4f0'}
      else if (200 >= val > 150){return '6f0'}  
      else if (250 >= val > 200){return '8f0'}  
      else if (300 >= val > 250){return 'af0'}  
      else if (350 >= val > 300){return 'cf0'}  
      else if (400 >= val > 350){return 'ef0'}
      else if (450 >= val > 400){return 'ff0'} 
      else if (500 >= val > 450){return 'fe0'}
      else if (550 >= val > 500){return 'fc0'} 
      else if (600 >= val > 550){return 'fa0'} 
      else if (650 >= val > 600){return 'f80'}    
      else if (700 >= val > 650){return 'f60'} 
      else if (750 >= val > 700){return 'f40'} 
      else if (800 >= val > 750){return 'f20'}               
      else {return 'f00'}
    }


    //set right yearSpan for plot
    function setPlotYear(startYear, theArray) {
      var tempArray = [];
        for (var i = 0 ; i < theArray.length ; i++){
          if(startYear == theArray[i].yearInterval[0]) {
              tempArray.push(theArray[i]);
          }
          if (i+1 == theArray.length) {
            plot(tempArray);
          }
        }
    }
    //simple plot-function
    function plot(occ){
      $.getJSON("data.json", function(json) {
        var array = [];
        for (var i = 0 ; i < json.length ; i++) {
          for (var j = 0 ; j < occ.length ; j++){
            if (json[i].CountryName.toLowerCase() == occ[j].placeName.toLowerCase()) {
              array.push({
                name: json[i].CountryName, 
                fillKey: setFill(occ[j].amount), 
                latitude: json[i].CapitalLatitude, 
                longitude: json[i].CapitalLongitude, 
                radius: calcRadius(occ[j].amount),
                "yearInterval" : occ[j].yearInterval
              });
            }
          }
        }   
        zoom.bubbles(array, {
          popupTemplate: function(geo, array) {
            return "<div class='hoverinfo'>Bubble for " + array.name;
          }
        });
      });
    }

    //preferences for range-slider
    noUiSlider.create(snapSlider, {
      start: 1500,
      snap: true,
      connect: false,
      range: {
        'min': 1500,
        '15%': 1550,
        '30%': 1600,
        '45%': 1650,
        '60%': 1700,
        '75%': 1750,
        '90%': 1800,
        'max': 1850
      }
    });


    function changeText(value) {
      if (value == 1500) {
          setTimeout(function(){ text.innerHTML = firstText;}, 100);
      }
      if (value == 1550) {
        setTimeout(function(){ text.innerHTML = secondText}, 100); 
      }
      if (value == 1600) {
        setTimeout(function(){ text.innerHTML = thirdText}, 100); 
      }
      if (value == 1650) {
        setTimeout(function(){ text.innerHTML = fourthText}, 100); 
      }
      if (value == 1700) {
        setTimeout(function(){ text.innerHTML = fifthText}, 100); 
      }
      if (value == 1750) {
        setTimeout(function(){ text.innerHTML = sixthText}, 100); 
      }
      if (value == 1800) {
        setTimeout(function(){ text.innerHTML = seventhText}, 100); 
      }
      if (value == 1850) {
        setTimeout(function(){ text.innerHTML = eighthText}, 100); 
      }
    }

    //get values from range-slider
    snapSlider.noUiSlider.on('update', function( values, handle ) {
      startYear = parseInt(values[0]);
      changeText(parseInt(values[0]));
      setPlotYear(startYear, thejson);
      snapValues[handle].innerHTML = startYear+"-"+ (startYear+50);
    });
    
  }


})();