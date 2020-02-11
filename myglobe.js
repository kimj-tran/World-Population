import { select, json, tsv, geoPath, geoOrthographic, csv } from 'd3';
import * as d3 from "d3";
import * as topojson from 'topojson';

const svg = select("body")
    .append("svg")
    .attr("width", 1200)
    .attr("height", 900)


const projection = geoOrthographic()
    .rotate([0, 0])
    // .translate([width / 2, height / 2])
    .clipAngle(90)
    .scale(250);
const pathStartor = geoPath().projection(projection);

svg
    .append('path')
    .attr('class', 'globe')
    .attr('d', pathStartor({ type: 'Sphere' }))


Promise.all([
    tsv("world-country-names.tsv"),
    json("world-110m.json"),
    csv("world.csv")
]).then(([tsvData, jsonData, csvData]) => {
    const countryName = {};
    tsvData.forEach(d => {
        countryName[d.id] = d.name
    })
    const countries = topojson.feature(jsonData, jsonData.objects.countries);

    const population = {};
    csvData.forEach(d => {
        population[d.country] = d.population;
    })

    svg.selectAll('path')
        .data(countries.features)
        .enter()
        .append('path')
        .attr('class', 'land')
        .attr('d', d => pathStartor(d))
        .append('title')
        .text(d => countryName[d.id])
        .append('div')
        .text(d => population[countryName[d.id]])


        .call(
            d3.behavior
                .drag()
                .origin(function () {
                    let r = projection.rotate();
                    return { x: r[0] / sens, y: -r[1] / sens };
                })
                .on("drag", function () {
                    let rotate = projection.rotate();
                    projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
                    svg.selectAll("path.land").attr("d", path);
                    svg.selectAll(".focused").classed("focused", (focused = false));
                })
        )
});




