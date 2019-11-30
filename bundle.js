/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, exports) {

var width = 1000;
var height = 900;
var sens = 0.25;
var focused;
var globeProj = d3.geo.orthographic().rotate([0, 0]).translate([width / 2, height / 2]).clipAngle(90).scale(350);
var path = d3.geo.path().projection(globeProj); //globe

svg = d3.select('body').append('svg').attr('width', width).attr('height', height);
svg.append('path').datum({
  type: 'Sphere'
}).attr('class', 'globe').attr('d', path);
land.append('path.land').data;
var countrySearch = d3.select('body').append('div').attr('class', 'countrySearch');
var countryList = d3.select('body').append('select').attr('name', 'countries');
queue().defer(d3.json, 'world-110m.json').defer(d3.tsv, 'world-country-names.tsv')["await"](ready);

function ready(error, world, countryData) {
  var countryById = {},
      countries = topojson.feature(world, world.objects.countries).features; //Adding countries to select

  countryData.forEach(function (c) {
    countryById[c.id] = c.name;
    option = countryList.append('option');
    option.text(c.name);
    option.property('value', c.id);
  }); //Drawing countries on the globe

  var world = svg.selectAll('path.land').data(countries).enter().append('path').attr('class', 'land').attr("d", path) //Drag event
  .call(d3.behavior.drag().origin(function () {
    var r = globeProj.rotate();
    return {
      x: r[0] / sens,
      y: -r[1] / sens
    };
  }).on("drag", function () {
    var rotate = globeProj.rotate();
    globeProj.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
    svg.selectAll("path.land").attr("d", path);
    svg.selectAll(".focused").classed("focused", focused = false);
  })) //Mouse events
  .on("mouseover", function (d) {
    countrySearch.text(countryById[d.id]).style("left", d3.event.pageX + 7 + "px").style("top", d3.event.pageY - 15 + "px").style("display", "block").style("opacity", 1);
  }).on("mouseout", function (d) {
    countrySearch.style("opacity", 0).style("display", "none");
  }).on("mousemove", function (d) {
    countrySearch.style("left", d3.event.pageX + 7 + "px").style("top", d3.event.pageY - 15 + "px");
  }); //Country focus on option select

  d3.select("select").on("change", function () {
    var rotate = globeProj.rotate(),
        focusedCountry = country(countries, this),
        p = d3.geo.centroid(focusedCountry);
    svg.selectAll(".focused").classed("focused", focused = false); //Globe rotating

    (function transition() {
      d3.transition().duration(2500).tween("rotate", function () {
        var r = d3.interpolate(globeProj.rotate(), [-p[0], -p[1]]);
        return function (t) {
          globeProj.rotate(r(t));
          svg.selectAll("path").attr("d", path).classed("focused", function (d, i) {
            return d.id == focusedCountry.id ? focused = d : false;
          });
        };
      });
    })();
  });

  function country(cnt, sel) {
    for (var i = 0, l = cnt.length; i < l; i++) {
      if (cnt[i].id == sel.value) {
        return cnt[i];
      }
    }
  }
}

/***/ })

/******/ });
//# sourceMappingURL=bundle.js.map