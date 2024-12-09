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
        // Highlight curved-paths associated with this arc
        svg.selectAll(".curvedpath")
            .transition()
            .duration(200)
            .attr("opacity", curvedPathD =>
            curvedPathD.source.index === d.index || curvedPathD.target.index === d.index ? 1 : 0.1
            );
      })
      .on("mouseout", () => {
        svg.selectAll(".curvedpath")
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
        // Highlight curved-paths associated with this arc
        svg.selectAll(".curvedpath")
            .transition()
            .duration(200)
            .attr("opacity", curvedPathD =>
            curvedPathD.source.index === d.index || curvedPathD.target.index === d.index ? 1 : 0.1
            );
      })
      .on("mouseout", () => {
        svg.selectAll(".curvedpath")
          .transition()
          .duration(200)
          .attr("opacity", 0.7);
    
        svg.selectAll(".arc")
          .transition()
          .duration(200)
          .attr("opacity", 1);
      });

    
    const dynamicBlue = darkMode ? "#498df3" : "#024ebf";
    const dynamicRed = darkMode ? "#f74d4d" : "#ad0000";
    const dynamicNeutral = darkMode ? "#261a25" : "#ede1ec";
    // FOR RIBBON DIAGRAM
    const colourScale = d3.scaleLinear()
    .domain([-0.75, -0.2, 0.2, 0.75]) // Negative, zero, positive correlation
    .range([dynamicRed, dynamicNeutral, dynamicNeutral, dynamicBlue])
    .interpolate(d3.interpolateRgb);

    // FOR NON-RIBBON DIAGRAM
    // const colourScale = d3.scaleLinear()
    // .domain([-1, 0, 1]) // Negative, neutral, positive correlation
    // .range([dynamicRed, dynamicNeutral, dynamicBlue]); // Red, white, blue




    // svg.append("g")
    //   .attr("fill-opacity", 0.7)
    //   .selectAll("path")
    //   .data(chords)
    //   .join("path")
    //   .attr("class", "ribbon")
    //   .attr("fill", d => colourScale(corrMatrix[d.source.index][d.target.index])) 
    //   .attr("stroke", d => colourScale(corrMatrix[d.source.index][d.target.index]))
    //   .attr("d", ribbon)
    //   .on("mouseover", (event, d) => {
    //     svg.selectAll(".ribbon")
    //       .transition()
    //       .duration(200)
    //       .attr("opacity", ribbonD => ribbonD === d ? 1 : 0.1);
    
    //     svg.selectAll(".arc")
    //       .transition()
    //       .duration(200)
    //       .attr("opacity", arcD =>
    //         arcD.index === d.source.index || arcD.index === d.target.index ? 1 : 0.1
    //       );
    //   })
    //   .on("mouseout", () => {
    //     svg.selectAll(".ribbon")
    //       .transition()
    //       .duration(200)
    //       .attr("opacity", 0.7);
    
    //     svg.selectAll(".arc")
    //       .transition()
    //       .duration(200)
    //       .attr("opacity", 1);
    //   });

    function getArcPosition(index) {
      const angle = (chords.groups[index].startAngle + chords.groups[index].endAngle) / 2;
      const x = Math.cos(angle - Math.PI / 2) * innerRadius;
      const y = Math.sin(angle - Math.PI / 2) * innerRadius;
      return { x, y };
    }

    const strokeWidthScale = d3.scalePow()
      .exponent(2.75) // Squaring makes stronger correlations much thicker
      .domain([0, 1]) // Input range: correlation values
      .range([0.4, 10]); // Output range: thickness (adjust these values as needed)

    
    // svg.append("g")
    //   .selectAll("line")
    //   .data(chords)
    //   .join("line")
    //   .attr("class", "edge")
    //   .attr("x1", d => getArcPosition(d.source.index).x)
    //   .attr("y1", d => getArcPosition(d.source.index).y)
    //   .attr("x2", d => getArcPosition(d.target.index).x)
    //   .attr("y2", d => getArcPosition(d.target.index).y)
    //   .attr("stroke-width", d => 
    //     strokeWidthScale(Math.abs(corrMatrix[d.source.index][d.target.index]))
    //   )
    //   .attr("stroke", d => colourScale(corrMatrix[d.source.index][d.target.index])) // Color by correlation
    //   .attr("opacity", 0.7)
    //   .on("mouseover", (event, d) => {
    //     // Highlight only the hovered line
    //     svg.selectAll(".edge")
    //       .transition()
    //       .duration(200)
    //       .attr("opacity", lineD => (lineD === d ? 1 : 0.1));
    //   })
    //   .on("mouseout", () => {
    //     svg.selectAll(".edge")
    //       .transition()
    //       .duration(200)
    //       .attr("opacity", 0.7);
    //   });

      svg.append("g")
      .selectAll("path")
      .data(chords)
      .join("path")
      .attr("class", "curvedpath")
      .attr("d", d => {
        const source = getArcPosition(d.source.index);
        const target = getArcPosition(d.target.index);
        const tightness = 0.85;  // Adjust to tweak curve tightness

        const controlPoint1 = {
          x: source.x * tightness, 
          y: source.y * tightness
        };
        const controlPoint2 = {
          x: target.x * tightness,
          y: target.y * tightness
        };

        return `M${source.x},${source.y} C${controlPoint1.x},${controlPoint1.y} ${controlPoint2.x},${controlPoint2.y} ${target.x},${target.y}`;
      })
      .attr("stroke-width", d => strokeWidthScale(Math.abs(corrMatrix[d.source.index][d.target.index])))
      .attr("stroke", d => colourScale(corrMatrix[d.source.index][d.target.index]))
      .attr("fill", "none")
      .attr("opacity", 0.7)
      .on("mouseover", (event, d) => {
        svg.selectAll("path")
          .transition()
          .duration(200)
          .attr("opacity", pathD => (pathD === d ? 1 : 0.1));
      })
      .on("mouseout", () => {
        svg.selectAll("path")
          .transition()
          .duration(200)
          .attr("opacity", 0.7);
      });




  }, [corrMatrix, labels, darkMode]);

  return (
    <svg ref={ref} style={{ width: "700px", height: "700px" }} />
  );
};

export default ChordDiagram;
