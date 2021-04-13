import React from "react";
import PropTypes from "prop-types"; //對型別進行檢查

import { format } from "d3-format"; //資料格式
import { timeFormat } from "d3-time-format"; //時間格式

import { ChartCanvas, Chart } from "react-stockcharts"; //股票圖表、畫表
import { BarSeries, CandlestickSeries } from "react-stockcharts/lib/series"; //畫棒子、K棒
import { XAxis, YAxis } from "react-stockcharts/lib/axes"; //X Y 角度
import {
  CrossHairCursor, //十字線
  MouseCoordinateX, //X 的位置
  MouseCoordinateY, //Y 的位置
} from "react-stockcharts/lib/coordinates";

import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale"; //根據比例縮放，而非跟著數值
import { OHLCTooltip } from "react-stockcharts/lib/tooltip";
import { fitDimensions } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

import { ema } from "react-stockcharts/lib/indicator";
import { HoverTooltip } from "react-stockcharts/lib/tooltip";

const formatToTimeText = timeFormat("%H:%M:%S.%L")
const numberFormat = format(".2f");

// xAccessor 讀刻度的函數
const tooltipContent = (yCursors) => {
  return({currentItem, xAccessor: accessX }) => {
    return{
      x:  formatToTimeText(accessX(currentItem)),
      y: [
        // {
        //   label: "open",
        //   value: currentItem.open && numberFormat(currentItem.open)
        // },
        { label: "high",
          value: currentItem.open && numberFormat(currentItem.high)
        },
        {
          label: "low",
          value: currentItem.low && numberFormat(currentItem.low)
        },
        // {
        //   label: "close",
        //   value: currentItem.close && numberFormat(currentItem.close)
        // },
        {
          label: "vol",
          value: currentItem.close && numberFormat(currentItem.volume)
        }
      ].concat(
        yCursors
          .map((yCursor) => ({ ...yCursor, value: yCursor.value(currentItem) }))
          .filter((yCursor) => yCursor.value)
      )
    }
  }
}

class CandleStickChartWithCHMousePointer extends React.Component {
  //K線圖並可以使用滑鼠操作
  render() {
    const { type, data: initialData, width, height, ratio } = this.props;
    console.log(this.props);

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => d.date
    ); //提供 x 刻度

    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    ); //包甚麼內容

    const start = xAccessor(last(data)); //這裡的 last 有甚麼意思(?
    const end = xAccessor(data[Math.max(0, data.length - 150)]); //為甚麼要減 150
    const xExtents = [start, end];
    
    const gridHeight = height;
    const gridWidth = width;

    // grid 格線
    const showGrid = true;
    const yGrid = showGrid ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.2 } : {};
    const xGrid = showGrid ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.2 } : {};

		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {
				d.ema20 = c;
			})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => {
				d.ema50 = c;
			})
			.accessor(d => d.ema50);

    return (
      <ChartCanvas
        height={400}
        ratio={ratio * 0.04}
        width={width}
        height={height}
        margin={{ left: 70, right: 70, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart id={1} 
          yExtents={[(d) => [d.high, d.low]]} 
          height={height-200}  /* 這裡的 height 比下面多 50 是因為要分格兩張表格 */
          origin={(w, h) => [0, 0 ]} /*origin 從左上開始畫圖 */
          padding={{top:15, bottom:10}}
        >
          <YAxis axisAt="right" orient="right" tick={5} />
          <MouseCoordinateY
            at="right" 
            orient="right"
            displayFormat={format(".2f")}
          />
          {/* 這樣就能收的到資料嗎? */}
          <CandlestickSeries /* 表示下面都是 k 線圖 */ /> 
          <OHLCTooltip forChart={1} origin={[-40, 0]} /*title*/ />
          <HoverTooltip
						tooltipContent={tooltipContent([])}
						fontSize={15}
					/>
        </Chart>
        <Chart
          id={2}
          height={150}
          yExtents={(d) => d.volume}
          origin={(w, h) => [0, h - 150 ]} /*origin，從左上座標 */
          padding={{top:10, bottom:10}}
        >
          <XAxis axisAt="bottom" orient="bottom" {...xGrid}/>
          
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
            {...yGrid}
          />
          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%H:%M:%S.%L")}
          />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
          />
          <BarSeries
            yAccessor={(d) => d.volume}
            fill={(d) => (d.close > d.open ? "#FF0000" : "#6BA583")}
          />
        </Chart>
        <CrossHairCursor />
        {/* 這樣就可以有十字線嗎?，太強了八，千萬記住，不可以把註解寫在後面 */}
      </ChartCanvas>
    );
  }
}

CandleStickChartWithCHMousePointer.PropTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithCHMousePointer.defaultProps = {
  type: "svg",
};

CandleStickChartWithCHMousePointer = fitDimensions(
  CandleStickChartWithCHMousePointer
);

export default CandleStickChartWithCHMousePointer;
