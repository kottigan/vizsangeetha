var timeseries, sdat, series,aminVal=0, minVal = 0,amaxVal=2, maxVal = 2,minIndex=0,maxIndex=7,maxele=5, radius, radiusLength;
var w = 160, h = 160,pxsize="4px",axis = 8, time = 1, ruleColor = '#CCC';
var map_num_swara={0:"b",0.5:"ls",1:"lr",1.5:"lg",2:"lm",2.5:"lp",3:"ld",3.5:"ln",4:"s",4.5:"r",5:"g",5.5:"m",6:"p",6.5:"d",7:"n",7.5
:"hs",8:"hr",8.5:"hg",9:"hm",9.5:"hp",10:"hd",10.5:"hn"};
var map_color = {0:"White",0.5:"DarkRed",1:"OrangeRed",1.5:"Gold",2:"DarkGreen",2.5:"DarkBlue",3:"SaddleBrown",3.5:"DeepPink",4:"FireBrick",4.5:"DarkSalmon",5:"Orange",5.5:"Green",6:"Blue",6.5:"Chocolate",7:"HotPink",7.5:"Tomato",8:"Salmon",8.5:"Yellow",9:"LawnGreen",9.5:"DodgerBlue",10:"Peru",10.5:"LightPink"};
var map_value = {"b":0,"ls":0.5,"lr":1,"lg":1.5,"lm":2,"lp":2.5,"ld":3,"ln":3.5,"s":4,"r":4.5,"g":5,"m":5.5,"p":6,"d":6.5,"n":7,"hs":7.5,"hr":8,"hg":8.5,"hm":9,"hp":9.5,"hd":10,"hn":10.5 };
var items = ["0","0.5","1","1.5","2","2.5","3","3.5","4","4.5","5","5.5","6","6.5","7","7.5","8","8.5","9","9.5","10","10.5"];
var tswara=["b","ls","lr","lg","lm","lp","ld","ln","s","r","g","m","p","d","n","hs","hr","hg","hm","hp","hd","hn"];
keys = [];
var swara_list=[];
var swara_value_list=[];;
var vizPadding = {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
};
var numticks = (maxVal -minVal)/ 0.5;
var viz, vizBody, maxs, keys;

var setsize = function() {
  w=document.getElementById("size").value;
  h=w;
  if(h > 160 && h < 250)
    pxsize="6px";
  else if ( h >= 250 && h < 400)
    pxsize="10px";
  else if ( h >= 400)
    pxsize="14px";
}
var validcheck = function() {
  //return 0;
 var swaratemp = document.getElementById("swaras").value;
 var swara = (swaratemp.toLowerCase()).trim();
 var re = /\s+/; // one or more white space
 swara_list=swara.split(re);

   if(swara_list.length > axis)
 {

  alert("swaras are more");
  document.getElementById("swaras").value="";
  return -1;
 }
 else if (swara_list.length < axis)
 {
  alert("swaras are less")
  document.getElementById("swaras").value="";
  return -1;

 }

 //console.log(tswara.indexOf(swara_list[0])); 
 for(var i =0 ;i<swara_list.length;i++)
 {
if(swara_list[i]== "b")
  continue;
if(tswara.indexOf(swara_list[i]) == -1 || map_value[swara_list[i]] < aminVal || map_value[swara_list[i]] > amaxVal)
{
  alert("wrong swaras");
  return -1;
 }
} //end of for
return 0;
} // end of function

var loadswara = function() {
 //console.log(swara_list);
  //return 0;
  for(var i =0 ;i<swara_list.length;i++)
 {
  //index = map_value.indexOf(swara_list[i]);
  //console.log(index);
  swara_value_list[i]=map_value[swara_list[i]];
 } //end for
 //console.log(swara_value_list);
 return 0;
}

var checkViz = function(){
 axis = document.getElementById("axis").value;

 
 keys = [];

  for(var i=0;i<axis;i++)
  {
    keys[i]=i+1;

  }
 aminVal = document.getElementById("fromswara").value;
 amaxVal =document.getElementById("toswara").value;
 minVal=0;
 maxVal=parseFloat(amaxVal)-parseFloat(aminVal)+0.5;
 maxele=maxVal*2;
 minIndex=document.getElementById("fromswara").selectedIndex;
 maxIndex=document.getElementById("toswara").selectedIndex;
numticks = maxVal / 0.5;


var check =-1;
check=validcheck();

 if(aminVal < amaxVal && check == 0)
 {
  setsize();
  loadswara();
  loadViz();
 }
}

var loadViz = function(){
  loadData();
  buildBase();
  setScales();
  drawBars(0);
  addLineAxes();
  addCircleAxes();
  //console.log(map_num_swara[0]);
};

var loadData = function(){
    var randomFromTo = function randomFromTo(from, to){
      //return(0.5*Math.floor(Math.random() * (to - from) + from));
      return (0.5*Math.floor(Math.random()*maxele));
      //var item =items[Math.floor(Math.random() * (to - from +1) + from )]
      //return item;
      //var item = items[Math.floor(Math.random()*items.length)];
       //return Math.random() * (to - from) + from;
       //console.log(item);
    };
    var inputdata = function (i){
      if(swara_value_list[i] == 0)
        return 0;
      return swara_value_list[i]- aminVal+0.5;
    }

    timeseries = [];
    sdat = [];
    //keys = ["1", "2", "3", "4", "5", "6", "7", "8"];

    for (j = 0; j < time; j++) {
        series = [[]];
        for (i = 0; i < axis; i++) {
            //series[0][i] = randomFromTo(minIndex,maxIndex);
            series[0][i] = inputdata(i);
        }
        // This fills in the line 
/*        for (i = 0; i < series.length; i += 1) {
            series[i].push(series[i][0]);
        }
*/        
        for (i=0; i<=numticks; i++) {
            sdat[i] = (maxVal/numticks) * i;

        }
        
        timeseries[j] = series;
        
    }
    //console.log(timeseries[0][0]);
};

var buildBase = function(){
    viz = d3.select("#radial")
                .append('svg:svg')
                    .attr('width', w)
                    .attr('height', h);

    viz.append("svg:rect")
            .attr('x', 0)
            .attr('y', 0)
            .attr('height', 0)
            .attr('width', 0)
            .attr('height', 0);
    
    vizBody = viz.append("svg:g")
        .attr('id', 'body');
};

setScales = function () {
  var heightCircleConstraint,
      widthCircleConstraint,
      circleConstraint,
      centerXPos,
      centerYPos;

  //need a circle so find constraining dimension
  heightCircleConstraint = h - vizPadding.top - vizPadding.bottom;
  widthCircleConstraint = w - vizPadding.left - vizPadding.right;
  circleConstraint = d3.min([heightCircleConstraint, widthCircleConstraint]);

  radius = d3.scale.linear().domain([0, maxVal])
      .range([0, (circleConstraint / 2)]);
  radiusLength = radius(maxVal);

  //attach everything to the group that is centered around middle
  centerXPos = widthCircleConstraint / 2 + vizPadding.left;
  centerYPos = heightCircleConstraint / 2 + vizPadding.top;

  vizBody.attr("transform", "translate(" + centerXPos + ", " + centerYPos + ")");
};

addCircleAxes = function() {
    var radialTicks = radius.ticks(numticks), circleAxes, i;
        
    vizBody.selectAll('.circle-ticks').remove();
        
    circleAxes = vizBody.selectAll('.circle-ticks')
      .data(sdat)
      .enter().append('svg:g')
      .attr("class", "circle-ticks");

    circleAxes.append("svg:circle")
      .attr("r", function (d, i) { return radius(d); })
      .attr("class", "circle")
      .style("stroke", ruleColor)
      .style("opacity", 0.9)
      .style("fill", "none");

    circleAxes.append("svg:text")
      .attr("text-anchor", "right")
      .attr("font-size",pxsize)
      .attr("dy", function (d) { return -1 * radius(d); })
      .text(function (d,i) { if( i ==0 ) return "";var x = (i-1)*0.5+parseInt(aminVal);return map_num_swara[x]; });

}

addLineAxes = function () {
  var radialTicks = radius.ticks(numticks), lineAxes;

  vizBody.selectAll('.line-ticks').remove();

  lineAxes = vizBody.selectAll('.line-ticks')
      .data(keys)
      .enter().append('svg:g')
      .attr("transform", function (d, i) {
          return "rotate(" + ((i / axis * 360) - 90) +
              ")translate(" + radius(maxVal) + ")";
      })
      .attr("class", "line-ticks");

  lineAxes.append('svg:line')
      .attr("x2", -1 * radius(maxVal))
      .style("stroke", ruleColor)
      .style("opacity", 0.75)
      .style("fill", "none");

  lineAxes.append('svg:text')
      .attr("font-size",pxsize)
      .text(function(d,i){ return keys[i]; })
      .attr("text-anchor", "middle")
//      .attr("transform", function (d, i) {
//          return (i / axis * 360) < 180 ? null : "rotate(90)";
//      });
};

var draw = function (val) {
  var groups,
      lines,
      linesToUpdate;

  groups = vizBody.selectAll('.series')
      .data(timeseries[val]);
  groups.enter().append("svg:g")
      .attr('class', 'series')
      .style('fill', "blue")
      .style('stroke', "blue");
      
  groups.exit().remove();

  lines = groups.append('svg:path')
      .attr("class", "line")
      .attr("id", "userdata")
      .attr("d", d3.svg.area.radial()
          .radius(function (d) { return 0; })
          .angle(function (d, i) { return (i / axis) * 2 * Math.PI; }))
      .style("stroke-width", 3)
      .style("fill", "blue")
      .style("opacity", 0.4);

  lines.attr("d", d3.svg.area.radial()
      .outerRadius(function (d) { return radius(d); })
      .innerRadius(function(d) { return 0; })
      .angle(function (d, i) { return (i / axis) * 2 * Math.PI; }));
};


var drawBars = function(val) {
    var groups, bar;
    pie = d3.layout.pie().value(function(d) { return d; }).sort(null);
    d = [];
    for(i = 0; i<timeseries[val][0].length; i++) { d.push(1); }

    groups = vizBody.selectAll('.series')
        .data([d]);
    groups.enter().append("svg:g")
        .attr('class', 'series')
        .style('fill', "blue")
        .style('stroke', "black");
      
    groups.exit().remove();
    
    bar = d3.svg.arc()
        .innerRadius( 0 )
        .outerRadius( function(d,i) { return radius( timeseries[val][0][i] ); });
        
    arcs = groups.selectAll(".series g.arc")
        .data(pie)
        .enter()
            .append("g")
                .attr("class", "attr");
                
    arcs.append("path")
        .attr("fill", function(d,i){return (map_color[timeseries[val][0][i] + parseInt(aminVal) - 0.5])})
        .attr("d", bar)
        .style("opacity", 0.4);
}

function redraw( val ) {        
    vizBody.selectAll('#userdata').remove();
    drawBar( val );
}