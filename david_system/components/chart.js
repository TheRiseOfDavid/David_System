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
import { fitWidth } from "react-stockcharts/lib/helper";
import { last } from "react-stockcharts/lib/utils";

class CandleStickChartWithCHMousePointer extends React.Component {
  //K線圖並可以使用滑鼠操作
  render() {
    const { type, data: initialData, width, ratio } = this.props;

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      (d) => d.date
    ); //提供 x 刻度
    console.log(initialData);
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      initialData
    ); //包甚麼內容

    const start = xAccessor(last(data)); //這裡的 last 有甚麼意思(?
    const end = xAccessor(data[Math.max(0, data.length - 150)]); //為甚麼要減 150
    const xExtents = [start, end];

    return (
      <ChartCanvas
        height={400}
        ratio={ratio * 0.04}
        width={width}
        margin={{ left: 70, right: 70, top: 10, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart id={1} yExtents={[(d) => [d.high, d.low]]}>
          {/* js function 中的中框號意思是甚麼，這裡是二維陣列的 list 嗎?， id 是 class 的 id 嗎? */}
          <XAxis axisAt="bottom" orient="bottom" />
          <YAxis axisAt="right" orient="right" tick={5} />
          {/* tick 5 的意思? 粗度嗎 */}
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />
          {/* 這樣就能收的到資料嗎? */}
          <CandlestickSeries /> {/* 表示下面都是 k 線圖 */}
          <OHLCTooltip forChart={1} origin={[-40, 0]} />
          {/* 告訴你 info 的位置，但為甚麼是 -40 */}
        </Chart>
        <Chart
          id={2}
          height={150}
          yExtents={(d) => d.volume}
          origin={(w, h) => [0, h - 150]}
        >
          {/* 不太懂這邊的座標意思 origin */}
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
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
  width: PropTypes.number.isRequired,
  ratio: PropTypes.number.isRequired,
  type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChartWithCHMousePointer.defaultProps = {
  type: "svg",
};

CandleStickChartWithCHMousePointer = fitWidth(
  CandleStickChartWithCHMousePointer
);

export default CandleStickChartWithCHMousePointer;
