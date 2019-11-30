import * as d3 from 'd3';

const height = 800;
const width = 1200;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', 'lightblue')

const render = data => {
    const xScale = scaleLiner()
        .domain(([0, max(data, d => d.population)]))
        .range([0, width])

        // max number of population

    const yScale = scaleBand()
        .domain(data.map(d => d.country))
        .range([0, height])

        // length of all country
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("y", d => yScale(d.country))
      .attr("width", d => xScale(d.population))
      .attr("height", yScale.bandwidth())
      .style("fill", "blue");
}