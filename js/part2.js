function createForm(data){
    var body = document.body;

    var div = document.createElement("div")
    div.id ="searchbar";
    body.appendChild(div);
    var label = document.createElement("label");
    label.id = "yearSelLb";
    label.textContent = "Select a year: ";
    div.appendChild(label);

    var form = document.createElement("select");
    form.id="yearSel";
    div.appendChild(form);
    label.setAttribute("for", "yearSel");
    var select = document.getElementById("yearSel");

    var optDef = document.createElement("option");
    optDef.text = "-Year-";
    optDef.value = null;
    select.add(optDef);
    for(var i = 0;i<data.length;i++){
        var opt = document.createElement("option");
        opt.text = data[i].toString();
        opt.value = data[i];
        select.add(opt);
    }

    var but =document.createElement("button");
    but.id="searchBut";
    but.className = "button";
    but.textContent = "Search";
    but.addEventListener("click", update);
    div.appendChild(but);
}

function getYearlist(){
    var yearList = Array();
    d3.csv("https://raw.githubusercontent.com/Pdq1227/Data_DSDV/main/data.csv", function (data) {
        for(var i=0;i<data.length;i++){
            if(i==0){
                yearList.push(data[i]['year_ceremony']);
            } else {
                if(yearList[yearList.length - 1] == data[i]['year_ceremony']){
                } else {
                    yearList.push(data[i]['year_ceremony']);
                }
            }
        }
        createForm(yearList);
    });
}

getYearlist()

function update(){
    var oldChart = document.getElementById("visual")
    if(oldChart != null){
        oldChart.remove();
        draw();
    } else {
        draw();
    }
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function draw(){
    sel_year = document.getElementById("yearSel").value;
    d3.csv("https://raw.githubusercontent.com/Pdq1227/Data_DSDV/main/data.csv", function(data){
        data_filtered = data.filter(function (d){return ((d['year_ceremony'] == sel_year) && (d['winner'] == "TRUE"));});
        fName = Array();
        fCount = Array();
        fCat = Array();
        for(var i=0;i<data_filtered.length;i++){
            fName.push(data_filtered[i]['film']);
        }
        fName = fName.filter(onlyUnique)
        for(var i=0;i<fName.length;i++){
            fCount[fName[i]] = 0
            fCat[fName[i]] = Array()
            data_fName = data.filter(function (d){return ((d['year_ceremony'] == sel_year) && (d['film'] == fName[i]));})
            fCat[fName[i]].push(data_fName.map(function (d){return d['category'];}));
            fCount[fName[i]] +=  fCat[fName[i]][0].length;
        }
        fCount = fCount.sort();

        // set the dimensions and margins of the graph
        var width = 500
        height = 500
        margin = 30

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = Math.min(width, height) / 2 - margin

        var body = document.body;
        var div = document.createElement("div")
        div.id = "visual";
        body.appendChild(div);

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select("#visual")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/2+ "," + height / 2 + ")");

        // set the color scale
        var color = d3.scaleOrdinal()
        .domain(fCount.sort())
        .range(["#408f90","#3a8182","#337273","#2d6465","#265656","	#204848","#1a393a","#132b2b","#0d1d1d"])

        // Compute the position of each group on the pie:
        var pie = d3.pie()
        .value(function(d) {return d.value; })
        var data_ready = pie(d3.entries(fCount))

        //add tooltip
        var div = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

        // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
        svg
        .selectAll("pie")
        .data(data_ready)
        .enter()
        .append("path")
        .attr("d", d3.arc()
        .innerRadius(100)
        .outerRadius(radius)
        )
        .attr("fill", function(d){ return(color(d.data.key)) })
        .attr("stroke", "white")
        .style("stroke-width", "3px")
        .style("opacity", 0.7)
            
        .on("mouseover", function (d){
            d3.select(this).transition().duration(150).attr("d", d3.arc().innerRadius(100).outerRadius(radius + 30));
            div.transition().duration(150).style("opacity",1);
            div.html(d.value)
            .style("left", d3.event.pageX + 10 + "px")
            .style("top", d3.event.pageY - 15 + "px");
        })
        .on("mouseout", function(d){
            d3.select(this).transition().duration(150).attr("d", d3.arc().innerRadius(100).outerRadius(radius));
            div.transition().duration(150).style("opacity",0);
        });
    })
}

/*
div.tooltip {
  position: fixed;
  text-align: center;
  color: black;
  font-family: "Segoe UI";
  font-weight: bolder;
  border: 0px;
  pointer-events: none;
  font-size: 20px;
}
*/