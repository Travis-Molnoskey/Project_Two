// Width and height
(function() {
    var width = 500,
    height = 500;

 
    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")
    
    d3.queue()
        .defer(d3.csv, "data/beer_states.csv")
        .await(ready)

    function ready (error, datapoints){

        var circles =svg.selectAll(".state")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "state")
            .attr("r", 10)
            .attr("fill", "lightblue")

    }

})();
