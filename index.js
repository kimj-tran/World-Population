import * as d3 from "d3";
import * as topojson from 'topojson';

const svg = d3.select("body")
  .append("svg")
  .attr("width", 1000)
  .attr("height", 700)
  .style("background-color", "steelblue");

const projection = d3.geoMercator();
const pathStartor = d3.geoPath().projection(projection);

d3.json("world-110m.json") 
    .then(data => {
        const countries = topojson.feature(data, data.objects.countries)
        
        const path = svg.selectAll('path')
            .data(countries.features)

        path
            .enter()
            .append('path')
            .attr('d', d => pathStartor(d))
    })
