let width = 1000;
let height = 900;
let sens = 0.25;
let focused;

let globeProj = d3.geo
  .orthographic()
  .rotate([0, 0])
  .translate([width / 2, height / 2])
  .clipAngle(90)
  .scale(350)

let path = d3.geo.path().projection(globeProj);

//globe

svg = d3
  .select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);


svg
  .append('path')
  .datum({ type: 'Sphere' })
  .attr('class', 'globe')
  .attr('d', path);

land
  .append('path.land')
  .data

let countrySearch = d3
    .select('body')
    .append('div')
    .attr('class', 'countrySearch')

let countryList = d3
    .select('body')
    .append('select')
    .attr('name', 'countries');

queue()
  .defer(d3.json, 'world-110m.json')
  .defer(d3.tsv, 'world-country-names.tsv')
  .await(ready);


function ready(error, world, countryData) {
  let countryById = {},
    countries = topojson.feature(world, world.objects.countries).features;

  //Adding countries to select

  countryData.forEach(function(c) {
    countryById[c.id] = c.name;
    option = countryList.append('option');
    option.text(c.name);
    option.property('value', c.id);
  });

  //Drawing countries on the globe

  var world = svg
    .selectAll('path.land')
    .data(countries)
    .enter()
    .append('path')
    .attr('class', 'land')
    .attr("d", path)
    

    //Drag event

    .call(
      d3.behavior
        .drag()
        .origin(function() {
          let r = globeProj.rotate();
          return { x: r[0] / sens, y: -r[1] / sens };
        })
        .on("drag", function() {
          let rotate = globeProj.rotate();
          globeProj.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
          svg.selectAll("path.land").attr("d", path);
          svg.selectAll(".focused").classed("focused", (focused = false));
        })
    )

    //Mouse events

    .on("mouseover", function(d) {
      countrySearch
        .text(countryById[d.id])
        .style("left", d3.event.pageX + 7 + "px")
        .style("top", d3.event.pageY - 15 + "px")
        .style("display", "block")
        .style("opacity", 1);
    })
    .on("mouseout", function(d) {
      countrySearch.style("opacity", 0).style("display", "none");
    })
    .on("mousemove", function(d) {
      countrySearch
        .style("left", d3.event.pageX + 7 + "px")
        .style("top", d3.event.pageY - 15 + "px")
    });

  //Country focus on option select

  d3.select("select").on("change", function() {
    var rotate = globeProj.rotate(),
      focusedCountry = country(countries, this),
      p = d3.geo.centroid(focusedCountry);

    svg.selectAll(".focused").classed("focused", (focused = false));

    //Globe rotating

    (function transition() {
      d3.transition()
        .duration(2500)
        .tween("rotate", function() {
          var r = d3.interpolate(globeProj.rotate(), [-p[0], -p[1]]);
          return function(t) {
            globeProj.rotate(r(t));
            svg
              .selectAll("path")
              .attr("d", path)
              .classed("focused", function(d, i) {
                return d.id == focusedCountry.id ? (focused = d) : false;
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
