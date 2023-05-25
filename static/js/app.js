const samples = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(samples).then(function (data) {
    // define function to dynamically generate the list of test subject IDs
    let dropDownElement = document.getElementById("selDataset");
    let testSubjectIds = data.names;

    for (let testSubjectId of testSubjectIds) {
        let optionElement = document.createElement("option");
        // <option></option>
        optionElement.setAttribute("value", testSubjectId);
        // <option value="940"></option>
        optionElement.text = testSubjectId;
        // <option value="940">940</option>
        dropDownElement.append(optionElement);
    }

    // On change to the DOM, call createData()
    d3.selectAll("#selDataset").on("change", createGraphs);

    // display default plot
    createGraphs();

    function createGraphs() {
        let dropdownMenu = d3.select("#selDataset");
        let testSubjectId = dropdownMenu.property("value");
        let testSubjectData = data.samples.filter(object => object.id === testSubjectId)[0];
        let testSubjectMetaData = data.metadata.filter(object => object.id.toString() === testSubjectId)[0];
        let otuIds = testSubjectData.otu_ids;
        let sampleValues = testSubjectData.sample_values;
        let otuLabels = testSubjectData.otu_labels;
        let slicedOtuIds = otuIds.slice(0, 10);
        let slicedSampleValues = sampleValues.slice(0, 10);
        let slicedOtuLabels = otuLabels.slice(0, 10);

        let barChartValues = {
            x: slicedSampleValues.reverse(),
            y: slicedOtuIds.map(otuId => `OTU ${otuId}`).reverse(),
            text: slicedOtuLabels,
            type: "bar",
            orientation: "h"
        };

        // Apply a title to the layout
        let barChartLayout = {
            title: "Top Ten OTUs per Sample ID",
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bar", [barChartValues], barChartLayout);

        //bubble chart here
        let bubbleChartValues = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
            }
        };

        let bubbleChartLayout = {
            title: "All OTUs per Sample ID",
            xaxis: {
                title: {
                    text: "OTU ID"
                }
            },
            yaxis: {
                title: {
                    text: "SAMPLE VALUE"
                }
            },
            margin: {
                l: 100,
                r: 100,
                t: 100,
                b: 100
            }
        };

        Plotly.newPlot("bubble", [bubbleChartValues], bubbleChartLayout);

        //demographic info
        // {"id": 940, "ethnicity": "Caucasian", "gender": "F", "age": 24.0, "location": "Beaufort/NC", "bbtype": "I", "wfreq": 2.0}, 
        let sampleMetaDataElement = document.getElementById("sample-metadata");
        sampleMetaDataElement.innerHTML = "";
        for (let key in testSubjectMetaData) {
            let value = testSubjectMetaData[key];
            let paragraphElement = document.createElement("p");
            paragraphElement.innerText = `${key}: ${value}`;
            sampleMetaDataElement.append(paragraphElement);
        }
    }


});

