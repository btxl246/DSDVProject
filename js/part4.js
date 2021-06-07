var rowConverter = function (d) {
  return {
    year_film: parseInt(d["year_film"]),
    film: d.film,
    budget: parseInt(d.budget),
    opening_gross: parseInt(d["opening_gross"]),
    usa_gross: parseInt(d["usa_gross"]),
    ww_gross: parseInt(d["ww_gross"]),
    imdb: parseFloat(d.imdb),
    metacritic: parseInt(d.metacritic),
    rm_critics: parseInt(d["rm_critics"]),
    rm_audience: parseInt(d["rm_audience"])
  };
};

var margin = { top: 40, right: 50, bottom: 80, left: 200 },
  w = 1000 - margin.left - margin.right,
  h = 1000 - margin.top - margin.bottom;

var svg = d3
  .select("body")
  .append("svg")
  .attr("height", h + margin.top + margin.bottom)
  .attr("width", w + margin.left + margin.right)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv(
  "https://raw.githubusercontent.com/waterfairy244/data/main/data.csv",
  rowConverter,
  function (error, data) {
    if (error) {
      console.log(error);
    } else {
      console.log(data);

      var allGroup = d3
        .nest()
        .key(function (d) {
          return d["year_film"];
        })
        .entries(data);

      // Create a dropdown
      var dropdownMenu = d3
        .select("#dropdown")
        .append("select")
        .selectAll("option")
        .data(allGroup)
        .enter()
        .append("option")
        .attr("value", function (d) {
          return d.key;
        })
        .text(function (d) {
          return d.key;
        });

      var formatValue = d3.format(".2s");

      //Create axis
      var x = d3.scaleLinear().rangeRound([0, w]);
      var xAxis = d3.axisTop(x).tickFormat(function (d) {
        return formatValue(d);
      });
      svg
        .append("g")
        .attr("transform", "translate(0," + 0 + ")")
        .call(xAxis)
        .attr("class", "x axis");

      var y = d3.scaleBand().rangeRound([0, h]).paddingInner(0.1);
      var yAxis = d3.axisLeft(y);
      svg.append("g").call(yAxis).attr("class", "y axis");

      //Update chart
      function update(year) {
        // Select new data from the dataset upon select option
        var dataFilter = data.filter(function (d) {
          return d["year_film"] == year;
        });

        //Update axis
        x.domain([
          0,
          d3.max(dataFilter, function (d) {
            return d.budget;
          })
        ]);
        y.domain(
          dataFilter.map(function (d) {
            return d.film;
          })
        );

        svg.select(".x.axis").transition().call(xAxis);

        svg.select(".y.axis").transition().call(yAxis);

        //Create bars
        var bars = svg
          .selectAll("rect")
          .data(dataFilter)
          .enter()
          .append("rect")
          .attr("y", function (d) {
            return y(d.film);
          })
          .attr("width", function (d) {
            return x(d.budget);
          })
          .attr("height", y.bandwidth())
          .attr("fill", "#86B0ED")
          .merge(bars)
          .transition()
          .duration(200)
          .attr("y", function (d) {
            return y(d.film);
          })
          .attr("width", function (d) {
            return x(d.budget);
          })
          .attr("height", y.bandwidth());

        //Exit…
        bars
          .exit()
          .transition()
          .duration(200)
          .attr("y", -y.bandwidth())
          .remove();

        //axis labels
        /* 
        var films = svg.selectAll("text.films")
        .data(dataFilter);
        var provinces = svg.selectAll("text.province")
                               .data(dataset1);

            films.exit()
                    .transition()
                    .duration(500)
                    .attr("y", -y.bandwidth())
                    .remove();

            films.enter()
                .append("text")
                .text(function(d) {
                    return d.film;
                })
                .attr("text-anchor", "middle")
                .attr("x", 45)
                .attr("y",function(d) {
                    return y(d.film) + y.bandwidth() / 2 + 2;
                })
                .attr("font-family", "sans-serif")
                .attr("font-size", "11px")
                .attr("fill", "black")
                .merge(provinces)	//Update…
                .transition()
                .duration(500)
                .ease(d3.easeLinear)
                .attr("x", 45);
        */
      }

      // When the button is changed, run the updateChart function
      dropdownMenu.on("change", function (d) {
        // recover the option that has been chosen
        var selectedYear = d3.select(this).select("select").property("value");
        // run the updateChart function with this selected option
        update(selectedYear);
      });
    }
  }
);
