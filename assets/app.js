// Width and height
(function() {
    var width = 1600,
    height = 1000;

 
    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    // Play around with range. Domain is the min and max value
    // var radiusScale = d3.scaleSqrt ().domain ([2102840.3, 252300383.8]).range([10, 80])
    var radiusScale = d3.scaleSqrt ().domain ([3008.21, 226327173.3]).range([10, 80])

    // The simulation is a collection of forces about where we want our circles to go 
    // and how we want our circles to interact
    // STEP ONE: Get circles to move to the middle
    // STEP tWO: Don't have them collide!

    // Creating a function to move the data points on an if statment
    var forceXSplit = d3.forceX(function(d){
        if(d.type === 'Bottles and Cans') {
            return 300 
        // } else if (d.type === 'BC') {
        //     return 850 
        } else
            return 1200 
    }).strength(0.25)

    var forceXCombine = d3.forceX(width / 2).strength(0.15)

    var forceCollide = d3.forceCollide(function (d){
        return radiusScale (d.production) +1;
    })


    // Applies force to each circle to get them to move towards the center
    var simulation = d3.forceSimulation ()
        // .force("name", definetheforce)
        // Play around with the strength to find what value will center the circles on the X & Y axis
        // There is a force called forceCenter but there's some issues with it
        .force("x", forceXCombine)
        .force("y", d3.forceY(height/2).strength(0.15))

        // Wokring with the circle collision. 10 bc circle r = 10
            // Later changed to function
        .force("collide", forceCollide)


    // This is used in d3.4.2.2. No longer in d3.versions 5 and up
    // d3.queue() is deprecated in v5 use Promises.all
    d3.queue()
        // .defer(d3.csv, "data/state_production_new.csv")
        .defer(d3.csv, "Resources/state_production_cleaned.csv")
        .await(ready)

    function ready (error, datapoints){

        var circles =svg.selectAll(".state")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "state")
            .attr("r", function (d){
                return radiusScale (d.production)
            })
            .attr("fill", "lightblue")
            .on('click', function(d){
                console.log(d)
            })
            //Poistions circles but we want to be using d3.force!
            // .attr("cx", 100)
            // .attr("cy", 300)

        // alpha target/restart help the force "wake up"
        // Play around with alpha target values
        d3.select("#type").on('click', function (){
            simulation
                .force("x", forceXSplit)
                .alphaTarget(0.15)
                .restart()
            console.log("You clicked me")
        })

        d3.select("#combine").on('click', function (){
            simulation
                .force("x", forceXCombine)
                .alphaTarget(0.15)
                .restart()
            console.log("combined the bubbles")
        })

        // Feeding the simulation all the datapoints "nodes"
        // Every node is a circle
        simulation.nodes(datapoints)
            // Everytime theres a tick, fire the function "ticked" to update circle postioning
            .on('tick', ticked)

        // Function that allows the simluation to "tick" through each node (circle)
        // Auto updates the circles with the new X and Y coordinates with each tick
        function ticked () {
            circles
                .attr("cx", function (d){
                    return d.x
                })
                .attr("cy", function (d){
                    return d.y
                })
        }
        

    }

})();

//line graph

d3.queue()
        // .defer(d3.csv, "data/state_production_new.csv")
        .defer(d3.csv, "Resources/beer_states_production.csv")
        .await(graph)
        
function graph(error, datapoints){
    var states=[]
    console.log(datapoints)
    //get list of unique states
    datapoints.map(d=>d.state)

    

    var svgWidth = 1000,
    svgHeight = 600;

    // Define the chart's margins as an object
    var margin = {
    top: 60,
    right: 60,
    bottom: 60,
    left: 60
    };
  
    // Define dimensions of the chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;
    
    var lineSvg = d3.select("#linegraph")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth)
        .append("g")
        .attr("transform", "translate(0,0)")

    var chartGroup = lineSvg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    datapoints.forEach(function(data) {
        data.year = +data.year;
        data.barrels = +data.barrels;
    });

    var allGroup = d3.map(datapoints, function(d){return(d.state)}).keys()
    console.log(allGroup)

    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });


    var ProductionTypes = d3.map(datapoints, function(d){return(d.type)}).keys()
      console.log(ProductionTypes)

    var LineOne=
        datapoints.filter(function(d){
          if((d.state===allGroup[0]) && (d.type===ProductionTypes[0]))
          {
              return d;
          }
          
        });

    var LineTwo=
        datapoints.filter(function(d){
          if((d.state===allGroup[0]) && (d.type===ProductionTypes[1]))
          {
              return d;
          }
          
        });

    var LineThree=
        datapoints.filter(function(d){
          if((d.state===allGroup[0]) && (d.type===ProductionTypes[2]))
          {
              return d;
          }
          
        });

    console.log(LineOne)
    console.log(LineTwo)
    console.log(LineThree)

    // Configure a time scale with a range between 0 and the chartWidth
    // Set the domain for the xTimeScale function
    // d3.extent returns the an array containing the min and max values for the property specified
    var xTimeScale = d3.scaleTime()
    .range([0, chartWidth])
    .domain(d3.extent(datapoints, data => data.year));

    // Configure a linear scale with a range between the chartHeight and 0
    // Set the domain for the xLinearScale function
    var yLinearScale = d3.scaleLinear()
    .range([chartHeight, 0])
    .domain([0, d3.max(datapoints.filter(function(d){return d.state==allGroup[0]}), data => data.barrels)]);

    // Create two new functions passing the scales in as arguments
    // These will be used to create the chart's axes
    var bottomAxis = d3.axisBottom(xTimeScale).tickFormat(d3.format("d"));
    var leftAxis = d3.axisLeft(yLinearScale);

    // Configure a drawLine function which will use our scales to plot the line's points
    var drawLine = d3
    .line()
    .x(data => xTimeScale(data.year))
    .y(data => yLinearScale(data.barrels));

    var line1 = chartGroup
      .append("path")
        .datum(LineOne)
        .attr("d", drawLine(LineOne))
        .attr("stroke", "green")
        .style("stroke-width", 4)
        .style("fill", "none")

    var line2 = chartGroup
        .append("path")
          .datum(LineTwo)
          .attr("d", drawLine(LineTwo))
          .attr("stroke", "blue")
          .style("stroke-width", 4)
          .style("fill", "none")
          
    var line3 = chartGroup
    .append("path")
      .datum(LineThree)
      .attr("d", drawLine(LineThree))
      .attr("stroke", "red")
      .style("stroke-width", 4)
      .style("fill", "none")

    var yAxis = chartGroup.append('g').call(leftAxis)

    var xAxis = chartGroup.append('g')
    .attr("transform", "translate(0, " + chartHeight + ")")
    .call(bottomAxis);

    function updateChart(stateSelection){

        var yLinearScaleUpdate = d3.scaleLinear()
              .range([chartHeight, 0])
              .domain([0, d3.max(datapoints.filter(function(d){return d.state==stateSelection}), data => data.barrels)]);
        
        var leftAxisUpdate = d3.axisLeft(yLinearScaleUpdate);

        yAxis.transition().duration(500).call(leftAxisUpdate);

        var drawLine = d3
            .line()
            .x(data => xTimeScale(data.year))
            .y(data => yLinearScaleUpdate(data.barrels));
          
        var newData1 = datapoints.filter(function(d){
            if((d.state===stateSelection) && (d.type===ProductionTypes[0]))
            {
                return d;
            }
            });
        var newData2 = datapoints.filter(function(d){
            if((d.state===stateSelection) && (d.type===ProductionTypes[1]))
            {
                return d;
            }
            });
        var newData3 = datapoints.filter(function(d){
            if((d.state===stateSelection) && (d.type===ProductionTypes[2]))
            {
                return d;
            }
            });

        line1
          .datum(newData1)
          .transition()
          .duration(1000)
          .attr("d", drawLine(newData1))
          .attr("stroke", "green")

        line2
            .datum(newData2)
            .transition()
            .duration(1000)
            .attr("d", drawLine(newData2))
            .attr("stroke", "blue")

        line3
              .datum(newData3)
              .transition()
              .duration(1000)
              .attr("d", drawLine(newData3))
              .attr("stroke", "red")

        

    };

    d3.select("#selectButton").on("change", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        updateChart(selectedOption)
    })

};

