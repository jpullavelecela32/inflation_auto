

// set the dimensions and margins of the graph
const margin = {top: 10, right: 100, bottom: 30, left: 30},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform",`translate(${margin.left},${margin.top})`);

//Read the data
d3.csv("https://raw.githubusercontent.com/jpullavelecela32/inflation_auto/main/myData.csv").then(function(data) {

    // List of groups (here I have one group per column)
    const allGroup = ["Used Cars", "New Cars", "Hourly earnings","Household Income"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    const dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {time: d.DATE, value: +d[grpName]};
        })
      };
    });
    // I strongly advise to have a look to dataReady with
     console.log(dataReady)

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

      const y = d3.scaleLinear()
      .domain( [-0.1,0.6])
      .range([height, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    const x = d3.scaleLinear()
      .domain([0,10])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${y(0)})`)
     .call(d3.axisBottom(x));

    // Add Y axis
   

    // Add the lines
    const line = d3.line()
    .x(d => x(+d.time))
    .y(d => y(+d.value))
    svg.selectAll("myLines")
      .data(dataReady)
      .join("path")

      .attr("d", d => line(d.values))
      .attr("stroke", d => myColor(d.name))
      .style("stroke-width", 4)
      .style("fill", "none")

    // Add the points
    svg
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .join('g')
      .style("fill", d => myColor(d.name))
    // Second we need to enter in the 'values' part of this group
    .selectAll("myPoints")
    .data(d => d.values)
    .join("circle")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d.value))
      .attr("r", 5)
      .attr("stroke", "white")

    // Add a legend at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .join('g')
      .append("text")
        .datum(d => { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
        .attr("transform",d => `translate(${x(d.value.time)},${y(d.value.value)})`) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text(d => d.name)
        .style("fill", d => myColor(d.name))
        .style("font-size", 15)

})


