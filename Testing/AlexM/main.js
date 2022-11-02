

function plot(graph, chart) {
        var figure = JSON.parse(graph)
        Plotly.newPlot(chart, figure, {});
}