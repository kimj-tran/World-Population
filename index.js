import * as d3 from "d3";
import * as topojson from 'topojson';

const svg = d3.select("body")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 900)


const projection = d3.geoOrthographic();
const pathStartor = d3.geoPath().projection(projection);

svg
    .append('path')
    .attr('d', pathStartor({type: 'Sphere'}))
    .attr('class', 'globe')


Promise.all([
  d3.tsv("world-country-names.tsv"),
  d3.json("world-110m.json"),
  d3.csv("world.csv")
]).then(data => console.log(data));


d3.json("world-110m.json") 
    .then(data => {
        const countries = topojson.feature(data, data.objects.countries)

        const path = svg.selectAll('path')
            .data(countries.features)
            .enter()
            .append('path')
            .attr('d', d => pathStartor(d))
            .attr('class', 'land')

        path
            .append('title') 
            .text('hello')
    })
