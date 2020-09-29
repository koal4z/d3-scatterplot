const getData = async () => {
  const res = await fetch(
    'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
  );
  const datas = await res.json();
  return datas;
};

const run = async () => {
  const dataSet = await getData();
  console.log(dataSet);

  const width = 800;
  const height = 600;
  const padding = 20;
  const div = d3
    .select('body')
    .append('div')
    .lower()
    .attr('id', 'scatter-graph-box');

  const svg = d3
    .select('#scatter-graph-box')
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('background-color', '#EEEEEE')
    .style('border', '1px solid rgba(0,0,0,0.25)')
    .style('border-radius', '2.5px')
    .style(
      'box-shadow',
      '0px 19px 38px  rgba(0,0,0,0.3), 0px 15px 12px rgba(0,0,0,0.22) '
    )
    .style('transition', 'all 0.22s linear')
    .on('mouseover', () => {
      svg.style('transform', 'translateY(-3px)');
    })
    .on('mouseout', () => {
      svg.style('transform', 'translateY(-0px)');
    });

  svg
    .append('text')
    .attr('id', 'title')
    .text('Doping in Professional Bicycle Racing')
    .attr('x', width / 2)
    .attr('y', padding + 15)
    .attr('text-anchor', 'middle')
    .style('font-size', '3.5rem')
    .style('text-transform', 'capitalize');

  svg
    .append('text')
    .text("35 Fastest times up Alpe d'Huez")
    .attr('x', width / 2)
    .attr('y', padding + 45) // 65
    .attr('text-anchor', 'middle')
    .style('font-size', '2rem');

  const minYear = d3.min(dataSet.map((data) => data.Year));
  const maxYear = d3.max(dataSet.map((data) => data.Year));
  const minTime = d3.min(dataSet.map((data) => data.Seconds));
  const maxTime = d3.max(dataSet.map((data) => data.Seconds));

  const xScale = d3
    .scaleTime()
    .domain([new Date(`${minYear - 1}`), new Date(`${maxYear + 1}`)])
    .range([padding, width - padding * 2]);

  const yScale = d3
    .scaleTime()
    .domain([minTime, maxTime])
    .range([70, height - padding]);

  const gX = svg.append('g').attr('id', 'x-axis');
  const gY = svg.append('g').attr('id', 'y-axis');
  const axisX = d3.axisBottom(xScale);
  const axisY = d3.axisLeft(yScale).tickFormat((d) => {
    const min = Math.floor(d / 60);
    const sec = d % 60;
    return sec === 60 ? min + 1 + ':00' : min + ':' + (sec < 10 ? '0' : '') + sec;
  });

  gX.call(axisX).attr('transform', `translate(${padding}, ${height - padding})`);
  gY.call(axisY).attr('transform', `translate(${padding * 2}, 0)`);

  const scatter = svg.append('g').attr('class', 'scatter-box');

  scatter
    .selectAll('.dot')
    .data(dataSet)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 4)
    .attr('cx', (d) => padding + xScale(new Date(`${d.Year}`)))
    .attr('cy', (d) => yScale(d.Seconds))
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => new Date(d.Seconds * 1000))
    .attr('fill', (d) => (d.Doping === '' ? '#339966' : '#ffcc66'))
    .attr('stroke', '#000000')
    .attr('stroke-width', '2');
};
run();
