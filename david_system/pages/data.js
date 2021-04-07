import { csvParse } from "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData() {
    return function(d) {
        var parseTime = timeParse("%H:%M:%S.%L");
        d.date = parseTime(d.time);
        d.open = +d.open;
        d.high = +d.high;
        d.low = +d.low;
        d.close = +d.close;
        d.volume = +d.vol;
        return d;
    };
}

const parseDate = timeParse("%Y-%m-%d");

export function getData() {
    const output = fetch("/0303.csv")
        .then((response) => response.text())
        .then((data) => csvParse(data, parseData()))
    return output;
}