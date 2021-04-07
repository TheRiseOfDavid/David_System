import {tsvParse, csvParse} from "d3-dsv";
import {timeParse} from "d3-time-format";

var parseTime = timeParse("%Y/%m/%d %H:%M:%S.%L");

export function parseData(d) {
    d.date = parseTime(d.date + ' ' + d.time);
    d.open = +d.open;
    d.high = +d.high;
    d.low = +d.low;
    d.close = +d.close;
    d.volume = +d.vol;
    return d;
}

export function getData(){
    const info = fetch("/csv/0303.csv")
        .then((response) => response.text())
        .then((data) => csvParse(data, parseData))
    return info;
}
