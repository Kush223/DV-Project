document.addEventListener('DOMContentLoaded', function () {
  Promise.all([d3.csv('data/heatmap_data.csv')]).then(function (values) {
    heatmap_data = values[0]
    console.log(heatmap_data)
    const margin = { top: 50, right: 50, bottom: 50, left: 80 }
    const width = 800 - margin.left - margin.right
    const height = 600 - margin.top - margin.bottom

    const svg = d3
      .select('#heatmap')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    mxt = d3.max(heatmap_data, d => {
      return d.num_transactions
    })
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain([
        '2014-01-06',
        '2014-01-07',
        '2014-01-08',
        '2014-01-09',
        '2014-01-10',
        '2014-01-11',
        '2014-01-12',
        '2014-01-13',
        '2014-01-14',
        '2014-01-15',
        '2014-01-16',
        '2014-01-17',
        '2014-01-18',
        '2014-01-19'
      ])
    //   .padding(0.01);
    var y = d3
      .scaleBand()
      .range([0, height])
      .domain([
        'Abila Zacharo',
        'Ahaggo Museum',
        "Albert's Fine Clothing",
        'Bean There Done That',
        "Brew've Been Served",
        'Brewed Awakenings',
        'Chostus Hotel',
        'Coffee Cameleon',
        'Coffee Shack',
        'Desafio Golf Course',
        "Frank's Fuel",
        "Frydos Autosupply n' More",
        'Gelatogalore',
        'General Grocer',
        "Guy's Gyros",
        'Hallowed Grounds',
        'Hippokampos',
        "Jack's Magical Beans",
        'Kalami Kafenion',
        'Katerina’s Café',
        'Kronos Mart',
        "Octavio's Office Supplies",
        'Ouzeri Elian',
        'Roberts and Sons',
        "Shoppers' Delight",
        'U-Pump'
      ])
    // .padding(0.01);
    const color = d3.scaleLinear().range(['white', 'green']).domain([0, mxt])

    g.selectAll('.cell')
      .data(heatmap_data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.timestamp))
      .attr('y', d => y(d.location))
      .attr('width', width / 14)
      .attr('height', height / 26)
      .style('fill', d => color(d.num_transactions))
      // .attr("stroke","black")
      // .attr("stroke-width","1px")
      .attr('class', 'cell')
      .on('click', function (event, d) {
        console.log(d)
        // make_pie()
        make_network(d.location, d.timestamp)
      })

    const xAxis = d3
      .axisBottom()
      .scale(
        d3
          .scaleBand()
          .domain([
            '2014-01-06',
            '2014-01-07',
            '2014-01-08',
            '2014-01-09',
            '2014-01-10',
            '2014-01-11',
            '2014-01-12',
            '2014-01-13',
            '2014-01-14',
            '2014-01-15',
            '2014-01-16',
            '2014-01-17',
            '2014-01-18',
            '2014-01-19'
          ])
          .range([0, width])
      )

    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis)
    xAxisGroup.selectAll('text').style('font-size', '6px')

    const yAxis = d3
      .axisLeft()
      .scale(
        d3
          .scaleBand()
          .domain([
            'Abila Zacharo',
            'Ahaggo Museum',
            "Albert's Fine Clothing",
            'Bean There Done That',
            "Brew've Been Served",
            'Brewed Awakenings',
            'Chostus Hotel',
            'Coffee Cameleon',
            'Coffee Shack',
            'Desafio Golf Course',
            "Frank's Fuel",
            "Frydos Autosupply n' More",
            'Gelatogalore',
            'General Grocer',
            "Guy's Gyros",
            'Hallowed Grounds',
            'Hippokampos',
            "Jack's Magical Beans",
            'Kalami Kafenion',
            'Katerina’s Café',
            'Kronos Mart',
            "Octavio's Office Supplies",
            'Ouzeri Elian',
            'Roberts and Sons',
            "Shoppers' Delight",
            'U-Pump'
          ])
          .range([0, height])
      )

    let yAxisGroup = g.append('g').call(yAxis)
    yAxisGroup.selectAll('text').style('font-size', '6px')
  })
})
function make_network (location, timestamp) {
  Promise.all([
    d3.csv('data/network_graph.csv'),
    d3.csv('data/id_fullname_cc_loyaltynum.csv')
  ]).then(function (values) {
    network_data = values[0]
    id_fullname = values[1]
    // console.log(network_data)
    // console.log(id_fullname)
    network_data = network_data.filter(
      entry => entry.location === location && entry.day === timestamp
    )
    console.log('Network data filtered')
    console.log(network_data)
    let person = [
      // { id: 1, Name: 'Kush' },
      // { id: 2, Name: 'Gaurav' },
      // { id: 3, Name: 'Aditya' }
    ]
    const mp = new Map()
    id_fullname.map(obj => {
      obj.id = +obj.id
      mp.set(obj.FullName, obj.id)
      person.push({ id: obj.id, Name: obj.FullName })
    })
    console.log('Person data')
    console.log(person)
    // console.log(mp)
    const ds = [
      // { source: 1, target: 2, weight: 10 },
      // { source: 2, target: 3, weight: 20 },
      // { source: 1, target: 3, weight: 5 }
    ]
    // console.log(mp.get("Nils Calixto"));
    network_data.map(obj => {
      obj.num_occurrences = +obj.num_occurrences
      ds.push({
        source: mp.get(obj.Person1),
        target: mp.get(obj.Person2),
        weight: obj.num_occurrences
      })
    })
    console.log('Network data final')
    console.log(ds)

    person = person.filter(item =>
      network_data.some(
        nameItem =>
          nameItem.Person1 === item.Name || nameItem.Person2 === item.Name
      )
    )
    console.log('Person data final')
    console.log(person)
    // return
    var margin = { top: 10, right: 30, bottom: 30, left: 40 },
      width = 1000 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom
    var svg = d3
      .select('#networkGraph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
    var g = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var link = g
      .selectAll('line')
      .data(ds)
      .enter()
      .append('line')
      .style('stroke', '#aaa')

    var weightText = g
      .selectAll('text')
      .data(ds)
      .enter()
      .append('text')
      .attr('x', function (d) {
        return (d.source.x + d.target.x) / 2
      })
      .attr('y', function (d) {
        return (d.source.y + d.target.y) / 2
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(function (d) {
        return d.weight // Assuming 'weight' is the property in your data
      })

    // Initialize the nodes
    var node = g
      .selectAll('circle')
      .data(person)
      .enter()
      .append('circle')
      .attr('r', 20)
      .style('fill', '#69b3a2')

    // Let's list the force we wanna apply on the network
    var simulation = d3
      .forceSimulation(person) // Force algorithm is applied to data.nodes
      .force(
        'link',
        d3
          .forceLink(ds) // This force provides links between nodes
          .id(function (d) {
            return d.id
          }) // This provide  the id of a node
      )
      .force('charge', d3.forceManyBody().strength(-400)) // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force('center', d3.forceCenter(width / 2, height / 2)) // This force attracts nodes to the center of the svg area
      .on('end', ticked)
    simulation.alphaDecay(0.1).restart()
    // .on('end', () => {})
    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked () {
      link
        .attr('x1', function (d) {
          // console.log(d.source)
          return d.source.x
        })
        .attr('y1', function (d) {
          return d.source.y
        })
        .attr('x2', function (d) {
          return d.target.x
        })
        .attr('y2', function (d) {
          return d.target.y
        })

      weightText
        .attr('x', function (d) {
          return (d.source.x + d.target.x) / 2
        })
        .attr('y', function (d) {
          return (d.source.y + d.target.y) / 2
        })

      node
        .attr('cx', function (d) {
          return d.x + 6
        })
        .attr('cy', function (d) {
          return d.y - 6
        })
    }
  })
}
function make_pie () {
  d3.csv('data/piechart_data.csv').then(function (data) {
    // Nest data by CurrentEmploymentType and calculate the sum of prices
    const nestedData = d3
      .nest()
      .key(d => d.CurrentEmploymentType)
      .rollup(group => d3.sum(group, d => +d.price)) // Convert to a number
      .entries(data)

    // Process the nested data
    const processedData = nestedData.map(d => ({
      type: d.key,
      totalAmount: d.value
    }))

    // Set up the pie chart dimensions
    const width = 700
    const height = 300
    const radius = Math.min(width, height) / 2

    // Set up colors for the pie chart
    const color = d3
      .scaleOrdinal()
      .domain(processedData.map(d => d.type))
      .range(['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF5733', '#8E44AD']) // Add more colors as needed

    // Create an SVG element
    const svg = d3
      .select('#employeePieChart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    // Generate the pie chart
    const pie = d3.pie().value(d => d.totalAmount)
    const path = d3.arc().outerRadius(radius).innerRadius(0)

    const arcs = svg
      .selectAll('arc')
      .data(pie(processedData))
      .enter()
      .append('g')

    arcs
      .append('path')
      .attr('d', path)
      .attr('fill', d => color(d.data.type))

    // Add a legend with some separation
    const legend = svg
      .selectAll('.legend')
      .data(processedData.map(d => d.type))
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr(
        'transform',
        (d, i) => `translate(-${width / 2 + 10},${i * 25 - height / 2 + 10})`
      )

    legend
      .append('rect')
      .attr('width', 18)
      .attr('height', 18)
      .style('fill', color)

    legend
      .append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.35em')
      .style('text-anchor', 'start')
      .text(d => d)
  })
}
