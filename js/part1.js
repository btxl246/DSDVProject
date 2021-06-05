// set the dimensions and margins of the graph
var margin = {top: 500, right: 20, bottom: 30, left: 40},
    width = 2700 - margin.left - margin.right,
    height = 1700 - margin.top - margin.bottom;

// set the ranges
var xValue = function(d) { return d.year;},
    xScale = d3.scaleLinear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d));},
    xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("04d"));

var yValue = function(d) { return + (d.count);}, // data -> value
    yScale = d3.scaleLinear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d));}; 
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform","translate(" + margin.left + "," + margin.top + ")");
var chart = svg.append("g")
 .attr("id", "chart");

// add the tooltip area to the webpage
var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")

// setup fill color
var cValue = function(d) { return d.PID;},
    color =   d3.scaleOrdinal() //96 HANG MUC
    .domain(["AFF","AR","ARSR","ARLR","AS","ASSR","ASLR", "AD","ADBW","ADC","ASD","BMP","BP","C","CBW","CCL","CD","CDBW","CDCL","D","DD","DCM","DCMF","DCP","DCMSS","DDP","EE","FE","FLF","IFF","MOS","MOSG","MS","MSC","MSDP","MSDCP","MSMP","MS","MSSO","MSMA","MOMS","MSOP","MOSMP","MSMPO","MODS","MSAOSS","MSOSA","MOSS","MOSSA","MOSSAS","MOMCS","MAS","MU","MUH","OMP","OP","OPT","PDD","S","SSC","SSCT","SSCM","SSO","SST","SSN","SSLA","SR","SE","SEE","SVE","SEF","SED","SM","SFDLA","SFLA","SFA","UAP","VE","W","WA","WMPS","WTW","WOS","WOSP","WOMPS","WSP","WSSP","WSPBM","WSSPDS","WSSPNP","WSSBFM","WASP","WSPAOM","WSPDSBF","WSPDS","WSPBMP"])
    .range(["#0048BA","#7CB9E8","#E52B50","#B284BE","#72A0C1","#EDEAE0","#C0E8D5","#B0BF1A","#C46210","#EFDECD",
	    "#9F2B68","#F19CBB","#D3212D","#3B7A57","#FFBF00","#FF7E00","#EFBBCC","#A4C639","#CD9575","#665D1E",
	    "#915C83","#841B2D","#FAEBD7","#008000","#8DB600","#FBCEB1","#00FFFF","#D0FF14","#4B5320","#7FFFD4",
	    "#8F9779","#E23D28","#B2BEB5","#87A96B","#FF9966","#A52A2A","#89CFF0","#F4C2C2","#FAE7B5","#DA1884",
	    "#7C0A02","#848482","#BCD4E6","#9F8170","#2E5894","#9C2542","#FFE4C4","#3D2B1F","#967117","#FE6F5E",
	    "#BF4F51","#3D0C02","#54626F","#BFAFB2","#FFEBCD","#318CE7","#660000","#0000FF","#0D98BA","#A57164",
	    "#1F75FE","#A2A2D0","#6699CC","#79443B","#126180","#D891EF","#C32148","#FB607F","#FF55A3","#8A2BE2",
	    "#0093AF","#064E40","#0087BD","#7BB661","#CC5500","#006A4E","#66FF00","#5F9EA0","#0018A8","#FFAA1D",
	    "#A9B2C3","#F88379","#A7D8DE","#666699"])

    

// convert data
var rowConverter = function(d) {
                  return { 
                  year: parseInt(d.year_ceremony),
                  cere: parseInt(d.ceremony),
                  year_film: d.year_film,
                  ctg: d.category,
                  name: d.name,
                  film: d.film,
                  win: d.winner,
                  count: parseInt(d.count),
                  PID: d.Prize_id
                  };
            }
 
// load data
d3.csv("https://raw.githubusercontent.com/ITDSIU19008/oscars_data/main/oscars_data.csv", rowConverter, function(error, data) {
    if (error) {
	  console.log(error);
    } else { 
       /*var st = d3.nest()
  .key(function(d) {
    return d.PID;
  })
  .key(function(d) {
    return d.year;
  })
  .map(data);
         console.log(st);*/
	console.log(data); 
      var min = d3.min(data, function(d) {
        return d.year; 
      })
      var max = d3.max(data, function(d) {
        return d.year;
      })
      var ticks = [];
      for(i = min; i<max; i++){
        ticks.push(i);
      }
      
  // Scale the range of the data in the domains 
  xScale.domain([min,max]);
  xAxis.tickValues(ticks);
  yScale.domain([0, 185]);
      
 
 // Add the X Axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll(".tick text")
      .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", 40)
      .style("text-anchor", "end")
      .text("Year");

  // Add the Y Axis
  svg.append("g")
      .attr("class", "y axis")

   // Highlight the specie that is hovered
  var highlight = function(d){ 

    d3.selectAll(".dot").style("opacity", 0.5)
      .transition()
      .duration(300)
      .style("fill", "lightgrey")
      //.attr("r", 3)

    d3.selectAll("." + d.PID).style("opacity", 1)
      .transition()
      .duration(300)
      .style("fill", function(d) {
            if (d.win == "TRUE") {return "gold"}
            else 	 { return color(cValue(d));}})
      .attr("r", 5)
  }

  // Highlight the specie that is hovered
  var doNotHighlight = function(){
    d3.selectAll(".dot").style("opacity", 1)
      .transition()
      .duration(300)
      .style("fill", function(d) { return color(cValue(d));}) 
      .attr("r", 3.5 )
  }
      
  // Add the scatterplot
  var myCircle = svg.selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("r", 3)
      .attr("class", function (d) { return "dot  " + d.PID } )
      .attr("cx", xMap)
      .attr("cy", yMap)
      
      .style("fill", function(d) { return color(cValue(d));}) 
      .on("mouseover", highlight)
      .on("mouseleave", doNotHighlight) 
      .on("mousemove", function(d) {
       tooltip.transition(0)
      .duration(300)
      .style("text-anchor", "end")
      .style("opacity", 100)
      
      d3.select(this).attr("r", 10)
      tooltip.html("Information: " + "<br/> +Film: "+ d.film + "<br/> +Production year:" + d.year_film + "<br/> +"+d.ctg +": " + d.name + "<br/> +Winner: " +d.win)
      .style("left", (d3.event.pageX + 25) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
      })
      
      .on("mouseout", function(d) {
          tooltip .transition()
                  .duration(300)
                  .style("opacity", 0)
        d3.select(this).attr("r", 5);
        
      });
  
   // Add one dot in the legend for each name. 
        
        var size = 450
        var allgroups = ["AFF","AR","ARSR","ARLR","AS","ASSR","ASLR", "AD","ADBW","ADC","ASD","BMP","BP","C","CBW","CCL","CD","CDBW","CDCL","D","DD","DCM","DCMF","DCP","DCMSS","DDP","EE","FE","FLF","IFF","MOS","MOSG","MS","MSC","MSDP","MSDCP","MSMP","MS","MSSO","MSMA","MOMS","MSOP","MOSMP","MSMPO","MODS","MSAOSS","MSOSA","MOSS","MOSSA","MOSSAS","MOMCS","MAS","MU","MUH","OMP","OP","OPT","PDD","S","SSC","SSCT","SSCM","SSO","SST","SSN","SSLA","SR","SE","SEE","SVE","SEF","SED","SM","SFDLA","SFLA","SFA","UAP","VE","W","WA","WMPS","WTW","WOS","WOSP","WOMPS","WSP","WSSP","WSPBM","WSSPDS","WSSPNP","WSSBFM","WASP","WSPAOM","WSPDSBF","WSPDS","WSPBMP"]
        var allnames =["ANIMATED FEATURE FILM",
                       "ACTOR",
                       "ACTOR IN A SUPPORTING ROLE",
                       "ACTOR IN A LEADING ROLE",
                       "ACTRESS","ACTRESS IN A SUPPORTING ROLE",
                       "ACTRESS IN A LEADING ROLE", "ART DIRECTION",
                       "ART DIRECTION (Black-and-White)",
                       "ART DIRECTION (Color)",
                       "ASSISTANT DIRECTOR",
                       "BEST MOTION PICTURE",
                       "BEST PICTURE","CINEMATOGRAPHY",
                       "CINEMATOGRAPHY (Black-and-White)",
                       "CINEMATOGRAPHY (Color)",
                       "COSTUME DESIGN",
                       "COSTUME DESIGN (Black-and-White)",
                       "COSTUME DESIGN (Color)",
                       "DIRECTING",
                       "DANCE DIRECTION",
                       "DOCUMENTARY",
                       "DOCUMENTARY (Feature)",
                       "DIRECTING (Comedy Picture)",
                       "DOCUMENTARY (Short Subject)",
                       "DDP","ENGINEERING EFFECTS",
                       "FILM EDITING",
                       "FOREIGN LANGUAGE FILM",
                       "INTERNATIONAL FEATURE FILM",
                       "MUSIC (Original Score)",
                       "MUSIC (Original Song)",
                       "MUSIC (Song)",
                       "MUSIC (Scoring)",
                       "MUSIC (Music Score of a Dramatic Picture)",
                       "MUSIC (Music Score of a Dramatic or Comedy Picture)",
                       "MUSIC (Scoring of a Musical Picture)",
                       "MS",
                       "MUSIC (Music Score--substantially original)",
                       "MUSIC (Scoring of Music--adaptation or treatment)",
                       "MUSIC (Original Music Score)",
                       "MUSIC (Song--Original for the Picture)",
                       "MUSIC (Original Score--for a motion picture [not a musical])",
                       "MUSIC (Score of a Musical Picture--original or adaptation)",
                       "MUSIC (Original Dramatic Score)",
                       "MUSIC (Scoring: Adaptation and Original Song Score)",
                       "MUSIC (Scoring: Original Song Score and Adaptation -or- Scoring: Adaptation)",
                       "MUSIC (Original Song Score)",
                       "MUSIC (Original Song Score and Its Adaptation or Adaptation Score)",
                       "MUSIC (Original Song Score or Adaptation Score)",
                       "MUSIC (Original Musical or Comedy Score)",
                       "MUSIC (Adaptation Score)",
                       "MAKEUP","MAKEUP AND HAIRSTYLING",
                       "OUTSTANDING MOTION PICTURE",
                       "OUTSTANDING PICTURE","OUTSTANDING PRODUCTION",
                       "PRODUCTION DESIGN",
                       "SOUND","SHORT SUBJECT (Color)",
                       "SHORT SUBJECT (Cartoon)",
                       "SHORT SUBJECT (Comedy)",
                       "SHORT SUBJECT (One-reel)",
                       "SHORT SUBJECT (Two-reel)",
                       "SHORT SUBJECT (Novelty)",
                       "SHORT SUBJECT (Live Action)",
                       "SOUND RECORDING",
                       "SPECIAL EFFECTS",
                       "SOUND EFFECTS EDITINGE",
                       "SPECIAL VISUAL EFFECTS",
                       "SOUND EFFECTS",
                       "SOUND EDITING","SOUND MIXING", 
                       "SHORT FILM (Dramatic Live Action)",
                       "SHORT FILM (Live Action)",
                       "SHORT FILM (Animated)",
                       "UNIQUE AND ARTISTIC PICTURE",
                       "VISUAL EFFECTS",
                       "WRITING","WRITING (Adaptation)",
                       "WRITING (Motion Picture Story)",
                       "WRITING (Title Writing)",
                       "WRITING (Original Story)",
                       "WRITING (Original Screenplay)",
                       "WRITING (Original Motion Picture Story)",
                       "WRITING (Screenplay)",
                       "WRITING (Story and Screenplay)",
                       "WRITING (Screenplay--based on material from another medium)",
                       "WRITING (Story and Screenplay--written directly for the screen)",
                       "WRITING (Story and Screenplay--based on material not previously published or produced)",
                       "WRITING (Story and Screenplay--based on factual material or material not previously published or produced)",
                       "WRITING (Screenplay--Adapted)",
                       "WRITING (Screenplay Adapted from Other Material)",
                       "WRITING (Screenplay Written Directly for the Screen--based on factual material or on story material not previously published or produced)",
                       "WRITING (Screenplay Written Directly for the Screen)","WRITING (Screenplay Based on Material Previously Produced or Published)"]
var n = allgroups.length/12; 
var itemWidth = 680; //khoảng cách giữa 4 cột legend
var itemHeight = 18; //khoảng cách giữa mỗi dòng legend
        
var legendGroup = svg.append("g")
   .attr("transform", "translate("+(width-2600)+",-450)"); //chỉnh sửa vị trí all group legend ở đây

var legend = legendGroup.selectAll(".legend")
	.data(allgroups)
	.enter()
	.append("g")
	.attr("transform", function(d,i) { return "translate(" + i%4 * itemWidth + "," + Math.floor(i/4) * itemHeight + ")"; }) //4 là số cột của legend, nếu chỉnh sửa thì sổ phải giống nhau hết  cả 2
	.attr("class","legend");
	
var rects = legend.append('rect') //kích thước mỗi ô legend
	.attr("width",15)
	.attr("height",15)
	.style("fill", function(d){ return color(d)})
      
var text = legend.append('text') //vị trí chú thích chữ
.data(allnames)
.attr("x", 17)
.attr("y",12)
.text(function(d) { return d; });
 
     
      }
});
