var year = 0;

var input_year = d3
  .select("#year input")
  .on("change", function () {
    year = +this.value;
    let at = geodesic(year, null);
    Plot(year);
    showOutput(year, at);
  })
  .each(function () {
    year = +this.value;
    let at = geodesic(year, null);
    Plot(year);
    showOutput(year, at);
  });

function showOutput(year, at) {
  let yearOutput = d3.select("output");
  if (year == 2005) {
    yearOutput.text("Year = " + year + "\n" + " No Data was found!");
  } else {
    yearOutput.text(
      "Year = " +
        year +
        " \n " +
        "Total Species Assessed = " +
        at[0] +
        " \n " +
        "Total Species Threatened = " +
        at[1]
    );
  }
}
