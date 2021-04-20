import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./ScatterPlot.css";

import useDimensions from "react-cool-dimensions";

export const ScatterPlot = ({ dataParam, mouseoverHandler }) => {
  const { ref, width, height, entry, unobserve, observe } = useDimensions({
    onResize: ({ width, height, entry, unobserve, observe }) => {
      // Triggered whenever the size of the target is changed
      console.log("resized", width);
    },
  });

  useEffect(() => {
    window.d3 = d3;
    const data = dataParam.map((d) => {
      return { ...d._source, datetime: new Date(d._source.DateTime) };
    });

    console.log("width", width);
    console.log("data", data);
    if (width && data) {
      console.log("running");

      const margin = { top: 25, right: 20, bottom: 35, left: 40 };

      const shape = d3.scaleOrdinal(
        data.map((d) => d.species),
        d3.symbols.map((s) => d3.symbol().type(s)())
      );
      const color = d3.scaleSequential().domain([-10, 10]).interpolator(d3.interpolateRdYlGn);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.DocTone))
        .nice()
        .range([height - margin.bottom, margin.top]);
      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.datetime))
        .nice()
        .range([margin.left, width - margin.right]);

      const dAxes = { x: "Time →", y: "↑ Document Tone" };
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

      const circles = svg.selectAll("circles").data(data);

      circles
        .enter()
        .append("circle")
        .attr("cx", function (d) {
          return x(d.datetime);
        })
        .attr("cy", function (d) {
          return y(d.DocTone);
        })
        .attr("r", 3)
        .attr("fill", function (d) {
          return color(d.DocTone);
        })
        .on("click", function (event, datapoint) {
          window.open(datapoint.URL);
        })
        .on("mouseover", function (event, datapoint) {
          mouseoverHandler({ event, datapoint });
        });
        circles.exit().remove();

      return () => { console.log("cleanup scatterplot") ; d3.select("div#d3-container").selectAll("svg").remove() }
    }
  }, [width, dataParam, ref.current]);

  return <div id="d3-container" className="" ref={ref}></div>;
};
