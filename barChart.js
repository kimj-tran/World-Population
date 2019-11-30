import * as d3 from 'd3';
import {scaleLinear, 
        max, 
        scaleBand, 
        axisLeft,
        axisBottom,
     } from "d3";

const height = 4600;
const width = 1400;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', 'lightblue')

const render = data => {
    const xScale = scaleLinear()
    //   .domain(data.map(d => d.country))
      .domain([0, max(data, d => d.population)])
      .range([0, width]);

      
      // max number of population
      
      const yScale = scaleBand()
      .domain(data.map(d => d.country))
      //   .domain([0, max(data, d => d.population)])
      .range([0, height])
      .padding(0.3);
      
    const yAxis = axisLeft(yScale);
    const xAxis = axisBottom(xScale);
        // length of all country
    const margin = { top: 30, right: 30, left: 150, bottom: 18}

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const inner = height - margin.top - margin.bottom;

    yAxis(g.append('g'));
    xAxis(g.append('g')
        .attr('transform', `translate(0, ${inner})`))
    

    g
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('y', d => yScale(d.country))
      .attr('width', d => xScale(d.population))
      .attr('height', yScale.bandwidth())
      .style('fill', 'steelblue')
      .style('stroke', 'black')
      .style('stroke-width', 0.7)
};

d3.csv("world.csv").then(data => {
  data.forEach(c => {
    c.population = +c.population * 100;
  });
  render(data);
});