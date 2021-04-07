import React, { useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar'; //頭像
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel'; //控制表單的標籤
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper'; //紙張的感覺
import Box from '@material-ui/core/Box'; //封裝零件
import Grid from '@material-ui/core/Grid'; //margin 控制格子與格子的分散
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'; //Material 內建 Icons
import Typography from '@material-ui/core/Typography'; //文字設計
import { makeStyles } from '@material-ui/core/styles';
import { BottomNavigation } from '@material-ui/core';
import * as d3 from 'd3'
import * as techan from 'techan-js'
// @ts-ignore

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh', //視覺化的百分比
    },
    background: {
        height: '100vh', //視覺化的百分比
        backgroundColor: theme.palette.text.primary, //theme.palette.type 調背景顏色
        backgroundSize: 'cover', //最大覆蓋頁面
        backgroundPosition: 'center', //定位在中間   
    },
    image: {
        backgroundColor: theme.palette.text.primary, //theme.palette.type 調背景顏色
        backgroundSize: 'cover', //最大覆蓋頁面
        backgroundPosition: 'center', //定位在中間
    },
    paper: { //背景質感
        margin: theme.spacing(8, 4), //間距 8 * 4
        display: 'flex', //flex 方式排版
        flexDirection: 'column', //以直排表示 column
        alignItems: 'center', //置中排版
    },
    avatar: { //頭像
        margin: theme.spacing(1), //間距 1
        backgroundColor: theme.palette.secondary.main, //調色顏色
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export default function Home() {
    const classes = useStyles();

    useEffect(() => {
        var margin = { top: 20, right: 20, bottom: 30, left: 50 },
            width = 1080 - margin.left - margin.right,
            height = 720 - margin.top - margin.bottom;

        var parseDate = d3.timeParse("%d-%b-%y");
        var parseTime = d3.timeParse("%H:%M:%S.%L")

        var x = techan.scale.financetime()
            .range([0, width]);

        var y = d3.scaleLinear()
            .range([height, 0]);

        var zoom = d3.zoom()
            .on("zoom", zoomed);

        var zoomableInit;

        var candlestick = techan.plot.candlestick()
            .xScale(x)
            .yScale(y);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        var container = d3.select("#candle-ticks-chart")
        
        container.selectAll("*").remove();

        var svg = container.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", 0)
            .attr("y", y(1))
            .attr("width", width)
            .attr("height", y(0) - y(1));

        svg.append("g")
            .attr("class", "candlestick")
            .attr("clip-path", "url(#clip)");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")");

        svg.append("g")
            .attr("class", "y axis")
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");

        svg.append("rect")
            .attr("class", "pane")
            .attr("width", width)
            .attr("height", height)
            .call(zoom);

        var result = d3.csv("/csvs/0303.csv", function (error, data) {
            var accessor = candlestick.accessor();

            data = data.slice(0, ).map(function (d) {
                return {
                    date: parseTime(d.time),
                    //time: parseTime(d.time), //doen't work
                    open: +d.open,
                    high: +d.high,
                    low: +d.low,
                    close: +d.close,
                    volume: +d.vol
                };
            }).sort(function (a, b) { return d3.ascending(accessor.d(a), accessor.d(b)); });

            x.domain(data.map(accessor.d));
            y.domain(techan.scale.plot.ohlc(data, accessor).domain());

            svg.select("g.candlestick").datum(data);
            draw();

            // Associate the zoom with the scale after a domain has been applied
            // Stash initial settings to store as baseline for zooming
            zoomableInit = x.zoomable().clamp(false).copy();
        });

        function zoomed() {
            var rescaledY = d3.event.transform.rescaleY(y);
            yAxis.scale(rescaledY);
            candlestick.yScale(rescaledY);

            // Emulates D3 behaviour, required for financetime due to secondary zoomable scale
            x.zoomable().domain(d3.event.transform.rescaleX(zoomableInit).domain());

            draw();
        }

        function draw() {
            svg.select("g.candlestick").call(candlestick);
            // using refresh method is more efficient as it does not perform any data joins
            // Use this if underlying data is not changing
            //        svg.select("g.candlestick").call(candlestick.refresh);
            svg.select("g.x.axis").call(xAxis);
            svg.select("g.y.axis").call(yAxis)
        }

    }, []);

    return (
        <Grid container component="main" >
            <CssBaseline />
            <Grid id="candle-ticks-chart" className={"candleTicksChart"} item xs={false} sm={4} md={7} >
            </Grid>
        </Grid>
    )
}