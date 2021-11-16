const margin = {
        top: 20,
        right: 120,
        bottom: 20,
        left: 120
    },
    width = 1060 - margin.right - margin.left,
    height = 900 - margin.top - margin.bottom;

let i = 0,
    duration = 750,
    root;

const tree = d3.layout.tree()
    .size([height, width]);

const diagonal = d3.svg.diagonal()
    .projection(function (d) {
        return [d.y, d.x];
    });

const svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const flare = {
    "children": [{
        "name": "Vertebrates",
        "children": [{
            "name": "Mammals",
            "level": "level3",
            "assessed": 5954
        },
            {
                "name": "Birds",
                "level": "level3",
                "assessed": 11158
            },
            {
                "name": "Reptiles",
                "level": "level3",
                "assessed": 9132
            },
            {
                "name": "Amphibians",
                "level": "level3",
                "assessed": 7215
            },
            {
                "name": "Fishes",
                "level": "level3",
                "assessed": 22349
            }
        ],
        "level": "level2",
        "assessed": 55808
    },
        {
            "name": "Invertebrates",
            "children": [{
                "name": "Insects",
                "level": "level3",
                "assessed": 11480
            },
                {
                    "name": "Molluscs",
                    "level": "level3",
                    "assessed": 8934
                },
                {
                    "name": "Crustaceans",
                    "level": "level3",
                    "assessed": 3189
                },
                {
                    "name": "Corals",
                    "level": "level3",
                    "assessed": 863
                },
                {
                    "name": "Arachnids",
                    "level": "level3",
                    "assessed": 393
                },
                {
                    "name": "Velvet worms",
                    "level": "level3",
                    "assessed": 11
                },
                {
                    "name": "Horseshoe crabs",
                    "level": "level3",
                    "assessed": 4
                },
                {
                    "name": "Other invertebrates",
                    "level": "level3",
                    "assessed": 887
                }
            ],
            "level": "level2",
            "assessed": 25761
        },
        {
            "name": "Plants",
            "children": [{
                "name": "Mosses",
                "level": "level3",
                "assessed": 282
            },
                {
                    "name": "Ferns & allies",
                    "level": "level3",
                    "assessed": 728
                },
                {
                    "name": "Gymnosperms",
                    "level": "level3",
                    "assessed": 1016
                },
                {
                    "name": "Flowering plants",
                    "level": "level3",
                    "assessed": 54145
                },
                {
                    "name": "Green algae",
                    "level": "level3",
                    "assessed": 16
                },
                {
                    "name": "Red algae",
                    "level": "level3",
                    "assessed": 58
                }
            ],
            "level": "level2",
            "assessed": 56245
        },
        {
            "name": "Fungi & protists",
            "children": [{
                "name": "Lichens",
                "level": "level3",
                "assessed": 76
            },
                {
                    "name": "Mushrooms",
                    "level": "level3",
                    "assessed": 469
                },
                {
                    "name": "Brown algae",
                    "level": "level3",
                    "assessed": 15
                }
            ],
            "level": "level2",
            "assessed": 560
        }
    ],
    "name": "Grand Total",
    "assessed": 138374
};

    // var flare;
    // window.onload = function(){
    //     console.log("Hello World!");
    //     loadData("heirarchy.json");
    // };
    //
    // function loadData(path) {
    //     d3.json(path).then(function (data) {
    //         console.log(data);
    //         flare = data;
    //     });
    // }

root = flare;
root.x0 = height / 2;
root.y0 = 0;

function update(source) {

    // Compute the new tree layout.
    const nodes = tree.nodes(root).reverse(),
        links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function(d) {
        d.y = d.depth * 180;
    });

    // Update the nodes…
    const node = svg.selectAll("g.node")
        .data(nodes, function (d) {
            return d.id || (d.id = ++i);
        });

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
            return "translate(" + source.y0 + "," + source.x0 + ")";
        })
        .on("click", click)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);

    nodeEnter.append("circle")
        .attr("r", 1e-6)
        .style("fill", function(d) {
            return d._children ? "lightsteelblue" : "#fff";
        });

    nodeEnter.append("text")
        .attr("x", function(d) {
            return d.children || d._children ? -30 : 10;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) {
            return d.children || d._children ? "end" : "start";
        })
        .text(function(d) {
            return d.name;
        })
        .style("fill-opacity", 1e-6);

    // Transition nodes to their new position.
    const nodeUpdate = node.transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + d.y + "," + d.x + ")";
        });

    nodeUpdate.select("circle")
        .attr("r", 30)
        .style("fill", function(d) {
            return d._children ? "deepskyblue" : "skyblue";
        });

    nodeUpdate.select("text")
        .style("fill-opacity", 10);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function (d) {
            return "translate(" + source.y + "," + source.x + ")";
        })
        .remove();

    nodeExit.select("circle")
        .attr("r", 1e-6);

    nodeExit.select("text")
        .style("fill-opacity", 1e-6);

    // Update the links…
    const link = svg.selectAll("path.link")
        .data(links, function (d) {
            return d.target.id;
        });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
        .attr("class", "link")
        .attr("d", function(d) {
            const o = {
                x: source.x0,
                y: source.y0
            };
            return diagonal({
                source: o,
                target: o
            });
        });

    // Transition links to their new position.
    link.transition()
        .duration(duration)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
        .duration(duration)
        .attr("d", function(d) {
            const o = {
                x: source.x,
                y: source.y
            };
            return diagonal({
                source: o,
                target: o
            });
        })
        .remove();

    // Stash the old positions for transition.
    nodes.forEach(function(d) {
        d.x0 = d.x;
        d.y0 = d.y;
    });
}

// Toggle children on click.
function click(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update(d);
}

function mouseover(d) {
    d3.select(this).append("text")
        .attr("class", "hover")
        .attr('transform', function(d) {
            return 'translate(5, -10)';
        })
        .text(d.name + ": " + d.assessed);
}

// Toggle children on click.
function mouseout(d) {
    d3.select(this).select("text.hover").remove();
}

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = null;
    }
}

root.children.forEach(collapse);
update(root);

d3.select(self.frameElement).style("height", "800px");
