//line graph

d3.queue()
        // .defer(d3.csv, "data/state_production_new.csv")
        .defer(d3.csv, "Resources/beers-cleaned.csv")
        .await(graph)

function graph(error, datapoints){
    
    console.log(datapoints)

    var StyleTypes = d3.map(datapoints, function(d){return(d.style_id)}).keys()
      console.log(StyleTypes)

    var style_count = d3.nest()
      .key(function(d) {
        return d.style_id;
    })
      .rollup(function(leaves) {
        return leaves.length;
        })
      .entries(datapoints);

    stylesOrdered = style_count.sort((b,a)=>d3.descending(a.value, b.value)).slice(style_count.length-20).sort((a,b)=>d3.descending(a.value, b.value))

    console.log(stylesOrdered)
    var style_names=[]
    stylesOrdered.forEach(function(d){

        d3.csv("Resources/styles.csv", function(data){
            data.forEach(function(item){
                if(d.key==item.id){
                    style_names.push(item.style_name)
                console.log(d.key)
                console.log(item.id)
                console.log(item.style_name)
                } else{}
                
            })
            
        });
        
    })

    console.log(style_names)

    var svgWidth = 1100,
    svgHeight = 600;

    // Define the chart's margins as an object
    var margin = {
    top: 50,
    right: 100,
    bottom: 200,
    left: 100
    };

    // Define dimensions of the chart area
    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    var lineSvg = d3.select("#bargraph")
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


    

    // var LineOne=
    //     datapoints.filter(function(d){
    //       if((d.state===allGroup[0]) && (d.type===ProductionTypes[0]))
    //       {
    //           return d;
    //       }

    //     });

    // var LineTwo=
    //     datapoints.filter(function(d){
    //       if((d.state===allGroup[0]) && (d.type===ProductionTypes[1]))
    //       {
    //           return d;
    //       }

    //     });

    // var LineThree=
    //     datapoints.filter(function(d){
    //       if((d.state===allGroup[0]) && (d.type===ProductionTypes[2]))
    //       {
    //           return d;
    //       }

    //     });

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

    // // Configure a drawLine function which will use our scales to plot the line's points
    // var drawLine = d3
    // .line()
    // .x(data => xTimeScale(data.year))
    // .y(data => yLinearScale(data.barrels));

    // var line1 = chartGroup
    //   .append("path")
    //     .datum(LineOne)
    //     .attr("d", drawLine(LineOne))
    //     .attr("stroke", "green")
    //     .style("stroke-width", 4)
    //     .style("fill", "none")

    // var line2 = chartGroup
    //     .append("path")
    //       .datum(LineTwo)
    //       .attr("d", drawLine(LineTwo))
    //       .attr("stroke", "blue")
    //       .style("stroke-width", 4)
    //       .style("fill", "none")

    // var line3 = chartGroup
    // .append("path")
    //   .datum(LineThree)
    //   .attr("d", drawLine(LineThree))
    //   .attr("stroke", "red")
    //   .style("stroke-width", 4)
    //   .style("fill", "none")

    // var yAxis = chartGroup.append('g').call(leftAxis)

    // var xAxis = chartGroup.append('g')
    // .attr("transform", "translate(0, " + chartHeight + ")")
    // .call(bottomAxis);

    // lineSvg.append("text")
    //     .attr("text-anchor", "middle")
    //     .attr("x", svgWidth/2)
    //     .attr("y", chartHeight + margin.top + 50)
    //     .text("Years");

    // lineSvg.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", 15)
    //     .attr("x", 0 - (chartHeight / 2))
    //     .attr("dy", "1em")
    //     .style("text-anchor", "middle")
    //     .text("Production (Barrels)");   

    // //add a legend
    // var ordinal = d3.scaleOrdinal()
    // .domain(ProductionTypes)
    // .range(["green","blue","red"]);


    // lineSvg.append("g")
    // .attr("class", "legendOrdinal")
    // .attr("transform", `translate(${margin.left},${chartHeight+(margin.bottom/2)})`);

    // var legendOrdinal = d3.legendColor()
    // .shape("path", d3.symbol().type(d3.symbolSquare).size(150)())
    // .shapePadding(10)
    // .scale(ordinal);

    // lineSvg.select(".legendOrdinal")
    // .call(legendOrdinal);

    // //function to update chart based on new selection

    // function updateChart(stateSelection){

    //     var yLinearScaleUpdate = d3.scaleLinear()
    //           .range([chartHeight, 0])
    //           .domain([0, d3.max(datapoints.filter(function(d){return d.state==stateSelection}), data => data.barrels)]);

    //     var leftAxisUpdate = d3.axisLeft(yLinearScaleUpdate);

    //     yAxis.transition().duration(500).call(leftAxisUpdate);

    //     var drawLine = d3
    //         .line()
    //         .x(data => xTimeScale(data.year))
    //         .y(data => yLinearScaleUpdate(data.barrels));

    //     var newData1 = datapoints.filter(function(d){
    //         if((d.state===stateSelection) && (d.type===ProductionTypes[0]))
    //         {
    //             return d;
    //         }
    //         });
    //     var newData2 = datapoints.filter(function(d){
    //         if((d.state===stateSelection) && (d.type===ProductionTypes[1]))
    //         {
    //             return d;
    //         }
    //         });
    //     var newData3 = datapoints.filter(function(d){
    //         if((d.state===stateSelection) && (d.type===ProductionTypes[2]))
    //         {
    //             return d;
    //         }
    //         });

    //     line1
    //       .datum(newData1)
    //       .transition()
    //       .duration(1000)
    //       .attr("d", drawLine(newData1))
    //       .attr("stroke", "green")

    //     line2
    //         .datum(newData2)
    //         .transition()
    //         .duration(1000)
    //         .attr("d", drawLine(newData2))
    //         .attr("stroke", "blue")

    //     line3
    //           .datum(newData3)
    //           .transition()
    //           .duration(1000)
    //           .attr("d", drawLine(newData3))
    //           .attr("stroke", "red")



    // };

    // d3.select("#selectButton").on("change", function(d) {
    //     // recover the option that has been chosen
    //     var selectedOption = d3.select(this).property("value")
    //     // run the updateChart function with this selected option
    //     updateChart(selectedOption)
    // })

};
