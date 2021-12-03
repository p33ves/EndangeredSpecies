const width = 960,
  height = 500;

const velocity = [0.01, 0.005],
  t0 = Date.now();

const projection = d3.geoOrthographic().scale(height / 2 - 10);

const canvas = d3
  .select("#body")
  .append("canvas")
  .attr("width", width)
  .attr("height", height);

// canvas.call(d3.drag()
//     .on("start", dragstarted)
//     .on("drag", dragged));
//
// let render = function () {
//     },
//     v0, // Mouse position in Cartesian coordinates at start of drag gesture.
//     r0, // Projection rotation as Euler angles at start.
//     q0; // Projection rotation as versor at start.

const context = canvas.node().getContext("2d");

context.strokeStyle = "#000";
context.lineWidth = 0.5;

let timer;
d3.timer(function () {
  timer = Date.now() - t0;
  projection.rotate([timer * velocity[0], timer * velocity[1]]);
  redraw();
});

// function dragstarted() {
//     // timer.stop();
//     v0 = versor.cartesian(projection.invert(d3.mouse(this)));
//     r0 = projection.rotate();
//     q0 = versor(r0);
// }
//
// function dragged() {
//     const v1 = versor.cartesian(projection.rotate(r0).invert(d3.mouse(this))),
//         q1 = versor.multiply(q0, versor.delta(v0, v1)),
//         r1 = versor.rotation(q1);
//     projection.rotate(r1);
//     redraw();
// }

let faces = [];

const output = d3.select("output");
const subdivision = 26;
const balldata = [
  {
    year: 0,
    fungii: 56,
    black_f: 0,
    plants: 5625,
    black_p: 0,
    inver: 2576,
    black_i: 0,
    ver: 5580,
    black_v: 0,
    black_t: 0,
  },
  {
    year: 2002,
    fungii: 56,
    black_f: 0,
    plants: 5054,
    black_p: 571,
    inver: 2383,
    black_i: 193,
    ver: 5228,
    black_v: 352,
    black_t: 1116,
  },
  {
    year: 2003,
    fungii: 56,
    black_f: 0,
    plants: 4948,
    black_p: 677,
    inver: 2380,
    black_i: 196,
    ver: 5228,
    black_v: 352,
    black_t: 1225,
  },
  {
    year: 2004,
    fungii: 56,
    black_f: 0,
    plants: 4793,
    black_p: 832,
    inver: 2377,
    black_i: 199,
    ver: 5061,
    black_v: 519,
    black_t: 1550,
  },
  {
    year: 2005,
    fungii: 56,
    black_f: 0,
    plants: 5625,
    black_p: 0,
    inver: 2576,
    black_i: 0,
    ver: 5580,
    black_v: 0,
    black_t: 0,
  },
  {
    year: 2006,
    fungii: 56,
    black_f: 0,
    plants: 4786,
    black_p: 839,
    inver: 2366,
    black_i: 210,
    ver: 5018,
    black_v: 562,
    black_t: 1611,
  },
  {
    year: 2007,
    fungii: 55,
    black_f: 1,
    plants: 4780,
    black_p: 845,
    inver: 2365,
    black_i: 211,
    ver: 5006,
    black_v: 574,
    black_t: 1631,
  },
  {
    year: 2008,
    fungii: 55,
    black_f: 1,
    plants: 4779,
    black_p: 846,
    inver: 2326,
    black_i: 250,
    ver: 4983,
    black_v: 597,
    black_t: 1694,
  },
  {
    year: 2009,
    fungii: 55,
    black_f: 1,
    plants: 4775,
    black_p: 850,
    inver: 2312,
    black_i: 264,
    ver: 4966,
    black_v: 614,
    black_t: 1729,
  },
  {
    year: 2010,
    fungii: 55,
    black_f: 1,
    plants: 4753,
    black_p: 872,
    inver: 2286,
    black_i: 290,
    ver: 4909,
    black_v: 671,
    black_t: 1834,
  },
  {
    year: 2011,
    fungii: 55,
    black_f: 1,
    plants: 4709,
    black_p: 916,
    inver: 2246,
    black_i: 330,
    ver: 4869,
    black_v: 711,
    black_t: 1958,
  },
  {
    year: 2012,
    fungii: 55,
    black_f: 1,
    plants: 4686,
    black_p: 939,
    inver: 2219,
    black_i: 357,
    ver: 4855,
    black_v: 725,
    black_t: 2022,
  },
  {
    year: 2013,
    fungii: 55,
    black_f: 1,
    plants: 4618,
    black_p: 1007,
    inver: 2194,
    black_i: 382,
    ver: 4841,
    black_v: 739,
    black_t: 2129,
  },
  {
    year: 2014,
    fungii: 55,
    black_f: 1,
    plants: 4567,
    black_p: 1058,
    inver: 2162,
    black_i: 414,
    ver: 4812,
    black_v: 768,
    black_t: 2241,
  },
  {
    year: 2015,
    fungii: 52,
    black_f: 4,
    plants: 4502,
    black_p: 1123,
    inver: 2156,
    black_i: 420,
    ver: 4802,
    black_v: 778,
    black_t: 2325,
  },
  {
    year: 2016,
    fungii: 53,
    black_f: 3,
    plants: 4461,
    black_p: 1164,
    inver: 2129,
    black_i: 447,
    ver: 4764,
    black_v: 816,
    black_t: 2430,
  },
  {
    year: 2017,
    fungii: 51,
    black_f: 5,
    plants: 4374,
    black_p: 1251,
    inver: 2087,
    black_i: 489,
    ver: 4743,
    black_v: 837,
    black_t: 2582,
  },
  {
    year: 2018,
    fungii: 50,
    black_f: 6,
    plants: 4295,
    black_p: 1330,
    inver: 2072,
    black_i: 504,
    ver: 4736,
    black_v: 844,
    black_t: 2684,
  },
  {
    year: 2019,
    fungii: 39,
    black_f: 17,
    plants: 4048,
    black_p: 1577,
    inver: 2054,
    black_i: 522,
    ver: 4679,
    black_v: 901,
    black_t: 3017,
  },
  {
    year: 2020,
    fungii: 32,
    black_f: 24,
    plants: 3589,
    black_p: 2036,
    inver: 2027,
    black_i: 549,
    ver: 4589,
    black_v: 991,
    black_t: 3600,
  },
  {
    year: 2021,
    fungii: 29,
    black_f: 27,
    plants: 3375,
    black_p: 2250,
    inver: 2011,
    black_i: 565,
    ver: 4568,
    black_v: 1012,
    black_t: 3854,
  },
];

var year = 0;

var input_year = d3
  .select("#year input")
  .on("change", function () {
    year = +this.value;
    geodesic(year);
  })
  .each(function () {
    year = +this.value;
    geodesic(year);
  });

geodesic(year);

function redraw() {
  context.clearRect(0, 0, width, height);

  faces.forEach(function (d) {
    d.polygon[0] = projection(d[0]);
    d.polygon[1] = projection(d[1]);
    d.polygon[2] = projection(d[2]);
    if ((d.visible = d3.polygonArea(d.polygon) > 0)) {
      context.fillStyle = d.fill;
      context.beginPath();
      drawTriangle(d.polygon);
      context.fill();
    }
  });

  context.beginPath();
  faces.forEach(function (d) {
    if (d.visible) {
      drawTriangle(d.polygon);
    }
  });
  context.stroke();
}

function drawTriangle(triangle) {
  context.moveTo(triangle[0][0], triangle[0][1]);
  context.lineTo(triangle[1][0], triangle[1][1]);
  context.lineTo(triangle[2][0], triangle[2][1]);
  context.closePath();
}

function geodesic(year) {
  const polyhedron = d3.icosahedron;

  const {
    fungii,
    black_f,
    plants,
    black_p,
    inver,
    black_i,
    ver,
    black_v,
    black_t,
  } = balldata.find((data) => data.year === year);

  console.log({
    year,
    fungii,
    black_f,
    plants,
    black_p,
    inver,
    black_i,
    ver,
    black_v,
    black_t,
  });

  let colorArray = Array(+fungii)
    .fill("mediumorchid")
    .concat(
      Array(+black_f).fill("black"),
      Array(+plants).fill("forestgreen"),
      Array(+black_p).fill("black"),
      Array(+inver).fill("skyblue"),
      Array(+black_i).fill("black"),
      Array(+ver).fill("khaki"),
      Array(+black_v).fill("black")
    );

  // Color scheme light -
  // let colorArray = Array(56)
  //   .fill("mediumorchid")
  //   .concat(
  //     Array(5625).fill("forestgreen"),
  //     Array(2576).fill("skyblue"),
  //     Array(5580).fill("khaki")
  //   );

  faces = polyhedron.polygons(subdivision).map(function (d) {
    d = d.coordinates[0];
    d.pop(); // use an open polygon
    //d.fill = d3.hsl(d[0][0], 1, .5) + "";
    //d.fill = d3.hsl(Math.random() * 360, 1, .5) + "";
    d.fill = colorArray[Math.floor(Math.random() * colorArray.length)];
    // console.log(colorArray[1]);
    d.polygon = d.map(projection);
    return d;
  });
  // output.text("Total Faces =" + faces.length + ", Subdivision =" + subdivision);
  if (year == 2005) {
    output.text("Year = " + year + " No Data was found!");
  } else {
    output.text("Year = " + year);
  }
  redraw();
}
