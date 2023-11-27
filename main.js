let margin_hm, width_hm, height_hm, svg_hm, g_hm
let margin_ng, width_ng, height_ng, svg_ng, g_ng, svg_hg

document.addEventListener('DOMContentLoaded', function () {
  Promise.all([d3.csv('data/heatmap_data.csv')]).then(function (values) {
    heatmap_data = values[0]
    console.log(heatmap_data)
    margin_hm = { top: 50, right: 50, bottom: 50, left: 80 }
    width_hm = 800 - margin_hm.left - margin_hm.right
    height_hm = 600 - margin_hm.top - margin_hm.bottom

    svg_hg = d3.select('#histogram')
    svg_hm = d3
      .select('#heatmap')
      .attr('width', width_hm + margin_hm.left + margin_hm.right)
      .attr('height', height_hm + margin_hm.top + margin_hm.bottom)
    g_hm = svg_hm
      .append('g')
      .attr('transform', `translate(${margin_hm.left},${margin_hm.top})`)
    ;(margin_ng = { top: 0, right: 30, bottom: 30, left: 40 }),
      (width_ng = 1000 - margin_ng.left - margin_ng.right),
      (height_ng = 800 - margin_ng.top - margin_ng.bottom)
    svg_ng = d3
      .select('#networkGraph')
      .append('svg')
      .attr('width', width_ng + margin_ng.left + margin_ng.right)
      .attr('height', height_ng + margin_ng.top + margin_ng.bottom)
    g_ng = svg_ng
      .append('g')
      .attr(
        'transform',
        'translate(' + margin_ng.left + ',' + margin_ng.top + ')'
      )

    mxt = d3.max(heatmap_data, d => {
      return d.num_transactions
    })
    var x = d3
      .scaleBand()
      .range([0, width_hm])
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
      .range([0, height_hm])
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

    g_hm
      .selectAll('.cell')
      .data(heatmap_data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.timestamp))
      .attr('y', d => y(d.location))
      .attr('width', width_hm / 14)
      .attr('height', height_hm / 26)
      .style('fill', d => color(d.num_transactions))
      .style('cursor', 'pointer')
      // .attr("stroke","black")
      // .attr("stroke-width","1px")
      .attr('class', 'cell')
      // .on('click', function (d) {
      //   d3.select('n_ng').selectAll('*').remove()
      // })
      .on('click', function (event, d) {
        console.log('Clicked cell:', d)
        // d3.select('#networkGraph').remove()
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
          .range([0, width_hm])
      )

    const xAxisGroup = g_hm
      .append('g')
      .attr('transform', `translate(0,${height_hm})`)
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
          .range([0, height_hm])
      )

    let yAxisGroup = g_hm.append('g').call(yAxis)
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
    const uniquePairsSet = new Set()
    function getUniquePairKey (obj) {
      const [nameA, nameB] = [obj.Person1, obj.Person2].sort()
      return `${nameA}_${nameB}`
    }

    network_data = network_data.filter(item => {
      const pairKey = getUniquePairKey(item)
      if (!uniquePairsSet.has(pairKey)) {
        uniquePairsSet.add(pairKey)
        return true
      }
      return false
    })
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

    let link = g_ng
      .selectAll('.ln')
      .data(ds)
      // console.log(link);
      .enter()
      .append('line')
      .attr('class', 'ln')
      // .merge(link)
      .style('stroke', '#aaa')
    console.log(link)
    var weightText = g_ng
      .selectAll('.txt')
      .data(ds)
      .enter()
      .append('text')
      .attr('class', 'txt')
      .attr('x', function (d) {
        return (d.source.x + d.target.x) / 2
      })
      .attr('y', function (d) {
        return (d.source.y + d.target.y) / 2
      })
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(function (d) {
        return d.weight
      })

    var node = g_ng
      .selectAll('.circ')
      .data(person)
      .enter()
      .append('g')
      .attr('class', 'circ')
      .style('cursor', 'pointer')
      .on('click', function (event, d) {
        d3.select('#histogram').selectAll('*').remove()
        make_histogram(d.Name)
      })

    node.append('circle').attr('r', 20).style('fill', '#69b3a2')

    node
      .append('text')
      .attr('dy', '.1em')
      .text(function (d) {
        return d.Name
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'black')
      .style('font-size', '5px')

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
      .force('center', d3.forceCenter(width_ng / 2, height_ng / 2)) // This force attracts nodes to the center of the svg area
      .on('end', ticked)
    simulation.alphaDecay(0.1).restart()
    // .on('end', () => {})
    // This function is run at each iteration of the force algorithm, updating the nodes position.
    function ticked () {
      console.log('Yo')
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
      // .merge(weightText)

      node.attr('transform', function (d) {
        return 'translate(' + (d.x + 6) + ',' + (d.y - 6) + ')'
      })
    }
  })
}
function make_pie () {
  d3.csv('data/piechart_data.csv').then(function (data) {
    // Nest data by CurrentEmploymentType and calculate the sum of prices
    console.log('This is a person', person)
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

function make_timeseries (employee) {}

function make_histogram (employee_name) {
  d3.csv('data/Histogram_data.csv').then(function (data) {
    data.forEach(function (d) {
      d.credit_price = parseFloat(d.credit_price).toFixed(2)
      d.loyalty_price = parseFloat(d.loyalty_price).toFixed(2)
    })

    // Define margins
    const margin = { top: 50, right: 300, bottom: 10, left: 120 }

    // Get the width and height of the container
    const width = +svg_hg.style('width').replace('px', '')
    const height = +svg_hg.style('height').replace('px', '')

    // Calculate the inner width and height
    const Innerwidth = width - margin.left - margin.right
    const Innerheight = height - margin.top - margin.bottom

    // Create an svg_hg element
    svg_hg.attr('width', Innerwidth).attr('height', Innerheight)

    // Define scales for X and Y axes
    var yScale = d3
      .scaleBand()
      .domain(
        data.map(function (d) {
          return d.FullName
        })
      )
      .range([0, Innerheight])
      .paddingInner(0.9) // Adjust the padding as needed
      .paddingOuter(0.9)

    var barHeight = yScale.bandwidth()

    var maxExpense = d3.max(data, function (d) {
      return Math.max(parseFloat(d.credit_price), parseFloat(d.loyalty_price))
    })

    var xScale = d3
      .scaleLinear()
      .domain([0, maxExpense + 500])
      .range([0, Innerwidth])

    // Create X and Y axes
    var xAxis = svg_hg
      .append('g')
      .attr('transform', `translate(${margin.left},${Innerheight})`)
      .call(
        d3
          .axisBottom(xScale)
          .ticks(5) // Adjust the number of ticks as needed
          .tickFormat(d3.format('.0f'))
      )

    var yAxis = svg_hg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ', 0)')
      .call(d3.axisLeft(yScale))

    // Add X-axis label
    svg_hg
      .append('text')
      .attr(
        'transform',
        `translate(${Innerwidth / 2 + margin.left},${Innerheight + margin.top})`
      )
      .style('text-anchor', 'middle')
      .text('Loyalty/Credit Card Expenditure')

    // Add Y-axis label
    // svg_hg.append("text")
    //     .attr("transform", "rotate(-90)")
    //     .attr("y", margin.left - 80)
    //     .attr("x", 0 - (Innerheight / 2 + margin.top))
    //     .style("text-anchor", "middle")
    //     .text("Employee");

    // Create bars for credit card expenses
    svg_hg
      .selectAll('.credit-card-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'credit-card-bar')
      .attr('height', barHeight + 5)
      .attr('y', function (d) {
        return yScale(d.FullName) + (yScale.bandwidth() - barHeight) / 2
      })
      .attr('x', margin.left)
      .attr('width', function (d) {
        return xScale(parseFloat(d.credit_price))
      })
      .attr('fill', function (d) {
        return d.FullName === employee_name ? 'red' : 'black'
      })

    // Create bars for loyalty card expenses
    svg_hg
      .selectAll('.loyalty-card-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'loyalty-card-bar')
      .attr('height', barHeight + 5)
      .attr('y', function (d) {
        return yScale(d.FullName) - 7
      })
      .attr('x', margin.left)
      .attr('width', function (d) {
        return xScale(parseFloat(d.loyalty_price))
      })
      .attr('fill', function (d) {
        return d.FullName === employee_name ? 'orange' : 'blue'
      })

    // Legend
    var legendColors = ['black', 'blue']
    var legend = svg_hg
      .append('g')
      .attr(
        'transform',
        `translate(${Innerwidth + margin.left + 10},${margin.top})`
      )

    legend
      .selectAll('.legend-item')
      .data(['Credit Card', 'Loyalty Card'])
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', function (d, i) {
        return `translate(0, ${i * 20})`
      })
      .each(function (d, i) {
        d3.select(this)
          .append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', legendColors[i])

        d3.select(this)
          .append('text')
          .attr('x', 25)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .text(d)
      })
    // Add legend for the specified employee_name
    var customlegendColors = ['red', 'orange']
    var customLegend = svg_hg
      .append('g')
      .attr(
        'transform',
        `translate(${Innerwidth + margin.left + 10},${
          margin.top + legendColors.length * 20 + 10
        })`
      )

    customLegend
      .selectAll('.customlegend-item')
      .data([employee_name + ' Credit Card', employee_name + ' Loyalty Card'])
      .enter()
      .append('g')
      .attr('class', 'customlegend-item')
      .attr('transform', function (d, i) {
        return `translate(0, ${i * 20})`
      })
      .each(function (d, i) {
        d3.select(this)
          .append('rect')
          .attr('width', 18)
          .attr('height', 18)
          .attr('fill', customlegendColors[i])

        d3.select(this)
          .append('text')
          .attr('x', 25)
          .attr('y', 9)
          .attr('dy', '.35em')
          .style('text-anchor', 'start')
          .text(d)
      })
  })
}
