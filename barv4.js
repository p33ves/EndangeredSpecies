var salesData;
var truncLengh = 30;
$(document).ready(function () {
  Plot();
});
function Plot(year = 2002) {
  TransformChartData(chartData(year), chartOptions);
  BuildBar("chart", chartData(year), chartOptions);

  console.log(chartData(year));
}

function BuildBar(id, chartData, options, level) {
  d3.selectAll("#" + id + " svg").remove();
  chart = d3.select("#" + id + " .innerCont");

  var margin = { top: 50, right: 10, bottom: 30, left: 50 },
    width =
      $($("#" + id + " .innerCont")[0]).outerWidth() -
      margin.left -
      margin.right,
    height =
      $($("#" + id + " .innerCont")[0]).outerHeight() -
      margin.top -
      margin.bottom;
  var xVarName;
  var yVarName = options[0].yaxis;

  if (level == 1) {
    xVarName = options[0].xaxisl1;
  } else {
    xVarName = options[0].xaxis;
  }

  var xAry = runningData.map(function (el) {
    return el[xVarName];
  });

  var yAry = runningData.map(function (el) {
    return el[yVarName];
  });

  var capAry = runningData.map(function (el) {
    return el.caption;
  });

  var x = d3.scaleBand().domain(xAry).rangeRound([0, width], 0.5);
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(runningData, function (d) {
        return d[yVarName];
      }),
    ])
    .range([height, 0]);
  var rcolor = d3.scaleOrdinal().range(runningColors);

  chart = chart
    .append("svg") //append svg element inside #chart
    .attr("width", width + margin.left + margin.right) //set width
    .attr("height", height + margin.top + margin.bottom); //set height

  var bar = chart
    .selectAll("g")
    .data(runningData)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + x(d[xVarName]) + ", 0)";
    });

  var ctrtxt = 0;
  var xAxis = d3
    .axisBottom()
    .scale(x)
    .ticks(xAry.length)
    .tickFormat(function (d) {
      if (level == 0) {
        var mapper = options[0].captions[0];
        return mapper[d];
      } else {
        var r = runningData[ctrtxt].caption;
        ctrtxt += 1;
        return r;
      }
    });

  var yAxis = d3.axisLeft().scale(y).ticks(5); //orient left because y-axis tick labels will appear on the left side of the axis.

  bar
    .append("rect")
    .attr("y", function (d) {
      return y(d.Total) + margin.top - 15;
    })
    // .attr("y", height)
    .attr("x", function (d) {
      return margin.left + x.bandwidth() / 4;
    })
    .on("mouseenter", function (d) {
      d3.select(this)
        .attr("stroke", "white")
        .attr("stroke-width", 1)
        .attr("y", function (d) {
          return y(d.Total) + margin.top - 20;
        })
        .attr("height", function (d) {
          return height - y(d[yVarName]) + 5;
        })
        .attr("x", function (d) {
          return margin.left - 5 + x.bandwidth() / 4;
        })
        .attr("width", x.bandwidth() / 2 + 10)
        .transition()
        .duration(200);
    })
    .on("mouseleave", function (d) {
      d3.select(this)
        .attr("stroke", "none")
        .attr("y", function (d) {
          return y(d[yVarName]) + margin.top - 15;
        })
        .attr("height", function (d) {
          return height - y(d[yVarName]);
        })
        .attr("x", function (d) {
          return margin.left + x.bandwidth() / 4;
        })
        .attr("width", x.bandwidth() / 2)
        .transition()
        .duration(200);
    })
    .on("click", function (d) {
      if (this._listenToEvents) {
        // Reset inmediatelly
        d3.select(this).attr("transform", "translate(0,0)");
        // Change level on click if no transition has started
        path.each(function () {
          this._listenToEvents = false;
        });
      }
      d3.selectAll("#" + id + " svg").remove();
      if (level == 1) {
        TransformChartData(chartData, options, 0, d[xVarName]);
        BuildBar(id, chartData, options, 0);
      } else {
        var nonSortedChart = chartData.sort(function (a, b) {
          return (
            parseFloat(b[options[0].yaxis]) - parseFloat(a[options[0].yaxis])
          );
        });
        TransformChartData(nonSortedChart, options, 1, d[xVarName]);
        BuildBar(id, nonSortedChart, options, 1);
      }
    });

  bar
    .selectAll("rect")
    .transition()
    .duration(1000)
    .attr("height", function (d) {
      return height - y(d[yVarName]);
    })
    .attr("width", x.bandwidth() / 2); //set width base on range on ordinal data;

  //setTimeout( 1000)
  bar.selectAll("rect").style("fill", function (d) {
    return rcolor(d[xVarName]);
  }),
    bar
      .append("text")
      .attr("x", x.bandwidth() / 2 + margin.left - 10)
      .attr("y", function (d) {
        return y(d[yVarName]) + margin.top - 25;
      })
      .attr("dy", ".35em")
      .text(function (d) {
        return d[yVarName];
      });

  bar.append("svg:title").text(function (d) {
    return d["title"] + " (" + d[yVarName] + ")";
  });

  chart
    .append("g")
    .attr("class", "x axis")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (height + margin.top - 15) + ")"
    )
    .call(xAxis)
    .append("text")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end");
  //.text("Year");

  chart
    .append("g")
    .attr("class", "y axis")
    .attr(
      "transform",
      "translate(" + margin.left + "," + (margin.top - 15) + ")"
    )
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end");

  chart.selectAll("text").attr("transform", " translate(10,30) rotate(180)");
  chart
    .select(".y.axis")
    .selectAll("text")
    .attr("transform", " translate(-50,0) rotate(180)");

  if (level == 1) {
    chart
      .select(".x.axis")
      .selectAll("text")
      .attr("transform", " translate(10,30) rotate(210)");
  }
}

function TransformChartData(chartData, opts, level, filter) {
  var result = [];
  var resultColors = [];
  var counter = 0;
  var hasMatch;
  var xVarName;
  var yVarName = opts[0].yaxis;

  if (level == 1) {
    xVarName = opts[0].xaxisl1;

    for (var i in chartData) {
      hasMatch = false;
      for (var index = 0; index < result.length; ++index) {
        var data = result[index];

        if (
          data[xVarName] == chartData[i][xVarName] &&
          chartData[i][opts[0].xaxis] == filter
        ) {
          result[index][yVarName] =
            result[index][yVarName] + chartData[i][yVarName];
          hasMatch = true;
          break;
        }
      }
      if (hasMatch == false && chartData[i][opts[0].xaxis] == filter) {
        if (result.length < 9) {
          ditem = {};
          ditem[xVarName] = chartData[i][xVarName];
          ditem[yVarName] = chartData[i][yVarName];
          ditem["caption"] = chartData[i][xVarName].substring(0, 10) + "...";
          ditem["title"] = chartData[i][xVarName];
          ditem["op"] = 1.0 - parseFloat("0." + result.length);
          result.push(ditem);

          resultColors[counter] = opts[0].color[0][chartData[i][opts[0].xaxis]];

          counter += 1;
        }
      }
    }
  } else {
    xVarName = opts[0].xaxis;

    for (var i in chartData) {
      hasMatch = false;
      for (var index = 0; index < result.length; ++index) {
        var data = result[index];

        if (data[xVarName] == chartData[i][xVarName]) {
          result[index][yVarName] =
            result[index][yVarName] + chartData[i][yVarName];
          hasMatch = true;
          break;
        }
      }
      if (hasMatch == false) {
        ditem = {};
        ditem[xVarName] = chartData[i][xVarName];
        ditem[yVarName] = chartData[i][yVarName];
        ditem["caption"] =
          opts[0].captions != undefined
            ? opts[0].captions[0][chartData[i][xVarName]]
            : "";
        ditem["title"] =
          opts[0].captions != undefined
            ? opts[0].captions[0][chartData[i][xVarName]]
            : "";
        ditem["op"] = 1;
        result.push(ditem);

        resultColors[counter] =
          opts[0].color != undefined
            ? opts[0].color[0][chartData[i][xVarName]]
            : "";

        counter += 1;
      }
    }
  }

  runningData = result;
  runningColors = resultColors;
  return;
}

// var chartData = [
//   {
//     Country: "USA",
//     Model: "Model 1",
//     Total: 487,
//   },
//   {
//     Country: "USA",
//     Model: "Model 2",
//     Total: 185,
//   },
//   {
//     Country: "USA",
//     Model: "Model 3",
//     Total: 140,
//   },
//   {
//     Country: "USA",
//     Model: "Model 4",
//     Total: 108,
//   },
//   {
//     Country: "USA",
//     Model: "Model 5",
//     Total: 26,
//   },
//   {
//     Country: "USA",
//     Model: "Model 6",
//     Total: 106,
//   },
//   {
//     Country: "USA",
//     Model: "Model 7",
//     Total: 27,
//   },
//   {
//     Country: "USA",
//     Model: "Model 8",
//     Total: 44,
//   },
//   {
//     Country: "USA",
//     Model: "Model 9",
//     Total: 96,
//   },
//   {
//     Country: "INDIA",
//     Model: "Model 1",
//     Total: 411,
//   },
//   {
//     Country: "INDIA",
//     Model: "Model 2",
//     Total: 33,
//   },
//   {
//     Country: "INDIA",
//     Model: "Model 3",
//     Total: 32,
//   },
//   {
//     Country: "INDIA",
//     Model: "Model 4",
//     Total: 29,
//   },
//   {
//     Country: "INDIA",
//     Model: "Model 5",
//     Total: 29,
//   },
//   {
//     Country: "CANADA",
//     Model: "Model 1",
//     Total: 7,
//   },
//   {
//     Country: "CANADA",
//     Model: "Model 2",
//     Total: 20,
//   },
//   {
//     Country: "CANADA",
//     Model: "Model 3",
//     Total: 232,
//   },
//   {
//     Country: "CANADA",
//     Model: "Model 4",
//     Total: 1117,
//   },
// ];

const fullChartData = [
  {
    Year: 2021,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1327,
  },
  {
    Year: 2021,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1481,
  },
  {
    Year: 2021,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 1587,
  },
  {
    Year: 2021,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 2444,
  },
  {
    Year: 2021,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 3280,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 1959,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 2340,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 743,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 236,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 218,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 2,
  },
  {
    Year: 2021,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 146,
  },
  {
    Year: 2021,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 165,
  },
  {
    Year: 2021,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 280,
  },
  {
    Year: 2021,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 403,
  },
  {
    Year: 2021,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 21646,
  },
  {
    Year: 2021,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2021,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2021,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 56,
  },
  {
    Year: 2021,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 206,
  },
  {
    Year: 2021,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2020,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1323,
  },
  {
    Year: 2020,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1481,
  },
  {
    Year: 2020,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 1458,
  },
  {
    Year: 2020,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 2442,
  },
  {
    Year: 2020,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 3210,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 1926,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 2300,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 742,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 237,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 203,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 2,
  },
  {
    Year: 2020,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 148,
  },
  {
    Year: 2020,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 165,
  },
  {
    Year: 2020,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 265,
  },
  {
    Year: 2020,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 403,
  },
  {
    Year: 2020,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 19518,
  },
  {
    Year: 2020,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2020,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2020,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 48,
  },
  {
    Year: 2020,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 185,
  },
  {
    Year: 2020,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2019,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1244,
  },
  {
    Year: 2019,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1486,
  },
  {
    Year: 2019,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 1409,
  },
  {
    Year: 2019,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 2200,
  },
  {
    Year: 2019,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2674,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 1647,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 2250,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 733,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 237,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 197,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 2,
  },
  {
    Year: 2019,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 146,
  },
  {
    Year: 2019,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 164,
  },
  {
    Year: 2019,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 261,
  },
  {
    Year: 2019,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 402,
  },
  {
    Year: 2019,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 14938,
  },
  {
    Year: 2019,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2019,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2019,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 24,
  },
  {
    Year: 2019,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 140,
  },
  {
    Year: 2019,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2018,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1219,
  },
  {
    Year: 2018,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1492,
  },
  {
    Year: 2018,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 1307,
  },
  {
    Year: 2018,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 2092,
  },
  {
    Year: 2018,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2332,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 1537,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 2195,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 733,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 237,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 182,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 1,
  },
  {
    Year: 2018,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 146,
  },
  {
    Year: 2018,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 76,
  },
  {
    Year: 2018,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 249,
  },
  {
    Year: 2018,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 401,
  },
  {
    Year: 2018,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 12564,
  },
  {
    Year: 2018,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2018,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2018,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 20,
  },
  {
    Year: 2018,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 33,
  },
  {
    Year: 2018,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2017,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1204,
  },
  {
    Year: 2017,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1469,
  },
  {
    Year: 2017,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 1215,
  },
  {
    Year: 2017,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 2100,
  },
  {
    Year: 2017,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2386,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 1414,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 2187,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 732,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 237,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 170,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 1,
  },
  {
    Year: 2017,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 143,
  },
  {
    Year: 2017,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 76,
  },
  {
    Year: 2017,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 246,
  },
  {
    Year: 2017,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 401,
  },
  {
    Year: 2017,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 11773,
  },
  {
    Year: 2017,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2017,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2017,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 10,
  },
  {
    Year: 2017,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 33,
  },
  {
    Year: 2017,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2016,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1194,
  },
  {
    Year: 2016,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1460,
  },
  {
    Year: 2016,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 1079,
  },
  {
    Year: 2016,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 2068,
  },
  {
    Year: 2016,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2359,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 1268,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1984,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 732,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 237,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 166,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 1,
  },
  {
    Year: 2016,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 73,
  },
  {
    Year: 2016,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 76,
  },
  {
    Year: 2016,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 217,
  },
  {
    Year: 2016,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 400,
  },
  {
    Year: 2016,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 10941,
  },
  {
    Year: 2016,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2016,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2016,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 7,
  },
  {
    Year: 2016,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 21,
  },
  {
    Year: 2016,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2015,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1197,
  },
  {
    Year: 2015,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1375,
  },
  {
    Year: 2015,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 944,
  },
  {
    Year: 2015,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1994,
  },
  {
    Year: 2015,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2271,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 1046,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1950,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 728,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 237,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 164,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2015,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 67,
  },
  {
    Year: 2015,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 76,
  },
  {
    Year: 2015,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 197,
  },
  {
    Year: 2015,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 400,
  },
  {
    Year: 2015,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 10551,
  },
  {
    Year: 2015,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2015,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2015,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 7,
  },
  {
    Year: 2015,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 22,
  },
  {
    Year: 2015,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2014,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1199,
  },
  {
    Year: 2014,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1373,
  },
  {
    Year: 2014,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 927,
  },
  {
    Year: 2014,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1957,
  },
  {
    Year: 2014,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2222,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 993,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1950,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 725,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 235,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 163,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2014,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 65,
  },
  {
    Year: 2014,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 76,
  },
  {
    Year: 2014,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 194,
  },
  {
    Year: 2014,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 400,
  },
  {
    Year: 2014,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 9905,
  },
  {
    Year: 2014,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2014,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2014,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 4,
  },
  {
    Year: 2014,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2014,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2013,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1143,
  },
  {
    Year: 2013,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1308,
  },
  {
    Year: 2013,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 879,
  },
  {
    Year: 2013,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1950,
  },
  {
    Year: 2013,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2110,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 896,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1898,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 723,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 235,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 21,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2013,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 40,
  },
  {
    Year: 2013,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 76,
  },
  {
    Year: 2013,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 187,
  },
  {
    Year: 2013,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 399,
  },
  {
    Year: 2013,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 9394,
  },
  {
    Year: 2013,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2013,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2013,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2013,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2013,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2012,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1139,
  },
  {
    Year: 2012,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1313,
  },
  {
    Year: 2012,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 807,
  },
  {
    Year: 2012,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1933,
  },
  {
    Year: 2012,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2058,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 829,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1857,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 596,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 236,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 20,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2012,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 23,
  },
  {
    Year: 2012,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 76,
  },
  {
    Year: 2012,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 167,
  },
  {
    Year: 2012,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 374,
  },
  {
    Year: 2012,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 8764,
  },
  {
    Year: 2012,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2012,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2012,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2012,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2012,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2011,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1138,
  },
  {
    Year: 2011,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1253,
  },
  {
    Year: 2011,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 772,
  },
  {
    Year: 2011,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1917,
  },
  {
    Year: 2011,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 2028,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 741,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1673,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 596,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 235,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 19,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2011,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 24,
  },
  {
    Year: 2011,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 80,
  },
  {
    Year: 2011,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 163,
  },
  {
    Year: 2011,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 377,
  },
  {
    Year: 2011,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 8527,
  },
  {
    Year: 2011,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2011,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2011,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2011,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2011,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2010,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1131,
  },
  {
    Year: 2010,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1240,
  },
  {
    Year: 2010,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 594,
  },
  {
    Year: 2010,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1898,
  },
  {
    Year: 2010,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 1851,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 733,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1288,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 596,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 235,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 19,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2010,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 24,
  },
  {
    Year: 2010,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 80,
  },
  {
    Year: 2010,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 148,
  },
  {
    Year: 2010,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 371,
  },
  {
    Year: 2010,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 8116,
  },
  {
    Year: 2010,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2010,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2010,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2010,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2010,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2009,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1142,
  },
  {
    Year: 2009,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1223,
  },
  {
    Year: 2009,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 469,
  },
  {
    Year: 2009,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1895,
  },
  {
    Year: 2009,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 1414,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 711,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 1036,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 606,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 235,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 18,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2009,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 24,
  },
  {
    Year: 2009,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 82,
  },
  {
    Year: 2009,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 139,
  },
  {
    Year: 2009,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 322,
  },
  {
    Year: 2009,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 7948,
  },
  {
    Year: 2009,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2009,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2009,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2009,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2009,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2008,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1141,
  },
  {
    Year: 2008,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1222,
  },
  {
    Year: 2008,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 423,
  },
  {
    Year: 2008,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1905,
  },
  {
    Year: 2008,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 1275,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 626,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 978,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 606,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 235,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 18,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2008,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 24,
  },
  {
    Year: 2008,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 82,
  },
  {
    Year: 2008,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 139,
  },
  {
    Year: 2008,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 323,
  },
  {
    Year: 2008,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 7904,
  },
  {
    Year: 2008,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2008,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2008,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2008,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2008,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2007,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1094,
  },
  {
    Year: 2007,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1217,
  },
  {
    Year: 2007,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 422,
  },
  {
    Year: 2007,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1808,
  },
  {
    Year: 2007,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 1201,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 623,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 978,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 460,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 5,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 10,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2007,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 23,
  },
  {
    Year: 2007,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 79,
  },
  {
    Year: 2007,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 139,
  },
  {
    Year: 2007,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 321,
  },
  {
    Year: 2007,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 7899,
  },
  {
    Year: 2007,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2007,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 9,
  },
  {
    Year: 2007,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2007,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2007,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 6,
  },
  {
    Year: 2006,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1093,
  },
  {
    Year: 2006,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1206,
  },
  {
    Year: 2006,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 341,
  },
  {
    Year: 2006,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1811,
  },
  {
    Year: 2006,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 1171,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 623,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 975,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 459,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 1,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 10,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2006,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 24,
  },
  {
    Year: 2006,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 80,
  },
  {
    Year: 2006,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 139,
  },
  {
    Year: 2006,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 306,
  },
  {
    Year: 2006,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 7865,
  },
  {
    Year: 2006,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2006,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 0,
  },
  {
    Year: 2006,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2006,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 1,
  },
  {
    Year: 2006,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 0,
  },
  {
    Year: 2004,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1101,
  },
  {
    Year: 2004,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1213,
  },
  {
    Year: 2004,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 304,
  },
  {
    Year: 2004,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 1770,
  },
  {
    Year: 2004,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 800,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 559,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 974,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 429,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 1,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 10,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2004,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 10,
  },
  {
    Year: 2004,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 80,
  },
  {
    Year: 2004,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 140,
  },
  {
    Year: 2004,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 305,
  },
  {
    Year: 2004,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 7796,
  },
  {
    Year: 2004,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2004,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 0,
  },
  {
    Year: 2004,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2004,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 0,
  },
  {
    Year: 2004,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 0,
  },
  {
    Year: 2003,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1130,
  },
  {
    Year: 2003,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1194,
  },
  {
    Year: 2003,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 293,
  },
  {
    Year: 2003,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 157,
  },
  {
    Year: 2003,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 750,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 553,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 967,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 409,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 1,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 10,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 9,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2003,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 10,
  },
  {
    Year: 2003,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 80,
  },
  {
    Year: 2003,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 111,
  },
  {
    Year: 2003,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 304,
  },
  {
    Year: 2003,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 6279,
  },
  {
    Year: 2003,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2003,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 0,
  },
  {
    Year: 2003,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 2,
  },
  {
    Year: 2003,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 0,
  },
  {
    Year: 2003,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 0,
  },
  {
    Year: 2002,
    Kingdom: "Vertebrates",
    Species: "Mammals",
    Total: 1137,
  },
  {
    Year: 2002,
    Kingdom: "Vertebrates",
    Species: "Birds",
    Total: 1192,
  },
  {
    Year: 2002,
    Kingdom: "Vertebrates",
    Species: "Reptiles",
    Total: 293,
  },
  {
    Year: 2002,
    Kingdom: "Vertebrates",
    Species: "Amphibians",
    Total: 157,
  },
  {
    Year: 2002,
    Kingdom: "Vertebrates",
    Species: "Fishes",
    Total: 742,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Insects",
    Total: 557,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Molluscs",
    Total: 939,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Crustaceans",
    Total: 409,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Corals",
    Total: 1,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Arachnids",
    Total: 10,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Velvet worms",
    Total: 6,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Horseshoe crabs",
    Total: 0,
  },
  {
    Year: 2002,
    Kingdom: "Invertebrates",
    Species: "Other invertebrates",
    Total: 10,
  },
  {
    Year: 2002,
    Kingdom: "Plants",
    Species: "Mosses",
    Total: 80,
  },
  {
    Year: 2002,
    Kingdom: "Plants",
    Species: "Ferns & allies",
    Total: 0,
  },
  {
    Year: 2002,
    Kingdom: "Plants",
    Species: "Gymnosperms",
    Total: 142,
  },
  {
    Year: 2002,
    Kingdom: "Plants",
    Species: "Flowering plants",
    Total: 5492,
  },
  {
    Year: 2002,
    Kingdom: "Plants",
    Species: "Green algae",
    Total: 0,
  },
  {
    Year: 2002,
    Kingdom: "Plants",
    Species: "Red algae",
    Total: 0,
  },
  {
    Year: 2002,
    Kingdom: "Fungi & protists",
    Species: "Lichens",
    Total: 0,
  },
  {
    Year: 2002,
    Kingdom: "Fungi & protists",
    Species: "Mushrooms",
    Total: 0,
  },
  {
    Year: 2002,
    Kingdom: "Fungi & protists",
    Species: "Brown algae",
    Total: 0,
  },
];
const chartData = (year) => fullChartData.filter((data) => data.Year === year);

chartOptions = [
  {
    captions: [
      {
        "Fungi & protists": "Fungi & protists",
        Vertebrates: "Vertebrates",
        Invertebrates: "Invertebrates",
        Plants: "Plants",
      },
    ],
    color: [
      {
        "Fungi & protists": "orchid",
        Vertebrates: "darkkhaki",
        Invertebrates: "dodgerblue",
        Plants: "darkgreen",
      },
    ],
    xaxis: "Kingdom",
    xaxisl1: "Species",
    yaxis: "Total",
  },
];
