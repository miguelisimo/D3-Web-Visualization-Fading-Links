/*
@author: Miguel Edlinger
@date: 16.08.2018
@description:
*/
function main() {

    /* Creating the containers */
    var width = 800,
        height = 800;

    /* container for the simulation */
    var svg = d3.select("#simulation").append("svg")
        .attr("width", width)
        .attr("height", height),
      //  width = +svg.attr("width", width),
      //  height = +svg.attr("height", height),
        color = d3.scaleOrdinal(d3.schemeCategory10);

    /* setting of the canvas dimensions  */

    d3.select("#wrapper")
        .style("width", 25 + width * 4 / 3 + "px");


    /* ***************Simulation of KOIN* transactions****************** */

    // drives the simulation process and controls the time of each update
    setInterval(simulate, 2000); // simulation updates each 800ms

    // Some random Users for the simulation
    var nodes = [
        { name: "Adam" },
        { name: "Bob" },
        { name: "Carrie" },
        { name: "Donovan" },
        { name: "Edward" },
        { name: "Felicity" },
        { name: "George" },
        { name: "Hannah" },
        { name: "Iris" },
        { name: "Jerry" },
        { name: "Sherlock" },
        { name: "James" },
        { name: "Alex" },
        { name: "Josef" },
        { name: "Martin" },
        { name: "Chris" },
        { name: "Laura" },

        { name: "terry" },
        { name: "berry" },
        { name: "cherry" },
        { name: "larry" },
        { name: "ben" },
        { name: "usery" },
        { name: "userx" }
    ];
    // Links symbolise transactions between Users (nodes)
    var links = [];

    // defining force attributes for the simulation
    var simulation = d3.forceSimulation(nodes)
        .force("charge", d3.forceManyBody().strength(-500))
        .force("link", d3.forceLink(links).distance(50))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .alphaTarget(1)

    // groups the link and node svg elements
    var g = svg.append("g").attr("transform", "translate(" + width / 1.5 + "," + height /2 + ")"),
        link = g.append("g").attr("stroke", "#000").attr("opacity", 1).selectAll(".link"),
        node = g.append("g").attr("stroke", "#fff").attr("stroke-width", 1.5).selectAll(".node");

    // build the arrow.
    g.append("svg:defs").selectAll("marker")
        .data(["end"])
        .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 18) //  15
        .attr("refY", 0) // -1.5
        .attr("markerWidth", 10)
        .attr("markerHeight", 10)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5")
        .style("stroke", "#ccc");

    // this function creates edges, stores them into the links array,
    // decreases the lifespan of edges and kicks them out if their lifespan is over
    function updateEdges() {

        // this variable is used to control the amount of transaction per cycle
        // var amountOfTransactions =
        // Math.floor(Math.random() * nodes.length); // chose here the amount of transaction per cycle

        var amountOfTransactions = 3;

        for (let x = 0; x < amountOfTransactions; x++) {
            //calc random source & target index
            var sourceIndex = Math.floor(Math.random() * nodes.length);
            var targetIndex = Math.floor(Math.random() * nodes.length);

            //compare until they do not match, in order to prevent self-targeting nodes
            while (sourceIndex == targetIndex) {
                targetIndex = Math.floor(Math.random() * nodes.length);
            }

            var source = nodes[sourceIndex];
            var target = nodes[targetIndex];

            // creates a link with target, source and a lifespan
            links.push({
                source: source, target: target, lifeSpan: 100
            });
            // logging the links to console for debugging purpose
            console.log(links);
        }

        // when lifespan of a link is over it gets removed
        for (let y = 0; y < links.length; y++) {
            if(links[y].lifeSpan) {
                links[y].lifeSpan = links[y].lifeSpan - 10;
                if (links[y].lifeSpan === 0) {
                    links.splice(y, 1);
                }
            }
        }

         /* here gets the restart function called in order to apply general
          update pattern to the created svg elements. */
        restart();
    }

    function restart() {

        // Apply the general update pattern to the nodes.
        node = node.data(nodes, function(d) { return d.id;});
        node.exit().remove();
        node = node.enter().append("circle")
            .attr("fill", function(d) {
                return color(d.id); })
            .attr("r", 8).merge(node);

        // Apply the general update pattern to the links.
        link = link.data(links, function(d) { return d.source.id + "-" + d.target.id; });
        link.exit().remove();
        link = link.enter().append("line").merge(link);

        // decreases the opacity of links in order to apply a "fading"-effect
        link.attr("opacity", function (d) {
            console.log("opacity: " + d.lifeSpan * 0.01);
            return d.lifeSpan * 0.01;
        });

        // attaches the arrowheads to the edges
        link.attr("marker-end", "url(#end)");

        // Update and restart the simulation.
        simulation.nodes(nodes);

        simulation.force("link").links(links);
        simulation.alpha(1).restart();
    }

    // updates the current position of the svg elements each cycle
    function ticked() {
        node.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });
    }

    // ensures the simulation dynamic
    function simulate() {
        updateEdges();
        simulation.on("tick", ticked);
    }

}