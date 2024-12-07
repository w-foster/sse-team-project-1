import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ChordDiagram = ({ corrMatrix, labels, darkMode, idToNameMap }) => {
  const ref = useRef(null);

  useEffect(() => {
    // Clear previous drawing if any
    d3.select(ref.current).selectAll("*").remove();

    const width = 700;
    const height = 700;
    const outerRadius = Math.min(width, height) * 0.5 - 40;
    const innerRadius = outerRadius - 20;

    const svg = d3.select(ref.current)
      .attr("viewBox", [-width / 2, -height / 2, width, height]);

    // Convert to absolute values for thickness
    const matrix = corrMatrix.map(row => row.map(d => Math.abs(d)));

    // Layout for chords
    const chord = d3.chord()
      .padAngle(0.04)
      .sortSubgroups(d3.descending);

    const chords = chord(matrix);
    

    // Arcs for items
    const arc = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(innerRadius + 10);

    // Ribbons for connections
    const ribbon = d3.ribbon()
      .radius(innerRadius);

    // Simple color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add item arcs
    const group = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .selectAll("g")
      .data(chords.groups)
      .join("g");
      

    group.append("path")
      .attr("d", arc)
      .attr("class", "arc")
      .attr("fill", '#75587a')
      .attr("stroke", "#75587a")
      .on("mouseover", (event, d) => {
        console.log("MOUSEOVER PATH");
        // Highlight ribbons associated with this arc
        svg.selectAll(".ribbon")
            .transition()
            .duration(200)
            .attr("opacity", ribbonD =>
            ribbonD.source.index === d.index || ribbonD.target.index === d.index ? 1 : 0.1
            );
      })
      .on("mouseout", () => {
        svg.selectAll(".ribbon")
          .transition()
          .duration(200)
          .attr("opacity", 0.7);
    
        svg.selectAll(".arc")
          .transition()
          .duration(200)
          .attr("opacity", 1);
      });


    group.append("text")
      .each(d => { d.angle = (d.startAngle + d.endAngle) / 2; })
      .attr("dy", "0.35em")
      .attr("transform", d => `
        rotate(${(d.angle * 180 / Math.PI - 90)})
        translate(${innerRadius + 15})
        ${d.angle > Math.PI ? "rotate(180)" : ""}
      `)
      .attr("text-anchor", d => d.angle > Math.PI ? "end" : "start")
      .attr('fill', () => {
        return darkMode ? '#fff' : '#000'
      })
      .text(d => idToNameMap.get(Number(labels[d.index])))
      .on("mouseover", (event, d) => {
        console.log("MOUSEOVER PATH");
        // Highlight ribbons associated with this arc
        svg.selectAll(".ribbon")
            .transition()
            .duration(200)
            .attr("opacity", ribbonD =>
            ribbonD.source.index === d.index || ribbonD.target.index === d.index ? 1 : 0.1
            );
      })
      .on("mouseout", () => {
        svg.selectAll(".ribbon")
          .transition()
          .duration(200)
          .attr("opacity", 0.7);
    
        svg.selectAll(".arc")
          .transition()
          .duration(200)
          .attr("opacity", 1);
      });

    // Add the chords (the connections)
    // const colourScale = d3.scaleDiverging(d3.interpolateRdBu)
    // .domain([-1, 0, 1]);

    const colourScale = d3.scaleLinear()
    .domain([-0.75, -0.2, 0.2, 0.75]) // Negative, zero, positive correlation
    .range(["#ad0000", "#ede1ec", "#ede1ec", "#024ebf"])
    .interpolate(d3.interpolateRgb);

    // const colourScale = d3.scaleLinear()
    // .domain([-1,1])
    // .range(["coral","steelblue"]);



    svg.append("g")
      .attr("fill-opacity", 0.7)
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("class", "ribbon")
      .attr("fill", d => colourScale(corrMatrix[d.source.index][d.target.index])) 
      .attr("stroke", d => colourScale(corrMatrix[d.source.index][d.target.index]))
      .attr("d", ribbon)
      .on("mouseover", (event, d) => {
        svg.selectAll(".ribbon")
          .transition()
          .duration(200)
          .attr("opacity", ribbonD => ribbonD === d ? 1 : 0.1);
    
        svg.selectAll(".arc")
          .transition()
          .duration(200)
          .attr("opacity", arcD =>
            arcD.index === d.source.index || arcD.index === d.target.index ? 1 : 0.1
          );
      })
      .on("mouseout", () => {
        svg.selectAll(".ribbon")
          .transition()
          .duration(200)
          .attr("opacity", 0.7);
    
        svg.selectAll(".arc")
          .transition()
          .duration(200)
          .attr("opacity", 1);
      });


  }, [corrMatrix, labels, darkMode]);

  return (
    <svg ref={ref} style={{ width: "700px", height: "700px" }} />
  );
};

export default ChordDiagram;
