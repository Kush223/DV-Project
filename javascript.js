


//Histogram


function Histogram(){

    d3.csv("data/Histogram_data.csv").then(function (data) {
        data.forEach(function (d) {
            d.credit_price = parseFloat(d.credit_price).toFixed(2);
            d.loyalty_price = parseFloat(d.loyalty_price).toFixed(2);
        });

        // Select the SVG element
        var svg = d3.select("#time-series-chart");

        // Define margins
        const margin = { top: 50, right: 150, bottom: 10, left: 120 };

        // Get the width and height of the container
        const width = +svg.style("width").replace("px", "");
        const height = +svg.style("height").replace("px", "");

        // Calculate the inner width and height
        const Innerwidth = width - margin.left - margin.right;
        const Innerheight = height - margin.top - margin.bottom;

        // Create an SVG element
        svg
            .attr("width", Innerwidth)
            .attr("height", Innerheight);

        // Define scales for X and Y axes
        var yScale = d3.scaleBand()
            .domain(data.map(function(d) { return d.FullName; }))
            .range([0, Innerheight])
            .paddingInner(0.9) // Adjust the padding as needed
            .paddingOuter(0.9);

        var barHeight = yScale.bandwidth();

        var maxExpense = d3.max(data, function(d) {
            return Math.max(parseFloat(d.credit_price), parseFloat(d.loyalty_price));
        });

        var xScale = d3.scaleLinear()
            .domain([0, maxExpense + 500])
            .range([0, Innerwidth]);

        // Create X and Y axes
        var xAxis = svg.append("g")
                .attr("transform", `translate(${margin.left},${Innerheight})`)
                .call(d3.axisBottom(xScale)
                    .ticks(5) // Adjust the number of ticks as needed
                    .tickFormat(d3.format(".0f")));

        var yAxis = svg.append("g")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .call(d3.axisLeft(yScale));

        // Add X-axis label
        svg.append("text")
            .attr("transform", `translate(${Innerwidth / 2 + margin.left},${Innerheight + margin.top})`)
            .style("text-anchor", "middle")
            .text("Loyalty/Credit Card Expenditure");

        // Add Y-axis label
        // svg.append("text")
        //     .attr("transform", "rotate(-90)")
        //     .attr("y", margin.left - 80)
        //     .attr("x", 0 - (Innerheight / 2 + margin.top))
        //     .style("text-anchor", "middle")
        //     .text("Employee");

        // Create bars for credit card expenses
        svg.selectAll(".credit-card-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "credit-card-bar")
            .attr("height", barHeight+5)
            .attr("y", function(d) { return yScale(d.FullName) + (yScale.bandwidth() - barHeight) / 2; })
            .attr("x", margin.left) 
            .attr("width", function(d) { return xScale(parseFloat(d.credit_price)); })
            .attr("fill", "black");

        // Create bars for loyalty card expenses
        svg.selectAll(".loyalty-card-bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "loyalty-card-bar")
            .attr("height", barHeight+5)
            .attr("y", function(d) { return yScale(d.FullName) - 7; })
            .attr("x", margin.left) 
            .attr("width", function(d) { return xScale(parseFloat(d.loyalty_price)); })
            .attr("fill", "blue");

       // Legend
       var legendColors = ["black", "blue"];
       var legend = svg.append("g")
           .attr("transform", `translate(${Innerwidth + margin.left + 10},${margin.top})`);

       legend.selectAll(".legend-item")
           .data(["Credit Card", "Loyalty Card"])
           .enter()
           .append("g")
           .attr("class", "legend-item")
           .attr("transform", function (d, i) { return `translate(0, ${i * 20})`; })
           .each(function (d, i) {
               d3.select(this).append("rect")
                   .attr("width", 18)
                   .attr("height", 18)
                   .attr("fill", legendColors[i]);

               d3.select(this).append("text")
                   .attr("x", 25)
                   .attr("y", 9)
                   .attr("dy", ".35em")
                   .style("text-anchor", "start")
                   .text(d);
           });
    });
}



//Timeseries for amount spent


function TimeseriesAmount(employee_name){
    d3.csv("data/Timeseries_data.csv").then(function (data) {

        data.forEach(function (d) {
            d.price = parseFloat(d.price);
        });

        var svg = d3.select("#time-series-chart");


        const width = +svg.style("width").replace("px", "");
        const height = +svg.style("height").replace("px", "");

        const margin = { top: 60, right: 20, bottom: 35, left: 120 };

        const Innerwidth = width - margin.left - margin.right;
        const Innerheight = height - margin.top - margin.bottom;

        svg
            .attr("width", Innerwidth)
            .attr("height", Innerheight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        

        data = data.filter(d => d.FullName === employee_name);

        



        const aggregatedData = new Map();

        //  // Aggregate data
        data.forEach(d => {
            const key = `${d.FullName}-${d.day}`;
            if (!aggregatedData.has(key)) {
            aggregatedData.set(key, {
                employee: d.FullName,
                location: d.location,
                day: d.day,
                totalSpending: d.price,
                frequency: 1
            });
            } else {
            const existingData = aggregatedData.get(key);
            existingData.totalSpending += d.price;
            existingData.frequency +=1 ;
            }
        });

        const aggregatedArray = Array.from(aggregatedData.values()).map(d => {
            d.totalSpending = parseFloat(d.totalSpending.toFixed(2));
            return d;
        });





  

        aggregatedArray.forEach(d => {
                d.totalSpending = +d.totalSpending;
            });


        console.log(aggregatedArray);
  


        // Set the domains of the scales
        const xScale = d3.scalePoint()
        .domain(aggregatedArray.map(d => d.day))
        .range([0,Innerwidth])
        .padding(0.5);

const yScale = d3.scaleLinear()
 .domain([0, d3.max(aggregatedArray, d => d.totalSpending)+10])
 .range([Innerheight,0]);

// Set up the line generator
const line = d3.line()
 .x(d => xScale(d.day))
 .y(d => yScale(d.totalSpending));

// Draw the x-axis
svg.append("g")
 .attr("transform", `translate(${margin.left},${Innerheight})`)
 .call(d3.axisBottom(xScale));

// Draw the y-axis
svg.append("g")
.attr("transform", `translate(${margin.left}, 0)`)
 .call(d3.axisLeft(yScale));

svg.append("text")
 .attr("x", Innerwidth / 2 + margin.left)  // Centered on the x-axis
 .attr("y", Innerheight + margin.top) // Positioned below the x-axis
 .style("text-anchor", "middle")
 .text("Timestamp");

// Add y-axis label
svg.append("text")
 .attr("transform", "rotate(-90)")
 .attr("x", -Innerheight / 2 - margin.top) // Centered on the y-axis
 .attr("y", margin.left-50) // Positioned to the left of the y-axis
 .style("text-anchor", "middle")
 .text("Total Spending");

// Draw the line
svg.append("path")
 .datum(aggregatedArray)
 .attr("fill", "none")
 .attr("stroke", "steelblue")
 .attr("stroke-width", 2)
 .attr("transform", `translate(${margin.left}, 0)`) 
 .attr("d", line);


    })
}
var employee = 'Adra Nubarron';





//for frequency

function TimeseriesFrequency(employee_name){
    d3.csv("data/Timeseries_data.csv").then(function (data) {

        data.forEach(function (d) {
            d.price = parseFloat(d.price);
        });

        var svg = d3.select("#time-series-chart");


        const width = +svg.style("width").replace("px", "");
        const height = +svg.style("height").replace("px", "");

        const margin = { top: 60, right: 20, bottom: 35, left: 120 };

        const Innerwidth = width - margin.left - margin.right;
        const Innerheight = height - margin.top - margin.bottom;

        svg
            .attr("width", Innerwidth)
            .attr("height", Innerheight)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        

        data = data.filter(d => d.FullName === employee_name);

        
        const aggregatedData = new Map();

        //  // Aggregate data
        data.forEach(d => {
            const key = `${d.FullName}-${d.day}`;
            if (!aggregatedData.has(key)) {
            aggregatedData.set(key, {
                employee: d.FullName,
                location: d.location,
                day: d.day,
                totalSpending: d.price,
                frequency: 1
            });
            } else {
            const existingData = aggregatedData.get(key);
            existingData.totalSpending += d.price;
            existingData.frequency +=1 ;
            }
        });

        const aggregatedArray = Array.from(aggregatedData.values()).map(d => {
            d.totalSpending = parseFloat(d.totalSpending.toFixed(2));
            return d;
        });





  

        aggregatedArray.forEach(d => {
                d.totalSpending = +d.totalSpending;
            });


        console.log(aggregatedArray);
  


        // Set the domains of the scales
        const xScale = d3.scalePoint()
        .domain(aggregatedArray.map(d => d.day))
        .range([0,Innerwidth])
        .padding(0.5);

        const yScale = d3.scaleLinear()
        .domain([0, d3.max(aggregatedArray, d => d.frequency)+2])
        .range([Innerheight,0]);

        // Set up the line generator
        const line = d3.line()
        .x(d => xScale(d.day))
        .y(d => yScale(d.frequency));

        // Draw the x-axis
        svg.append("g")
        .attr("transform", `translate(${margin.left},${Innerheight})`)
        .call(d3.axisBottom(xScale));

        // Draw the y-axis
        svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(yScale));

        svg.append("text")
        .attr("x", Innerwidth / 2 + margin.left)  // Centered on the x-axis
        .attr("y", Innerheight + margin.top) // Positioned below the x-axis
        .style("text-anchor", "middle")
        .text("Timestamp");

        // Add y-axis label
        svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -Innerheight / 2 - margin.top) // Centered on the y-axis
        .attr("y", margin.left-50) // Positioned to the left of the y-axis
        .style("text-anchor", "middle")
        .text("Frequency");

        // Draw the line
        svg.append("path")
        .datum(aggregatedArray)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("transform", `translate(${margin.left}, 0)`) 
        .attr("d", line);


})
}











