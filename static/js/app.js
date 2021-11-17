
// Create file path to json file and a variable to hold data loaded
var filePath = "resources/samples.json";
// Read sample.json using D3 and store in sampleData
d3.json(filePath).then(data => {
    console.log(data);
    var dropDownSample = d3.select("#selDataset");
    data.names.forEach(item => {
                                    dropDownSample.append("option")
                                                  .text(item)
                                                  .property("value");
                                                         });
    // Reset page with the selected value
    barChart(data.names[0]);
    metaDataBox(data.names[0]);
    bubbleChart(data.names[0]);
    gaugeChart(data.names[0]);

});

// When DOM changes:
function optionChanged(selId) {
    barChart(selId);
    metaDataBox(selId);
    bubbleChart(selId);
    gaugeChart(selId);
};

// Demographic Box
function metaDataBox(selId) { 
    d3.json(filePath).then(data => {
        var selSample = data.metadata.filter(item => 
                        item.id.toString() === selId)[0];
        var demoPanel = d3.select("#sample-metadata");
        demoPanel.html("");
        Object.entries(selSample).forEach(([key, value]) => {
            var demoDiplay = (`${key}: ${value}`);
            demoPanel.append('p').text(demoDiplay);
        })
    });                                                
};


// Horizontal bar chart
function barChart(selId) {
    d3.json(filePath).then(data => {
    var selSampleValues = data.samples.filter(sample => sample.id === selId)[0];
    var otuValues = selSampleValues.sample_values;
    var otuLabels = selSampleValues.otu_labels;
    var otuIds = selSampleValues.otu_ids;
    var traceBar = [{
        x: otuValues.slice(0, 10).reverse(),
        y: otuIds.map(ID => `OTU ${ID}`).slice(0, 10).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h"
    }];
    var layoutBar = {
        title: {
            text: `Sample No. ${selId}'s Top 10 Operational Taxonomic Units (OTU)`,
            font: {
                size: 20,
                color: "darkgray"
            }
        }
    };
    Plotly.newPlot('bar', traceBar, layoutBar);
    });
};

// Bubble chart
function bubbleChart(selId) {
    d3.json("resources/samples.json").then(function(data) {
    var selSampleValues = data.samples.filter(sample => selId === sample.id.toString())[0];
    var otuValues = selSampleValues.sample_values;
    var otuLables = selSampleValues.otu_lables;
    var otuIds = selSampleValues.otu_ids;

    var traceBubble = [{
        x: otuIds,
        y: otuValues,
        text: otuLables,
        mode: "markers",
        marker: {
            color: otuIds,
            opacity: 0.5,
            size: otuValues,
            line: {
                color: "black",
                width: 1,
            }
        }

    }];
    var layoutBubble = {
        title: {
            text: `Sample No. ${selId}'s Operational Taxonomic Units (OTU) Volume and Spread`,
            font: {
                size: 20,
                color: "darkgray"
            }
        },
        showlegend: false,
        xaxis: {
            zeroline: true,
            showticklabels: true,
            showgrid: true,
            title: "OTU ID"
        }
    };
    Plotly.newPlot('bubble', traceBubble, layoutBubble);
    });
};

// Gauge Chart (BONUS!!!)
function gaugeChart(selId) {
    d3.json(filePath).then(function(data) {
    var selSampleValues = data.metadata.filter(sample => sample.id.toString() === selId);
    var washFreq = selSampleValues[0].wfreq;

    var traceGauge = [{
        domain: { x: [0, 1], y: [0, 1]},
        type: 'indicator',
        mode: "gauge+number",
        value: washFreq,
        title: { text: `Sample No. ${selId} Belly Button Weekly Washing Frequency <br>Scrubs per Week`},
        gauge: {
            axis: { range: [null, 9]},
            bar: { color: "#ff8457"},
            steps: [
                { range: [0,1], color: "#d2fbfb"},
                { range: [1,2], color: "#d4f3fa"},
                { range: [2,3], color: "#d6ebf8"},
                { range: [3,4], color: "#d8e3f6"},
                { range: [4,5], color: "#dadbf4"},
                { range: [5,6], color: "#dcd3f2"},
                { range: [6,7], color: "#decbf1"},
                { range: [7,8], color: "#e0c3ef"},
                { range: [8,9], color: "#e2bbed"}
            ],
        },
    }];
    var layoutGauge = {
        width: 450,
        height: 350,
    };
    Plotly.newPlot('gauge', traceGauge, layoutGauge);
    });
};



