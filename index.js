import { select, json, tsv, geoPath, geoOrthographic, csv } from 'd3';
import * as d3 from "d3";
import * as topojson from 'topojson';

const svg = select("body")
  .append("svg")
  .attr("width", 1200)
  .attr("height", 900)


const projection = geoOrthographic();
const pathStartor = geoPath().projection(projection);

svg
    .append('path')
    .attr('class', 'globe')
    .attr('d', pathStartor({type: 'Sphere'}))


Promise.all([
  tsv("world-country-names.tsv"),
  json("world-110m.json"),
  csv("world.csv")
]).then(([tsvData, jsonData, csvData]) => {
  // console.log(csvData);
  const countryName = {};
  tsvData.forEach( d => {
    countryName[d.id] = d.name
  })
  const countries = topojson.feature(jsonData, jsonData.objects.countries);

  const population = {};
  csvData.forEach( d => {
    population[d.country] = d.population;
  })

  // console.log(population)

  svg.selectAll('path')
        .data(countries.features)
      .enter()
        .append('path')
        .attr('class', 'land')
        .attr('d', d => pathStartor(d))
      .append('title')
        .text( d => countryName[d.id])
      .append('p')
        .text(d => population[countryName[d.id]])


});



