let margin_hm, width_hm, height_hm, svg_hm, g_hm, svg_ts
let margin_ng, width_ng, height_ng, svg_ng, g_ng, svg_hg, bar_svg
let department_data, intermediate_emp_data, emp_data
let name_ts,
  timestamp_ts,
  location_ts,
  Innerwidth,
  Innerheight,
  margin_ts,
  width_ts,
  height_ts
let container_network = document.querySelector('.network-container')
let container_inno = document.querySelector('.innovative-container')
document.addEventListener('DOMContentLoaded', function () {
  Promise.all([d3.csv('data/heatmap_data.csv')]).then(function (values) {
    heatmap_data = values[0]
    console.log(heatmap_data)
    margin_hm = { top: 50, right: 50, bottom: 50, left: 80 }
    width_hm = 800 - margin_hm.left - margin_hm.right
    height_hm = 600 - margin_hm.top - margin_hm.bottom
    width_bp = 860
    height_bp = 760
    bar_svg = d3
      .select('#barpie')
      .attr('width', width_bp)
      .attr('height', height_hm + 100)
      .append('g')
      .attr('transform', `translate(${width_bp / 2}, ${height_bp / 2 + 100})`)
    svg_ts = d3.select('#time-series-chart')
    width_ts = +svg_ts.style('width').replace('px', '')
    height_ts = +svg_ts.style('height').replace('px', '')
    // console.log(employee_name + ' ' + location + ' ' + targetDate)
    margin_ts = { top: 60, right: 20, bottom: 35, left: 120 }

    Innerwidth = width_ts - margin_ts.left - margin_ts.right
    Innerheight = height_ts - margin_ts.top - margin_ts.bottom

    svg_ts
      .attr('width', Innerwidth)
      .attr('height', Innerheight)
      .append('g')
      .attr('transform', `translate(${margin_ts.left},${margin_ts.top})`)

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
        container_network.style.visibility = 'visible'
        container_inno.style.visibility = 'visible'
        make_network(d.location, d.timestamp)
        make_piebar(d.timestamp)
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
function make_piebar (day) {
  Promise.all([d3.csv('data/final_emp_data.csv')]).then(function (values) {
    data = values[0]

    intermediate_emp_data = data.reduce((result, currentItem) => {
      const {
        location,
        amount,
        last4ccnum,
        name,
        date,
        CarID,
        department,
        CurrentEmploymentTitle
      } = currentItem

      const amount_ = parseInt(amount)
      const existingItem = result.find(
        item => item.name === name && item.date === date
      )

      if (existingItem) {
        existingItem.amount_ = Number(existingItem.amount_) + amount_
      } else {
        result.push({
          name,
          department,
          date,
          amount_,
          CurrentEmploymentTitle,
          last4ccnum,
          CarID
        })
      }

      return result
    }, [])

    intermediate_emp_data.sort((a, b) => {
      if (a.department < b.department) return -1
      if (a.department > b.department) return 1
      return 0
    })

    console.log(intermediate_emp_data)
    console.log(day)
    data_wrangling(day)
  })
}
function data_wrangling (date) {
  emp_data = intermediate_emp_data.filter(e => e.date === date)
  department_data = {}

  emp_data.forEach(emp => {
    const department = emp.department

    if (department_data[department]) {
      department_data[department]++
    } else {
      department_data[department] = 1
    }
  })

  console.log(department_data)
  console.log(emp_data)

  draw_barchart()
}

function draw_barchart () {
  var innerRadius = 220
  var outerRadius = Math.min(width_bp, height_bp) / 2
  var x = d3
    .scaleBand()
    .range([0, 2 * Math.PI])
    .align(0)
    .domain(
      emp_data.map(function (d) {
        return d.name
      })
    )

  var y = d3
    .scaleRadial()
    .range([innerRadius, outerRadius])
    .domain([
      1,
      Math.max(
        ...emp_data.map(function (d) {
          return d.amount_
        })
      )
    ])

  var color = d3
    .scaleOrdinal()
    .domain(
      intermediate_emp_data.map(function (d) {
        return d.department
      })
    )
    .range(d3.schemeSet3)

  var paths = bar_svg
    .append('g')
    .selectAll('.bars')
    .data(emp_data)
    .join('path')
    .attr('class', 'bars')
    .attr(
      'd',
      d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(d => y(d['amount_']))
        .startAngle(d => x(d.name))
        .endAngle(d => x(d.name) + x.bandwidth())
        .padAngle(0.01)
        .padRadius(innerRadius)
    )
    .attr('fill', function (d, i) {
      return color(d.department)
    })
    .attr('stroke', 'black')
    .style('stroke-width', '0.75px')

  var pie = d3
    .pie()
    .value(d => d[1])
    .sort(function (a, b) {
      return b[1] > a[1]
    })
  var data_ready = pie(Object.entries(department_data))

  bar_svg
    .append('g')
    .selectAll('pie')
    .data(data_ready)
    .join('path')
    .attr('class', 'pie')
    .attr(
      'd',
      d3
        .arc()
        .innerRadius(0)
        .outerRadius(innerRadius)
        .padAngle(0.005)
        .padRadius(innerRadius)
    )
    .attr('fill', d => color(d.data[0]))
    .attr('stroke', 'black')
    .style('stroke-width', '0.5px')

  //pie labels
  bar_svg
    .selectAll('pie')
    .data(data_ready)
    .enter()
    .append('text')
    .text(function (d) {
      return d.data[0] + ''
    })
    .attr('transform', function (d) {
      return (
        'translate(' +
        d3
          .arc()
          .innerRadius(0)
          .outerRadius(innerRadius + 100)
          .padAngle(0.01)
          .padRadius(innerRadius)
          .centroid(d) +
        ')'
      )
    })
    .style('text-anchor', 'middle')
    .style('font-size', 15)

  //bar labels
  bar_svg
    .append('g')
    .selectAll('g')
    .data(emp_data)
    .join('g')
    .attr('text-anchor', function (d) {
      return (x(d.name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
        ? 'end'
        : 'start'
    })
    .attr('transform', function (d) {
      return (
        'rotate(' +
        (((x(d.name) + x.bandwidth() / 2) * 180) / Math.PI - 90) +
        ')' +
        'translate(' +
        (y(d['amount_']) + 10) +
        ',0)'
      )
    })
    .append('text')
    .text(function (d) {
      return d.name + ' '
    })
    .attr('transform', function (d) {
      return (x(d.name) + x.bandwidth() / 2 + Math.PI) % (2 * Math.PI) < Math.PI
        ? 'rotate(180)'
        : 'rotate(0)'
    })
    .style('font-size', 12)
    .attr('alignment-baseline', 'middle')

  //tooltip
  var Tooltip = d3
    .selectAll('.innovative-container')
    .style('left', '0px')
    .style('top', '0px')
    .append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)
    .attr('class', 'tooltip')
    .style('background-color', 'white')
    .style('z-index', '100')
    .style('border', 'solid')
    .style('position', 'fixed')
    .style('border-width', '2px')
    .style('border-radius', '5px')
    .style('padding', '5px')

  //bar tooltip
  bar_svg
    .selectAll('.bars')
    .on('mouseover', function (d, i) {
      // console.log("mouseover")
      Tooltip.html(i.name + '<br>' + 'Amount: $' + i.amount_)
      Tooltip.style('opacity', 1)
    })
    .on('mousemove', function (d, i) {
      // console.log("mousemove")
      Tooltip.html(i.name + '<br>' + 'Amount: $' + i.amount_)
        .style('left', event.screenX + 'px')
        .style('top', event.screenY - 75 + 'px')
    })
    .on('mouseout', function (d, i) {
      Tooltip.style('opacity', 0).style('left', '0px').style('top', '0px')
    })

  bar_svg
    .selectAll('.pie')
    .on('mouseover', function (d, i) {
      Tooltip.html(i.data[0] + ': ' + i.data[1])
      Tooltip.style('opacity', 1)
    })
    .on('mousemove', function (d, i) {
      Tooltip.html(i.data[0] + ': ' + i.data[1])
      Tooltip.style('opacity', 1)
        .style('left', event.screenX + 'px')
        .style('top', event.screenY - 75 + 'px')
    })
    .on('mouseout', function (d, i) {
      Tooltip.style('opacity', 0).style('left', '0px').style('top', '0px')
    })
}

function amount_ts () {
  TimeseriesAmount(name_ts, location_ts, timestamp_ts)
}
function freq_ts () {
  TimeseriesFrequency(name_ts, location_ts, timestamp_ts)
}

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

    var link = g_ng.selectAll('.ln').data(ds)
    link.exit().remove()
    link = link.enter().append('line').attr('class', 'ln').merge(link)
    link.style('stroke', '#aaa')

    var weightText = g_ng.selectAll('.txt').data(ds)
    weightText.exit().remove()
    weightText = weightText
      .enter()
      .append('text')
      .attr('class', 'txt')
      .merge(weightText)
    weightText
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text(function (d) {
        return d.weight
      })

    var node = g_ng.selectAll('.circ').data(person)
    node.exit().remove()
    var extra_nodes = node.enter().append('g').attr('class', 'circ')
    // .merge(node)

    extra_nodes.append('circle').attr('r', 20).style('fill', '#69b3a2')

    extra_nodes
      .append('text')
      .attr('dy', '.1em')
      .text(function (d) {
        return d.Name
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('fill', 'black')
      .style('font-size', '7px')

    node = node.merge(extra_nodes)
    node.style('cursor', 'pointer').on('click', function (event, d) {
      d3.select('#histogram').selectAll('*').remove()
      make_histogram(d.Name)
      name_ts = d.Name
      timestamp_ts = timestamp
      location_ts = location
    })

    var simulation = d3
      .forceSimulation(person)
      .force(
        'link',
        d3.forceLink(ds).id(function (d) {
          return d.id
        })
      )
      .force('charge', d3.forceManyBody().strength(-1500))
      .force('center', d3.forceCenter(width_ng / 2, height_ng / 2))
      .on('end', ticked)
    simulation.alphaDecay(0.1).restart()
    function ticked () {
      link
        .attr('x1', function (d) {
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

      node.attr('transform', function (d) {
        return 'translate(' + (d.x + 6) + ',' + (d.y - 6) + ')'
      })
    }
  })
}
// function make_pie () {
//   d3.csv('data/piechart_data.csv').then(function (data) {
//     // Nest data by CurrentEmploymentType and calculate the sum of prices
//     console.log('This is a person', person)
//     const nestedData = d3
//       .nest()
//       .key(d => d.CurrentEmploymentType)
//       .rollup(group => d3.sum(group, d => +d.price)) // Convert to a number
//       .entries(data)

//     // Process the nested data
//     const processedData = nestedData.map(d => ({
//       type: d.key,
//       totalAmount: d.value
//     }))

//     // Set up the pie chart dimensions
//     const width = 700
//     const height = 300
//     const radius = Math.min(width, height) / 2

//     // Set up colors for the pie chart
//     const color = d3
//       .scaleOrdinal()
//       .domain(processedData.map(d => d.type))
//       .range(['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF5733', '#8E44AD']) // Add more colors as needed

//     // Create an SVG element
//     const svg = d3
//       .select('#employeePieChart')
//       .append('svg')
//       .attr('width', width)
//       .attr('height', height)
//       .append('g')
//       .attr('transform', `translate(${width / 2},${height / 2})`)

//     // Generate the pie chart
//     const pie = d3.pie().value(d => d.totalAmount)
//     const path = d3.arc().outerRadius(radius).innerRadius(0)

//     const arcs = svg
//       .selectAll('arc')
//       .data(pie(processedData))
//       .enter()
//       .append('g')

//     arcs
//       .append('path')
//       .attr('d', path)
//       .attr('fill', d => color(d.data.type))

//     // Add a legend with some separation
//     const legend = svg
//       .selectAll('.legend')
//       .data(processedData.map(d => d.type))
//       .enter()
//       .append('g')
//       .attr('class', 'legend')
//       .attr(
//         'transform',
//         (d, i) => `translate(-${width / 2 + 10},${i * 25 - height / 2 + 10})`
//       )

//     legend
//       .append('rect')
//       .attr('width', 18)
//       .attr('height', 18)
//       .style('fill', color)

//     legend
//       .append('text')
//       .attr('x', 24)
//       .attr('y', 9)
//       .attr('dy', '.35em')
//       .style('text-anchor', 'start')
//       .text(d => d)
//   })
// }

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

function TimeseriesAmount (employee_name, location, targetDate) {
  console.log(targetDate)
  d3.csv('data/timeseries_data.csv').then(function (data) {
    data.forEach(function (d) {
      d.price = parseFloat(d.price)
      // d.timestamp = new Date(d.timestamp); // Assuming timestamp is in a date format
    })
    targetDate = new Date(targetDate)
    const minTimestamp = d3.min(data, d => new Date(d.timestamp))
    const maxTimestamp = d3.max(data, d => new Date(d.timestamp))
    const allDates = [minTimestamp, ...d3.timeDays(minTimestamp, maxTimestamp)]

    data = data.filter(
      d => d.FullName === employee_name && d.location === location
    )
    const aggregatedData = new Map()
    // Aggregate data
    data.forEach(d => {
      const key = `${d.FullName}-${d.timestamp}`
      if (!aggregatedData.has(key)) {
        aggregatedData.set(key, {
          employee: d.FullName,
          location: d.location,
          day: new Date(d.timestamp).toISOString().split('T')[0],
          totalSpending: d.price,
          frequency: 1
        })
      } else {
        const existingData = aggregatedData.get(key)
        existingData.totalSpending += d.price
        existingData.frequency += 1
      }
    })

    const aggregatedArray = Array.from(aggregatedData.values()).map(d => {
      d.totalSpending = parseFloat(d.totalSpending.toFixed(2))
      return d
    })

    // Initialize the dataByDay object
    var dataByDay = allDates.map(date => {
      return {
        day: date.toISOString().split('T')[0],
        totalSpending: 0,
        frequency: 0
      }
    })

    // Update dataByDay with values from aggregatedArray
    dataByDay.forEach(dayData => {
      const matchingAggregatedData = aggregatedArray.find(
        d => d.day === dayData.day
      )
      if (matchingAggregatedData) {
        dayData.totalSpending = matchingAggregatedData.totalSpending
        dayData.frequency = matchingAggregatedData.frequency
      }
    })
    aggregatedArray.forEach(d => {
      d.totalSpending = +d.totalSpending
    })
    const xScale = d3
      .scalePoint()
      .domain(dataByDay.map(d => d.day))
      .range([0, Innerwidth])
      .padding(0.5)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataByDay, d => d.totalSpending) + 5])
      .range([Innerheight, 0])

    const line = d3
      .line()
      .x(d => xScale(d.day))
      .y(d => yScale(d.totalSpending))

    svg_ts
      .append('g')
      .attr('transform', `translate(${margin_ts.left},${Innerheight})`)
      .call(d3.axisBottom(xScale))

    svg_ts
      .append('g')
      .attr('transform', `translate(${margin_ts.left}, 0)`)
      .call(d3.axisLeft(yScale))

    svg_ts
      .append('text')
      .attr('x', Innerwidth / 2 + margin_ts.left) // Centered on the x-axis
      .attr('y', Innerheight + margin_ts.top) // Positioned below the x-axis
      .style('text-anchor', 'middle')
      .text('Timestamp')

    // Add y-axis label
    svg_ts
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -Innerheight / 2 - margin_ts.top) // Centered on the y-axis
      .attr('y', margin_ts.left - 50) // Positioned to the left of the y-axis
      .style('text-anchor', 'middle')
      .text('Total Spending')

    // Draw the line
    svg_ts
      .append('path')
      .datum(dataByDay)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('transform', `translate(${margin_ts.left}, 0)`)
      .attr('d', line)

    const highlightedDateStr = targetDate.toISOString().split('T')[0]
    console.log('Highlighted Date Format:', highlightedDateStr)

    const highlightedData = dataByDay.find(d => {
      console.log('Data Day Format:', d.day)
      return d.day === highlightedDateStr
    })

    if (highlightedData) {
      svg_ts
        .append('circle')
        .attr('cx', xScale(highlightedData.day))
        .attr('cy', yScale(highlightedData.totalSpending))
        .attr('r', 5)
        .attr('fill', 'red')
        .attr('transform', `translate(${margin_ts.left}, 0)`)
    }
  })
}

function TimeseriesFrequency (employee_name, location, day) {
  d3.csv('data/timeseries_data.csv').then(function (data) {
    day = new Date(day)
    data.forEach(function (d) {
      d.price = parseFloat(d.price)
    })

    const minTimestamp = d3.min(data, d => new Date(d.timestamp))
    const maxTimestamp = d3.max(data, d => new Date(d.timestamp))
    // console.log(minTimestamp);
    // console.log(maxTimestamp);

    const allDates = [minTimestamp, ...d3.timeDays(minTimestamp, maxTimestamp)]
    // console.log(allDates)

    data = data.filter(
      d => d.FullName === employee_name && d.location === location
    )
    const aggregatedData = new Map()

    // Aggregate data
    data.forEach(d => {
      const key = `${d.FullName}-${d.timestamp}`
      if (!aggregatedData.has(key)) {
        aggregatedData.set(key, {
          employee: d.FullName,
          location: d.location,
          day: new Date(d.timestamp).toISOString().split('T')[0],
          totalSpending: d.price,
          frequency: 1
        })
      } else {
        const existingData = aggregatedData.get(key)
        existingData.totalSpending += d.price
        existingData.frequency += 1
      }
    })

    const aggregatedArray = Array.from(aggregatedData.values()).map(d => {
      d.totalSpending = parseFloat(d.totalSpending.toFixed(2))
      return d
    })

    // Initialize the dataByDay object
    var dataByDay = allDates.map(date => {
      return {
        day: date.toISOString().split('T')[0],
        totalSpending: 0,
        frequency: 0
      }
    })

    // Update dataByDay with values from aggregatedArray
    dataByDay.forEach(dayData => {
      const matchingAggregatedData = aggregatedArray.find(
        d => d.day === dayData.day
      )
      if (matchingAggregatedData) {
        dayData.totalSpending = matchingAggregatedData.totalSpending
        dayData.frequency = matchingAggregatedData.frequency
      }
    })

    aggregatedArray.forEach(d => {
      d.totalSpending = +d.totalSpending
    })

    // Set the domains of the scales
    const xScale = d3
      .scalePoint()
      .domain(dataByDay.map(d => d.day))
      .range([0, Innerwidth])
      .padding(0.5)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(dataByDay, d => d.frequency) + 2])
      .range([Innerheight, 0])

    // Set up the line generator
    const line = d3
      .line()
      .x(d => xScale(d.day))
      .y(d => yScale(d.frequency))

    // Draw the x-axis
    svg_ts
      .append('g')
      .attr('transform', `translate(${margin_ts.left},${Innerheight})`)
      .call(d3.axisBottom(xScale))

    // Draw the y-axis
    svg_ts
      .append('g')
      .attr('transform', `translate(${margin_ts.left}, 0)`)
      .call(d3.axisLeft(yScale))

    svg_ts
      .append('text')
      .attr('x', Innerwidth / 2 + margin_ts.left) // Centered on the x-axis
      .attr('y', Innerheight + margin_ts.top) // Positioned below the x-axis
      .style('text-anchor', 'middle')
      .text('Timestamp')

    // Add y-axis label
    svg_ts
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -Innerheight / 2 - margin_ts.top) // Centered on the y-axis
      .attr('y', margin_ts.left - 50) // Positioned to the left of the y-axis
      .style('text-anchor', 'middle')
      .text('Frequency')

    // Draw the line
    svg_ts
      .append('path')
      .datum(dataByDay)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 2)
      .attr('transform', `translate(${margin_ts.left}, 0)`)
      .attr('d', line)

    const highlightedDateStr = day.toISOString().split('T')[0]
    // console.log("Highlighted Date Format:", highlightedDateStr);

    const highlightedData = dataByDay.find(d => {
      console.log('Data Day Format:', d.day)
      return d.day === highlightedDateStr
    })

    if (highlightedData) {
      svg_ts
        .append('circle')
        .attr('cx', xScale(highlightedData.day))
        .attr('cy', yScale(highlightedData.frequency))
        .attr('r', 5)
        .attr('fill', 'red')
        .attr('transform', `translate(${margin_ts.left}, 0)`)
    }
  })
}
