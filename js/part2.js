function createForm(data) {
  var body = document.body;

  var div = document.createElement("div");
  div.id = "searchbar";
  body.appendChild(div);

  var label = document.createElement("label");
  label.id = "yearSelLb";
  label.textContent = "Select a year: ";
  div.appendChild(label);

  var form = document.createElement("select");
  form.id = "yearSel";
  div.appendChild(form);
  label.setAttribute("for", "yearSel");
  var select = document.getElementById("yearSel");

  var optDef = document.createElement("option");
  optDef.text = "-Year-";
  optDef.value = null;
  select.add(optDef);
  for (var i = 0; i < data.length; i++) {
    var opt = document.createElement("option");
    opt.text = data[i].toString();
    opt.value = data[i];
    select.add(opt);
  }

  var but = document.createElement("button");
  but.id = "searchBut";
  but.className = "button";
  but.textContent = "Search";
  but.addEventListener("click", update);
  div.appendChild(but);
}

function getYearlist() {
  var yearList = Array();
  d3.csv(
    "https://raw.githubusercontent.com/Pdq1227/Data_DSDV/main/data.csv",
    function (data) {
      for (var i = 0; i < data.length; i++) {
        if (i == 0) {
          yearList.push(data[i]["year_ceremony"]);
        } else {
          if (yearList[yearList.length - 1] == data[i]["year_ceremony"]) {
          } else {
            yearList.push(data[i]["year_ceremony"]);
          }
        }
      }
      createForm(yearList);
    }
  );
}

getYearlist();

function update() {
  var oldChart = document.getElementById("visual");
  if (oldChart != null) {
    oldChart.remove();
    drawChart();
  } else {
    drawChart();
  }
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}

function sortVals(obj) {
  var keys = Object.keys(obj);
  keys.sort(function (a, b) {
    return obj[b] - obj[a];
  });
  obj_sorted = {};
  for (var i = 0; i < keys.length; i++) {
    var count = obj[keys[i]];
    var fname = keys[i];
    obj_sorted[i] = Array();
    obj_sorted[i].push(fname);
    obj_sorted[i].push(count);
  }
  return obj_sorted;
}

function drawChart() {
  var fontsize = d3.scaleLinear().domain([7, 27]).range([-2.5, 2]);
  console.clear();
  sel_year = document.getElementById("yearSel").value;
  d3.csv(
    "https://raw.githubusercontent.com/Pdq1227/Data_DSDV/main/data.csv",
    function (data) {
      // Create partial data for creating chart
      data_filtered = data.filter(function (d) {
        return d["year_ceremony"] == sel_year && d["winner"] == "TRUE";
      });
      fFilm = [];
      for (var i = 0; i < data_filtered.length; i++) {
        fFilm.push(data_filtered[i]["film"]);
      }
      fFilm = fFilm.filter(onlyUnique);

      // Redo process
      obj = {};
      for (var i = 0; i < fFilm.length; i++) {
        obj[fFilm[i]] = 0;
        data_filter_film = data.filter(function (d) {
          return (
            d["year_ceremony"] == sel_year &&
            d["winner"] == "TRUE" &&
            d["film"] == fFilm[i]
          );
        });
        obj[fFilm[i]] += data_filter_film.length;
      }
      obj_sort = sortVals(obj);

      var keys = Object.keys(obj_sort);
      var colorDomain = Array();
      var sum = 0;
      var indexStop = 0;

      for (var i = 0; i < keys.length; i++) {
        colorDomain.push(obj_sort[keys[i]][0]);
      }
      for (var i = 0; i < keys.length; i++) {
        sum += obj_sort[keys[i]][1];
      }
      draw = Array();
      for (var i = 0; i < sum; i++) {
        draw[i] = Array();
      }
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var filmname = obj_sort[key][0];
        var length = obj_sort[key][1];
        for (var j = 0; j < length; j++) {
          draw[indexStop + j].push(filmname);
          data_filter_film = data.filter(function (d) {
            return (
              d["year_ceremony"] == sel_year &&
              d["winner"] == "TRUE" &&
              d["film"] == filmname
            );
          });
          draw[indexStop + j].push(data_filter_film[j]["category"]);
          draw[indexStop + j].push(data_filter_film[j]["name"]);
          draw[indexStop + j].push(length);
        }
        indexStop += length;
      }

      // set the dimensions and margins of the graph
      var width = 1800;
      var height = 900;
      var margin = 20;

      var radius = Math.min(900, 900) / 2 - margin;
      //console.log(radius);

      // Setting up color scheme
      var color = d3
        .scaleOrdinal()
        .domain(colorDomain)
        .range([
          "#488f31",
          "#6b9c39",
          "#8ba944",
          "#a9b552",
          "#c7c261",
          "#e3cf73",
          "#fbc373",
          "#f7aa63",
          "#f19058",
          "#ea7652",
          "#e05b50",
        ]);

      var body = document.body;
      var div = document.createElement("div");
      div.id = "visual";
      body.appendChild(div);

      var svg = d3
        .select("#visual")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var pie1 = d3
        .pie()
        .value(function (d) {
          return d.value[1];
        })
        .sort(null);
      var pie2 = d3
        .pie()
        .value(function (d) {
          return 1;
        })
        .sort(null);
      var data_1 = pie2(d3.entries(draw));
      var data_2 = pie1(d3.entries(obj_sort));
      //console.log(data_1);
      //console.log(data_2);

      // Remove tooltip and remake it (Refresh for year)
      removeElementsByClass("tooltip");
      var tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      // Insert year
      svg
        .append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 45)
        .attr("stroke", "black")
        .attr("stroke-width", "2px")
        .attr("fill", "#ffffff00");

      svg
        .append("text")
        .text(sel_year)
        .attr("text-anchor", "middle")
        .attr("text-align", "left")
        .attr("x", 0)
        .attr("y", 8)
        .style("font-family", "Segoe-UI")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .attr("fill", "black");

      // Arc 1: Category
      var arcGen = d3.arc().innerRadius(60).outerRadius(61);

      svg
        .selectAll("pie")
        .data(data_1)
        .enter()
        .append("path")
        .attr("d", arcGen)
        .attr("fill", "#ffffff00")
        .attr("stroke", "white")
        .style("stroke-width", "4px")
        .style("opacity", 0.7);

      svg
        .selectAll("pie")
        .data(data_1)
        .enter()
        .append("text")
        .attr("dy", "0.31em")
        .text(function (d) {
          return d.data.value[1];
        })
        .style("text-anchor", function (d) {
          return d.endAngle - Math.PI <= 1e-10 ? "start" : "end";
        })
        .style("text-align", "center")
        .attr("transform", function (d) {
          let rotation =
            d.endAngle - Math.PI <= 1e-10
              ? ((d.startAngle / 2 + d.endAngle / 2) * 180) / Math.PI - 90
              : ((d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180) /
                  Math.PI -
                90;
          return (
            "translate(" +
            arcGen.centroid(d)[0] +
            "," +
            arcGen.centroid(d)[1] +
            ") " +
            "rotate(" +
            rotation +
            ")"
          );
        })
        .style("font-size", function (d) {
          return 14 - fontsize(sum);
        })
        .style("font-family", "Segoe-UI")
        .attr("fill", function (d) {
          return color(d.data.value[0]);
        });

      var arcGen2 = d3.arc().innerRadius(45).outerRadius(295);
      svg
        .selectAll("pie")
        .data(data_1)
        .enter()
        .append("path")
        .attr("d", arcGen2)
        .attr("fill", "#ffffff00")
        .attr("stroke", "black")
        .style("stroke-opacity", 0.5)
        .style("stroke-dasharray", "3 6 3 6")
        .style("stroke-width", "2px")
        .style("opacity", 0.5);

      // Arc 2: Winner's name
      var arcGen3 = d3.arc().innerRadius(293).outerRadius(300);

      svg
        .selectAll("pie")
        .data(data_1)
        .enter()
        .append("path")
        .attr("d", arcGen3)
        .attr("fill", function (d) {
          return color(d.data.value[0]);
        })
        .attr("stroke", "white")
        .style("stroke-width", "4px")
        .style("opacity", 1);

      var arcGen4 = d3.arc().innerRadius(305).outerRadius(390);

      svg
        .selectAll("pie")
        .data(data_1)
        .enter()
        .append("path")
        .attr("d", arcGen4)
        .attr("fill", "#ffffff00")
        .attr("stroke", "#ffffff00")
        .style("stroke-width", "3px")
        .style("opacity", 0.7);

      svg
        .selectAll("pie")
        .data(data_1)
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.value[2];
        })
        .attr("transform", function (d) {
          let rotation =
            d.endAngle < Math.PI / 2
              ? ((d.startAngle / 2 + d.endAngle / 2) * 180) / Math.PI
              : ((d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180) /
                  Math.PI +
                180;
          return (
            "translate(" +
            arcGen4.centroid(d)[0] +
            "," +
            arcGen4.centroid(d)[1] +
            ")"
          );
        })
        .style("text-anchor", "middle")
        /*function (d) {
          return d.endAngle - Math.PI <= 1e-10 ? "start" : "end";
        })*/
        .style("font-size", 15)
        .style("font-family", "Segoe-UI")
        .attr("fill", function (d) {
          return color(d.data.value[0]);
        });

      // Arc 3: Film name
      var arcGen5 = d3.arc().innerRadius(410).outerRadius(420);
      svg
        .selectAll("pie")
        .data(data_2)
        .enter()
        .append("path")
        .attr("d", arcGen5)
        .attr("fill", function (d) {
          if (d.data.value[0] == "") {
            return "#ffffff00";
          } else {
            return color(d.data.value[0]);
          }
        })
        .attr("stroke", "white")
        .style("stroke-width", "6px")
        .style("opacity", function (d) {
          if (d.data.value[0] == "") {
            return 0;
          } else {
            return 0.8;
          }
        });

      var arcGen6 = d3
        .arc()
        .innerRadius(418)
        .outerRadius(radius + 20);
      svg
        .selectAll("pie")
        .data(data_2)
        .enter()
        .append("path")
        .attr("d", arcGen6)
        .attr("fill", "#ffffff00")
        .attr("stroke", "#ffffff00")
        .style("stroke-width", "3px")
        .style("opacity", 0.7);

      svg
        .selectAll("pie")
        .data(data_2)
        .enter()
        .append("text")
        .text(function (d) {
          return d.data.value[0];
        })
        .attr("transform", function (d) {
          let rotation =
            d.endAngle <= Math.PI / 2
              ? ((d.startAngle / 2 + d.endAngle / 2) * 180) / Math.PI
              : ((d.startAngle / 2 + d.endAngle / 2 + Math.PI) * 180) /
                  Math.PI +
                180;
          return (
            "translate(" +
            arcGen6.centroid(d)[0] +
            "," +
            arcGen6.centroid(d)[1] +
            ")"
          );
        })
        .style("text-anchor", function (d) {
          return d.endAngle > Math.PI
            ? Math.abs((d.startAngle + d.endAngle) / 2 - Math.PI) <= 1e-10
              ? "middle"
              : "end"
            : "start";
        })
        .style("font-size", 15)
        .style("font-weight", "bold")
        .style("font-family", "Segoe-UI")
        .attr("fill", function (d) {
          if (d.data.key == "") {
            return "#ffffff00";
          } else {
            return color(d.data.value[0]);
          }
        });
    }
  );
}

/*

*/
