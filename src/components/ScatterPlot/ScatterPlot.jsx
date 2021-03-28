import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./ScatterPlot.css";

import useDimensions from "react-cool-dimensions";



export const ScatterPlot = ({ dataParam }) => {
  const { ref, width, height, entry, unobserve, observe } = useDimensions({
    onResize: ({ width, height, entry, unobserve, observe }) => {
      // Triggered whenever the size of the target is changed
      console.log("resized", width)
    },
  });

  useEffect(() => {
    const data = dataParam;
    
    console.log("width", width)
    console.log("data", data)
    if (width && data) {
      console.log("running")

    const margin = { top: 25, right: 20, bottom: 35, left: 40 };
    
    const shape = d3.scaleOrdinal(
      data.map((d) => d.species),
      d3.symbols.map((s) => d3.symbol().type(s)())
    );
    const color = d3.scaleOrdinal(
      data.map((d) => d.species),
      d3.schemeCategory10
    );
    const y = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.sepalWidth))
      .nice()
      .range([height - margin.bottom, margin.top]);
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.sepalLength))
      .nice()
      .range([margin.left, width - margin.right]);

    const dAxes = { x: "Sepal length (cm) →", y: "↑ Sepal width (cm)" };
    const grid = (g) =>
      g
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", 0.1)
        .call((g) =>
          g
            .append("g")
            .selectAll("line")
            .data(x.ticks())
            .join("line")
            .attr("x1", (d) => 0.5 + x(d))
            .attr("x2", (d) => 0.5 + x(d))
            .attr("y1", margin.top)
            .attr("y2", height - margin.bottom)
        )
        .call((g) =>
          g
            .append("g")
            .selectAll("line")
            .data(y.ticks())
            .join("line")
            .attr("y1", (d) => 0.5 + y(d))
            .attr("y2", (d) => 0.5 + y(d))
            .attr("x1", margin.left)
            .attr("x2", width - margin.right)
        );
    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", -margin.left)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(dAxes.y)
        );
    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80))
        .call((g) => g.select(".domain").remove())
        .call((g) =>
          g
            .append("text")
            .attr("x", width)
            .attr("y", margin.bottom - 4)
            .attr("fill", "currentColor")
            .attr("text-anchor", "end")
            .text(dAxes.x)
        );

    const svg = d3
      .select("div#d3-container")
      .selectAll("svg")
      .data([data])
      .enter()
      .append("svg")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", [0, 0, width, height])
      .classed("svg-content", true);

    svg.append("g").call(xAxis);

    svg.append("g").call(yAxis);

    svg.append("g").call(grid);

    svg
      .append("g")
      .attr("stroke-width", 1.5)
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .selectAll("path")
      .data(data)
      .join("path")
      .attr("transform", (d) => `translate(${x(d.sepalLength)},${y(d.sepalWidth)})`)
      .attr("fill", (d) => color(d.species))
      .attr("d", (d) => shape(d.species));
    }
  }, [width, dataParam]);

  return <div id="d3-container" className="" ref={ref}></div>;
};
