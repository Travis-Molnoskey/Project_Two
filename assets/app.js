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
    }).strength(0.10)

    var forceXCombine = d3.forceX(width / 2).strength(0.10)

    var forceCollide = d3.forceCollide(function (d){
        return radiusScale (d.production) +1;
    })


    // Applies force to each circle to get them to move towards the center
    var simulation = d3.forceSimulation ()
        // .force("name", definetheforce)
        // Play around with the strength to find what value will center the circles on the X & Y axis
        // There is a force called forceCenter but there's some issues with it
        .force("x", forceXCombine)
        .force("y", d3.forceY(height/2).strength(0.10))

        // Wokring with the circle collision. 10 bc circle r = 10
            // Later changed to function
        .force("collide", forceCollide)
    
    // This is used in d3.4.2.2. No longer in d3.versions 5 and up
    // d3.queue() is deprecated in v5 use Promises.all
    d3.queue()
        // .defer(d3.csv, "data/state_production_new.csv")
        .defer(d3.csv, "data/state_production_cleaned.csv")
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
                .alphaTarget(0.10)
                .restart()
            console.log("You clicked me")
        })

        d3.select("#combine").on('click', function (){
            simulation
                .force("x", forceXCombine)
                .alphaTarget(0.10)
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
