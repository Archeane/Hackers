var width = 500;
var height = 500;
var svg;
var defs;

function init(){

    svg = d3.select("#chart")
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g")
            .attr("transform", "translate(250,250)")

    defs = svg.append("defs");
}
function display(){
    
    //Piechart
    var numhacksRange = [[0,0],[1,4],[5,8],[9,12],[13,18],[19,2^31-1]];
    var radiusScale = d3.scaleSqrt().domain([1,300]).range([10, 80]);
    var theta = 2* Math.PI/180;

    d3.queue()
        .defer(d3.csv, "../data/sales.csv")
        .await(ready)
        
    function ready (error, datapoints){
        var radius = Math.min(width, height)/2;
        var color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#BB8FCE","#5DADE2","#2ECC71"]);
        g = svg.append("g");

        var occurances = [0,0,0,0,0,0];
        for(var i = 0; i < datapoints.length; i++){
                //console.log(datapoints[i]);
            for(var j = 0; j < numhacksRange.length; j++){
                console.log(datapoints[i].numhacks);
                if(datapoints[i].numhacks >= numhacksRange[j][0] && datapoints[i].numhacks <= numhacksRange[j][1]){
                    occurances[j]++;
                }
            }
        }
        console.log(occurances);


        var pie = d3.pie()
            .sort(null)
            .value(occurances);
        
        var path = d3.arc()
            .outerRadius(radius-10)
            .innerRadius(5);   
        
        var label = d3.arc()
            .outerRadius(radius-40)
            .innerRadius(radius-40);

        var arc = g.selectAll(".arc")
            .data(pie(datapoints))    
            .enter().append("g")
                .attr("class","arc");

        arc.append("path")
            .attr("d", path)
            .attr("fill", function(d){
                return color(d.data.numhacks);
            });

        arc.append("text")
            .attr("transform", function(d){ return "translate("+label.centroid(d)+")";})
            .attr("dy", "0.35em")
            .attr(function(d){return d.data.numhacks;})
    

    //Circles
        defs.selectAll(".artist-pattern")
            .data(datapoints)
            .enter().append("pattern")
            .attr("class","atist-pattern")
            .attr("id",function(d){
                return d.name;
            })
            .attr("height", "100%")
            .attr("width", "100%")
            .attr("patternContentUnits","objectBoundingBox")
            .append("image")
            .attr("height",1)
            .attr("width",1)
            .attr("preserveAspectRatio", "none")
            .attr("xmlns:xlink", "http://www.w3.org/1999/xlink")
            .attr("xlink:href", function(d){
                return d.image_path;
            })


        var circles = svg.selectAll(".artists")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "artist")
            .attr('cx',function (d) { return (100-d.interest)*Math.cos((1+d.numhacks)*360/15*theta); })
            .attr('cy',function (d) { return (100-d.interest)*Math.sin((1+d.numhacks)*360/15*theta); })
            .attr('r', function (d) { return radiusScale(d.skills);})
            .attr("fill", function(d){
              return "url(#"+d.name+")";  
            })
            .on('click',function(d){
                console.log(d);
            })
       
        
    }

}