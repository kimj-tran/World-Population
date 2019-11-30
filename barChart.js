import * as d3 from 'd3';

const height = 800;
const width = 1200;

const svg = d3.select('body')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', 'lightblue')