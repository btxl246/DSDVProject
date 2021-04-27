var rowConverter = function(d) {
  return {
     "year_film": parseInt(d["year_film"]),
    film: d.film,
    budget: parseInt(d.budget),
    "opening_gross": parseInt(d["opening_gross"]),
    imdb: parseFloat(d.imdb)
  };
};

d3.csv("https://raw.githubusercontent.com/ITDSIU19008/oscars_data/main/dsdv_temp.csv?fbclid=IwAR3WVLkRMkZq87s7auW7VNpH6FvpeVOmAVsuPVERDjPW12YjBPbHpZFdUp0", rowConverter, function(error, data) {
    if (error) {
	  console.log(error);
    }
    else {
      dataset = data
      console.log(dataset);
        var margin = {top: 20, right: 50, bottom: 30, left: 150},
    w = 800 - margin.left - margin.right,
    h = 1000 - margin.top - margin.bottom;
   
  var xScale = d3.scaleLinear()
  .domain([0, d3.max(dataset, function(d) { return d.budget; })])
          .rangeRound([0, w]);
  var yScale = d3.scaleBand()
  .domain(dataset.map(function(d) { return d.film; }))
          .rangeRound([h, 0])
          .paddingInner(0.1);
  
    var svg = d3.select("body")
    .append("svg")
    .attr("height", h + margin.top + margin.bottom)
    .attr("width", w + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
 var xAxis = d3.axisBottom().scale(xScale).ticks(10);
  var yAxis = d3.axisLeft().scale(yScale);
  
  var bar = svg.selectAll("rect")
      .data(dataset)
    .enter().append("rect")
      .attr("x", xScale(0))
      .attr("width", function(d) {return xScale(d.budget); } )
      .attr("y", function(d) { return yScale(d.film); })
      .attr("height", yScale.bandwidth())
    .attr("fill", "#FA8F5F");
  
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + h + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("y", -10)
    .attr("x", w)
    .attr("dy", ".71em")
    .style("text-anchor", "end");
  
  svg.append("g")
    .attr("class", "axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("x", 0)
    .attr("y", 5)
    .attr("dy", ".71em")
    .style("text-anchor", "end");
 
    }}
           );



