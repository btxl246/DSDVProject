var margin = {top: 20, right: 30, bottom: 50, left: 50},
    width = 2700 - margin.left - margin.right,
    height = 1300 - margin.top - margin.bottom;

// setup x 
var xValue = function(d) { return d.year;}, // data -> value
    xScale = d3.scale.ordinal().rangePoints([0, width]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

// setup y
var yValue = function(d) { return + (d.count);}, // data -> value
    yScale = d3.scale.linear().range([height, 0]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.cere;},
    color = d3.scale.category20();

// add the graph canvas to the body of the webpage
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var chart = svg.append("g")
 .attr("id", "chart");


// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
     
/*var parseDate = d3.time.format("%Y").parse;
var dateFormat = d3.time.format("%Y");*/
var rowConverter = function(d) {
                return { 
                  year: parseInt(d.year_ceremony),
                  cere: parseInt(d.ceremony),
                  year_film: d.year_film,
                  ctg: d.category,
                  name: d.name,
                  film: d.film,
                  win: d.winner,
                  count: parseInt(d.count)
                  };
            }
 // load data
    d3.csv("https://raw.githubusercontent.com/ITDSIU19008/oscars_data/main/oscars_data.csv", rowConverter, function(error, data) {
    if (error) {
	  console.log(error);
    } else {
	console.log(data); 


  // don't want dots overlapping axis, so add in buffer to data domain
/*yScale.domain([d3.min(data, yValue)-0, d3.max(data, yValue)+2]);*/

xScale.domain(data.map(d => d.year));
yScale.domain([0, 185]);


  // x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Year");

  // y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 5)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(" ");

  /*// draw dots
  var groups = svg.selectAll(".groups")
 .data(data)
 .enter()
 .append("g")
 .attr("transform", function(d) {
    return "translate(" + xScale(d.film) + ".0)";
 });*/
      
 
     
  // draw dots
  var myCircle = svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3)
      .attr("cx", xMap)
      .attr("cy", yMap)
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", function(d) {
        
          tooltip.transition()
      .duration(200)
       
      .style("text-anchor", "end")
      .style("opacity", 100) 
        d3.select(this).attr({
              fill: "orange",
              r:  10});
    
          tooltip.html("Information: " + "<br/> +Film: "+ d.film + "<br/> +Production year:" + d.year_film + "<br/> +"+d.ctg +": " + d.name + "<br/> +Win/Lost: " +d.win)
               .style("left", (d3.event.pageX + 25) + "px")
               .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
               .duration(500)
               .style("opacity", 0)
        d3.select(this).attr({
              fill: "black",
              r: 3
            });
        
      });
      

  
      
      }
});
