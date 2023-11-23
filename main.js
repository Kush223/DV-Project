document.addEventListener('DOMContentLoaded', function () { 
    Promise.all([d3.csv('heatmap_data.csv')])
    .then(function (values) {
        data=values[0]
        console.log(data);
        const margin = { top: 50, right: 50, bottom: 50, left: 80 };
        const width = 800 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;

        const svg = d3.select("#heatmap")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        const g=svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

        mxt= d3.max(data,(d)=>{
            return d.num_transactions
        })
        var x = d3.scaleBand()
        .range([ 0, width ])
        .domain(["2014-01-06","2014-01-07","2014-01-08","2014-01-09","2014-01-10","2014-01-11","2014-01-12",
        "2014-01-13","2014-01-14","2014-01-15","2014-01-16","2014-01-17","2014-01-18","2014-01-19"])
        //   .padding(0.01);
        var y = d3.scaleBand()
        .range([ 0,height ])
        .domain(['Abila Zacharo', 'Ahaggo Museum', "Albert's Fine Clothing",
        'Bean There Done That', "Brew've Been Served", 'Brewed Awakenings',
        'Chostus Hotel', 'Coffee Cameleon', 'Coffee Shack',
        'Desafio Golf Course', "Frank's Fuel", "Frydos Autosupply n' More",
        'Gelatogalore', 'General Grocer', "Guy's Gyros",
        'Hallowed Grounds', 'Hippokampos', "Jack's Magical Beans",
        'Kalami Kafenion', 'Katerina’s Café', 'Kronos Mart',
        "Octavio's Office Supplies", 'Ouzeri Elian', 'Roberts and Sons',
        "Shoppers' Delight", 'U-Pump'])
        // .padding(0.01);
        const color = d3.scaleLinear()
        .range(["white", "red"])
        .domain([0, mxt]);

        g.selectAll(".cell")
        .data(data)
        .enter().append("rect")
        .attr("x", d => x(d.timestamp))
        .attr("y", d => y(d.location))
        .attr("width", width/14)
        .attr("height", height/26)
        .style("fill", d => color(d.num_transactions))
        .attr("class", "cell")
        .on("click", function (event, d) {
            console.log(d)
            make_pie()
        });

        const xAxis = d3.axisBottom().scale(d3.scaleBand().domain(["2014-01-06","2014-01-07","2014-01-08","2014-01-09","2014-01-10","2014-01-11","2014-01-12",
        "2014-01-13","2014-01-14","2014-01-15","2014-01-16","2014-01-17","2014-01-18","2014-01-19"]).range([0, width]));
        
        const xAxisGroup=g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);
        xAxisGroup.selectAll("text").style("font-size", "6px")

        const yAxis = d3.axisLeft().scale(d3.scaleBand().domain(['Abila Zacharo', 'Ahaggo Museum', "Albert's Fine Clothing",
        'Bean There Done That', "Brew've Been Served", 'Brewed Awakenings',
        'Chostus Hotel', 'Coffee Cameleon', 'Coffee Shack',
        'Desafio Golf Course', "Frank's Fuel", "Frydos Autosupply n' More",
        'Gelatogalore', 'General Grocer', "Guy's Gyros",
        'Hallowed Grounds', 'Hippokampos', "Jack's Magical Beans",
        'Kalami Kafenion', 'Katerina’s Café', 'Kronos Mart',
        "Octavio's Office Supplies", 'Ouzeri Elian', 'Roberts and Sons',
        "Shoppers' Delight", 'U-Pump']).range([0, height]));
        
        let yAxisGroup=g.append("g")
        .call(yAxis);
        yAxisGroup.selectAll("text").style("font-size", "6px")
    })
    
})

function make_pie(){
    d3.csv('piechart_data.csv').then(function (data) {
        // Nest data by CurrentEmploymentType and calculate the sum of prices
        const nestedData = d3.nest()
            .key(d => d.CurrentEmploymentType)
            .rollup(group => d3.sum(group, d => +d.price)) // Convert to a number
            .entries(data);
    
        // Process the nested data
        const processedData = nestedData.map(d => ({
            type: d.key,
            totalAmount: d.value,
        }));
    
        // Set up the pie chart dimensions
        const width = 700;
        const height = 300;
        const radius = Math.min(width, height) / 2;
    
        // Set up colors for the pie chart
        const color = d3.scaleOrdinal()
            .domain(processedData.map(d => d.type))
            .range(['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF5733', '#8E44AD']); // Add more colors as needed
    
        // Create an SVG element
        const svg = d3.select('#employeePieChart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2},${height / 2})`);
    
        // Generate the pie chart
        const pie = d3.pie().value(d => d.totalAmount);
        const path = d3.arc().outerRadius(radius).innerRadius(0);
    
        const arcs = svg.selectAll('arc')
            .data(pie(processedData))
            .enter()
            .append('g');
    
        arcs.append('path')
            .attr('d', path)
            .attr('fill', d => color(d.data.type));
    
        // Add a legend with some separation
        const legend = svg.selectAll('.legend')
            .data(processedData.map(d => d.type))
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', (d, i) => `translate(-${width / 2 + 10},${i * 25 - height / 2 + 10})`);
    
        legend.append('rect')
            .attr('width', 18)
            .attr('height', 18)
            .style('fill', color);
    
        legend.append('text')
            .attr('x', 24)
            .attr('y', 9)
            .attr('dy', '.35em')
            .style('text-anchor', 'start')
            .text(d => d);
    });
}