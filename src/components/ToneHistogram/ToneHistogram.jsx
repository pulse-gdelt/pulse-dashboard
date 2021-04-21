import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./ToneHistogram.css";
import lodash from "lodash"
import useDimensions from "react-cool-dimensions";

export const ToneHistogram = ({ topicFilter, dataParam, mouseoverHandler }) => {
  const { ref, width, height, entry, unobserve, observe } = useDimensions({
    onResize: ({ width, height, entry, unobserve, observe }) => {
      // Triggered whenever the size of the target is changed
      console.log("resized", width);
    },
  });
  console.log("histogram topic filter", topicFilter)
  useEffect(() => {
    window.d3 = d3;
    const data = dataParam;

    // Flatten the json object into a simple array of DocTone:count pairs to construct the historgram
    var nest = [];
    console.log("aa", data);
    // let buckets = lodash.toPairs(data.hits.hits).reduce((acc, val) => { acc[val[0]] = {key: Math.floor(val[0]), doc_count: val[1] }; return acc }, {})

    // for (let bucket in data.aggregations.doctone_distribution.buckets) {
    //   nest.push({
    //     key: data.aggregations.doctone_distribution.buckets[bucket]["key"],
    //     value: data.aggregations.doctone_distribution.buckets[bucket]["doc_count"],
    //   });
    // }
    let datahits = undefined;
    if (data.hits) {
        datahits = data.hits.hits
      if (topicFilter) {
        datahits = data.hits.hits.filter(i => i._source.topic === topicFilter)
      }
      nest = lodash
        .toPairs(lodash.countBy(datahits, (i) => parseFloat(Math.round(i._source.DocTone)).toFixed(1)))
        .map((i) => {
          return { key: i[0], value: i[1] };
        });

      nest = lodash.sortBy(nest, (point) => parseFloat(point.key))
    }
    console.log("new nest", nest);

    // Push empty values into the array so that the 0 value tick is centered
    var tone_max = Math.max.apply(
      Math,
      nest.map(function (o) {
        return o.key;
      })
    );
    var tone_min_mod = -Math.min.apply(
      Math,
      nest.map(function (o) {
        return o.key;
      })
    );
    console.log(tone_min_mod);

    if (tone_max > tone_min_mod) {
      for (let step = tone_min_mod + 1; step < tone_max + 1; step++) {
        nest.push({ key: step, value: 0 });
      }
    } else {
      for (let step = tone_max + 1; step < tone_min_mod + 1; step++) {
        nest.push({ key: step, value: 0 });
      }
    }
    nest = nest.filter((i) => i.key >= -15 && i.key <= 15);
    console.log("nn", nest);

    console.log("hist width", width);
    console.log("hist height", height);
    console.log("histogram data", data);
    if (width && data) {
      console.log("running histogram");

      const margin = { top: 20, right: 10, bottom: 20, left: 10 };

      const color = d3.scaleSequential().domain([1, 10]).interpolator(d3.interpolateRdYlGn);

      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(nest, function (d) {
            return d.value;
          }),
        ])
        .nice()
        .range([height - margin.bottom, margin.top]);

      const x = d3
        .scaleBand()
        .range([margin.left, width - margin.right])
        .padding(0.1)
        .domain(
          nest.map(function (d) {
            return d.key;
          })
        );
      console.log("y scale", y);
      const colorScheme = d3.scaleSequential().domain([-10, 10]).interpolator(d3.interpolateRdYlGn);

      const dAxes = { x: "Time →", y: "↑ Document Tone" };

      const yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(d3.axisLeft(y))
          .call((g) => g.select(".domain").remove());

      const xAxis = (g) =>
        g
          .attr("transform", `translate(0,${height - margin.bottom + 2})`)
          .call(
            d3.axisBottom(x).tickFormat((interval, i) => {
              return i % 3 !== 0 ? " " : interval;
            })
          )
          .call((g) => g.select(".domain").remove());

      const svg = d3
        .select("div#tone-histogram-container")
        .selectAll("svg")
        .data([data])
        .enter()
        .append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr("viewBox", [0, 0, width, height])
        .classed("svg-content", true);

      svg.append("g").call(xAxis);

      // svg.append("g").call(yAxis);

      svg
        .selectAll(".bar")
        .data(nest)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return x(d.key);
        })
        .attr("width", x.bandwidth())
        .attr("fill", function (d) {
          return colorScheme(+d.key);
        })
        .attr("y", function (d) {
          return y(d.value);
        })
        .attr("height", function (d) {
          return height - margin.bottom - y(d.value);
        });

      return () => {
        console.log("cleanup histogram");
        d3.select("div#tone-histogram-container").selectAll("svg").remove();
      };
    }
  }, [width, dataParam, topicFilter]);

  return <div id="tone-histogram-container" className="" ref={ref}></div>;
};
