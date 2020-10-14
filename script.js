d3.csv('wealth-health-2014.csv', d3.autoType).then(data=>{
  array = data;
  console.log(data);
  const margin = ({top: 20, right: 20, bottom: 20, left: 20})
  const width = 650 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;

  const svg =  d3.select('.chart').append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
  	  .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, function(d) { return d.Income })])
      .range([0,500]);

  const yScale = d3
      .scaleLinear()
      .domain([d3.min(data, function(d) { return d.LifeExpectancy }), d3.max(data, function(d) { return d.LifeExpectancy })])
      .range([660,0]);


  const populationScale = d3
      .scaleLog()
      .domain([d3.min(data, function(d) { return d.Population}), d3.max(data, function(d) {return d.Population})])
      .range([0,width / 35]);



  const xAxis = d3.axisBottom().scale(xScale).ticks(5, "s")
  const yAxis = d3.axisLeft().scale(yScale)


  let colorPalette = d3.scaleOrdinal(d3.schemeTableau10).domain(['Sub-Saharan Africa', 'South Asia',
                            'East Asia & Pacific', 'Middle East & North Africa',
                              'America']);




  // Draw the axis
  svg.append("g")
	.attr("class", "axis x-axis")
	.call(xAxis)
  .attr("transform", `translate(0, ${height})`)

  svg.append("g")
	.attr("class", "axis y-axis")
	.call(yAxis)




  var circles = svg.selectAll('circle')
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d=>xScale(d.Income))
    .attr("cy", d=>yScale(d.LifeExpectancy))
    .attr("r", d=> (d.Population != null) ? (populationScale(d.Population)): 0)
    .style("fill", d=>colorPalette(d.Region))
    .style("stroke", "black")
    .on("mouseover", function(event, d) {
    //Get this circle's x/y values, then augment for the tooltip
    let xPosition = parseFloat(d3.select(this).attr("cx")) + 50;
    let yPosition = parseFloat(d3.select(this).attr("cy"));

    format = d3.format(',');

    //Update the tooltip position and value
    let tooltip = d3.select("#tooltip")
      .style("left", xPosition+ "px")
      .style("top", yPosition + "px")
      .html("Country: " + d.Country +
      '<br>Life Expectancy: '+ d.LifeExpectancy +
      '<br>Income: '+ format(d.Income) +
      '<br>Population: '+ format(d.Population) +
      '<br>Region: '+ d.Region);


    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
  })
  .on("mouseout", function(d) {
    //Hide the tooltip
    d3.select("#tooltip").classed("hidden", true);
  });


    svg.append("text")
    		.attr('x', 450)
    		.attr('y', 650)
    		.text("Income");

    svg.append("text")
        .attr("class", "yaxis label")

    		.attr('x', 0)
    		.attr('y', -10)
        .attr("transform", "rotate(90)")

    		.text("Life Expectancy");



    var legend = svg.selectAll('rect')
      .data(colorPalette.domain())
      .enter()
      .append("rect")
      .attr("x", 370)
      .attr("y", (d,i) => 450 + (i*25))
      .attr("width", 20)
      .attr("height", 20)
      .style('fill', d=> colorPalette(d));

    var text = svg.selectAll('legendtext')
      .data(colorPalette.domain())
      .enter()
      .append("text")
      .attr("x", 400)
      .attr("y", (d,i) => 463 + (i*25))
      .attr("font-size", 12)
      .text(d=>d);


});
