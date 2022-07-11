/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 64.83670249188722, "KoPercent": 35.16329750811278};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.028577063919735628, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.009949014122636827, 500, 1500, "Visit page login PI"], "isController": false}, {"data": [0.11052021903959562, 500, 1500, "Log Out-0"], "isController": false}, {"data": [0.08303496208930077, 500, 1500, "Log Out-1"], "isController": false}, {"data": [0.02317542801466153, 500, 1500, "Get Dash Board"], "isController": false}, {"data": [0.004922197523023182, 500, 1500, "Get Dash Board-1"], "isController": false}, {"data": [0.007621467132422992, 500, 1500, "Get Dash Board-0"], "isController": false}, {"data": [0.005812098281442312, 500, 1500, "Login"], "isController": false}, {"data": [0.027496929037135028, 500, 1500, "Login-0"], "isController": false}, {"data": [0.01399812734082397, 500, 1500, "Log Out"], "isController": false}, {"data": [0.04956061608239629, 500, 1500, "Login-1"], "isController": false}, {"data": [0.0, 500, 1500, "Login-2"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 134356, 47244, 35.16329750811278, 6096.386622108398, 0, 30379, 3894.0, 8836.700000000004, 10885.750000000004, 14875.990000000002, 136.2516694774396, 923.5042685999689, 240.51124367544395], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Visit page login PI", 22163, 9136, 41.221856246897985, 6453.577494021561, 490, 25133, 6435.5, 21004.0, 21036.0, 21953.87000000002, 22.47570447637987, 224.62979880483417, 27.893448739817075], "isController": false}, {"data": ["Log Out-0", 9496, 0, 0.0, 4709.424283909035, 272, 23006, 5284.5, 7515.300000000001, 8145.049999999997, 9321.03, 9.67191274908027, 14.696773669500882, 15.924653217723963], "isController": false}, {"data": ["Log Out-1", 9496, 912, 9.604043807919124, 4275.314132266212, 0, 21053, 4701.0, 7553.900000000003, 8034.449999999999, 9488.240000000005, 9.671893046951867, 142.31879256948108, 15.028459915778345], "isController": false}, {"data": ["Get Dash Board", 21553, 9418, 43.69693314155802, 5157.554075998691, 0, 30240, 5448.5, 12475.900000000001, 14558.95, 21050.0, 21.9423896466698, 127.86045101687039, 35.73341522565701], "isController": false}, {"data": ["Get Dash Board-1", 3149, 1154, 36.646554461733885, 4329.143220069853, 0, 10408, 6105.0, 7810.0, 8400.0, 9290.5, 6.717078529452544, 70.76411367732852, 9.756871860368383], "isController": false}, {"data": ["Get Dash Board-0", 3149, 0, 0.0, 6815.362654811047, 615, 22939, 6318.0, 8167.0, 10075.0, 21911.0, 6.702866545054374, 10.185215179789655, 9.8696650888199], "isController": false}, {"data": ["Login", 21937, 12601, 57.441765054474175, 8472.167434015499, 0, 26355, 6690.0, 20571.0, 21108.95, 23229.93000000001, 22.300090066462136, 110.16876490042117, 52.295634751587855], "isController": false}, {"data": ["Login-0", 10583, 0, 0.0, 7392.091845412467, 352, 13899, 7743.0, 10616.6, 11548.8, 12599.48, 10.761873092673325, 17.30011652583846, 17.918939084968766], "isController": false}, {"data": ["Log Out", 21360, 12776, 59.81273408239701, 5497.784082396963, 0, 30379, 5774.0, 13706.700000000004, 15030.900000000001, 20606.390000000418, 21.749091242325196, 172.71964587088004, 49.20927084765199], "isController": false}, {"data": ["Login-1", 10583, 1142, 10.790891051686668, 5349.0930737975905, 0, 12176, 6033.0, 8932.800000000001, 9750.399999999998, 10746.16, 10.765146274972535, 71.30096009639348, 16.528794150145462], "isController": false}, {"data": ["Login-2", 887, 105, 11.837655016910936, 7164.633596392333, 0, 11244, 7893.0, 9583.2, 10036.4, 10505.08, 1.991262689529146, 14.206337580761753, 2.954447621035995], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 33956, 71.8736770806875, 25.27315490190241], "isController": false}, {"data": ["500/Internal Server Error", 13, 0.027516721700110068, 0.00967578671588913], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 6, 0.0127000254000508, 0.004465747715025752], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection refused: connect", 1686, 3.568707137414275, 1.2548751079222364], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 1655, 3.5030903395140123, 1.23180207806127], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection timed out: connect", 3105, 6.572263144526289, 2.311024442525827], "isController": false}, {"data": ["419/unknown status", 6823, 14.442045550757769, 5.078299443270118], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 134356, 47244, "502/Bad Gateway", 33956, "419/unknown status", 6823, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection timed out: connect", 3105, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection refused: connect", 1686, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 1655], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Visit page login PI", 22163, 9136, "502/Bad Gateway", 6726, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection timed out: connect", 1791, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection refused: connect", 527, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 81, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 6], "isController": false}, {"data": [], "isController": false}, {"data": ["Log Out-1", 9496, 912, "502/Bad Gateway", 788, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 120, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection timed out: connect", 3, "500/Internal Server Error", 1, null, null], "isController": false}, {"data": ["Get Dash Board", 21553, 9418, "502/Bad Gateway", 8390, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection refused: connect", 424, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection timed out: connect", 389, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 213, "500/Internal Server Error", 2], "isController": false}, {"data": ["Get Dash Board-1", 3149, 1154, "502/Bad Gateway", 1111, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 43, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": ["Login", 21937, 12601, "502/Bad Gateway", 7985, "419/unknown status", 2946, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection timed out: connect", 768, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 547, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection refused: connect", 352], "isController": false}, {"data": [], "isController": false}, {"data": ["Log Out", 21360, 12776, "502/Bad Gateway", 8016, "419/unknown status", 3877, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection refused: connect", 383, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 345, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to dev.paveinspect.com:443 [dev.paveinspect.com/35.203.102.51] failed: Connection timed out: connect", 154], "isController": false}, {"data": ["Login-1", 10583, 1142, "502/Bad Gateway", 886, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 255, "500/Internal Server Error", 1, null, null, null, null], "isController": false}, {"data": ["Login-2", 887, 105, "502/Bad Gateway", 54, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: dev.paveinspect.com:443 failed to respond", 51, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
