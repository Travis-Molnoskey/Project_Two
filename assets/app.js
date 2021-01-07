
// ----------------------CREATING SVG SIZE & SELECTING CHART---------------------
// Width and height
(function() {
    var width = 1400,
    height = 1000;

 
    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)")

    // Play around with range. Domain is the min and max value
    var radiusScale = d3.scaleSqrt ().domain ([3008.21, 226327173.3]).range([10, 80])

    // The simulation is a collection of forces about where we want our circles to go 
    // and how we want our circles to interact
    // STEP ONE: Get circles to move to the middle
    // STEP tWO: Don't have them collide!

// ---------------------CREATING FUNCTIONS FOR SPLIT/COMBINE/COLLIDE------------
    // Creating a function to move the data points on an if statment
    var forceXSplit = d3.forceX(function(d){
        if(d.type === 'Bottles and Cans') {
            return 400 
        // } else if (d.type === 'Kegs and Barrels') {
        //     return 850 
        } else
            return 1200
    }).strength(0.10)

    var forceXCombine = d3.forceX(width / 2).strength(0.12)


    var forceCollide = d3.forceCollide(function (d){
        return radiusScale (d.production) +1;
    })

    // Color scale for circles
    var myColor = d3.scaleOrdinal()
    .domain(['Bottles and cans', 'Kegs and Barrels', 'On Premises'])
    .range(d3.schemePurples[4]);

// -----------THE INITIAL FORCESIMULATION THAT POPULATE THE PAGE-------------

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
        .defer(d3.csv, "Resources/state_production_cleaned.csv")
        .await(ready)

// ------ CREATING CIRCLES & APPENDING DATA ----------------
    function ready (error, datapoints){

        var circles =svg.selectAll(".state")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "state")
            .attr("r", function (d){
                return radiusScale (d.production)
            })
            .style("fill", function (d) { return myColor(d.type); 
            })
            .on("mouseover", function(){ return tooltip.style("visibility", "visible");})
            .on("mouseover", function(){ return tooltip.style("top",
                (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
            // .on("mouseout", function (){return tooltip.style("visibility", "hidden");})
            // .on("mouseover", function (d) { return tooltip.text(d.state + ": " + format(d.production));})
            .on('click', function(d){
                console.log(d)
            })
           
        // d3.selectAll("svg")
        //     .append("svg.circle")
        //     .on("mouseover", function(){ return tooltip.style("visibilitty", "visible");})
        //     .on("mouseover", function(){ return tooltip.style("top",
        //         (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})

// --------- SELECTING BUTTONS + CREATING FORCE(ALPHA) SIMLUATION -------------

        // alpha target/restart help the force "wake up"
        // Play around with alpha target values
        d3.select("#type").on('click', function (){
            simulation
                .force("x", forceXSplit)
                .alphaTarget(0.1)
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

// --------  CREATING TOOLTIP INFO FOR MOUSE OVER EFFECTS ----------------------

    // tooltip for mouse over
    var tooltip = d3.select("#chart")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    // .style("visibilty", "hidden")
    .style("visibility", "visibile")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("sample text");



    // Creating legend
    var ordinal = d3.scaleOrdinal()
        .domain(["Bottles & Cans", "Kegs & Barrles", "On Premises"])
        .range([ "rgb(106, 81, 163)", "rgb(203, 201, 226)", "rgb(158, 154, 200)", "rgb(223, 199, 31)", "rgb(234, 118, 47)"]);

    var svg = d3.select("svg");

    svg.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", "translate(12,50)");

    var legendOrdinal = d3.legendColor ()
    .shape("path", d3.symbol().type(d3.symbolCircle).size(250)())
    .shapePadding(10)
    .cellFilter(function(d){ return d.label !== "e" })
    .scale(ordinal);

    svg.select(".legendOrdinal")
        .call(legendOrdinal);
})();
