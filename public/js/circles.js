var width = 800;
var height = 800;
var svg;
var defs;

const radius = Math.min(width, height)/2;
const theta = 2* Math.PI/180;
const color = d3.scaleOrdinal(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#BB8FCE","#5DADE2","#2ECC71"]);


var radiusScale = d3.scaleSqrt().domain([1,100]).range([5,radius/20]);
var distanceScale = d3.scaleLinear().domain([1,100]).range([radius/5,radius-40]);


var socket = io.connect('http://localhost:3000');



function init(){

    svg = d3.select("#chart")
            .append("svg")
            .attr("height", height)
            .attr("width", width)
            .append("g")
            .attr("transform", "translate("+width/2+","+height/2+")")

    defs = svg.append("defs");
}

function display(){
    
    d3.queue()
        .defer(d3.csv, "../data/sales.csv")
        .await(ready)
        
    function ready (error, datapoints){

        g = svg.append("g");
 
        var existingData = [];
        var pie = d3.pie()
            .sort(null)
            .value(function(d){
                var val = Math.floor(d.numhacks/2);
                if(existingData.includes(val)){
                    return;
                }else{
                    existingData.push(val);
                    return val;
                }
               
            });
        
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
            .style("fill","white")
            .style("stroke", function(d){
                return color(Math.floor(d.data.numhacks/2));
            })
            .style("stroke-width", "4px")
            .style("opacity",0.7);

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
            .attr('cx',function (d) { return distanceScale((100-d.interest)*Math.cos((d.numhacks)*360/8*theta));})
            .attr('cy',function (d) { return distanceScale((100-d.interest)*Math.sin((d.numhacks)*360/8*theta));})
            .attr('r', function (d) { return radiusScale(d.skills);})
            .attr("fill", function(d){
              return "url(#"+d.name+")";  
            })
            .on('click',function(d){
                console.log(d);
            })

        //filter

         var filter = defs.append("filter")
            .attr("id","glow");

            filter.append("feGaussianBlur")
                .attr("class", "blur")
                .attr("stdDeviation","10")
                .attr("result","coloredBlur");

            var feMerge = filter.append("feMerge");
            feMerge.append("feMergeNode")
                .attr("in","coloredBlur");
            feMerge.append("feMergeNode")
                .attr("in","SourceGraphic");

             d3.selectAll(".arc")
                .style("filter","url(#glow)");  

    }

}

