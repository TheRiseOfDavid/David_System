import React, { useEffect, useState } from 'react';
import { render } from 'react-dom';
import StockChart from '../components/chart'; //為甚麼會這裡會是 大寫的 Chart
import { getData, parseData } from "../components/utils";
import Grid from "@material-ui/core/Grid";
import { csvParse } from "d3-dsv";
import { TypeChooser } from "react-stockcharts/lib/helper";

/** @type {React.FC} */
const ChartComponent = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState([]);

    useEffect(() => {
        getData().then(setData)
    }, []);

    useEffect(() => {
        if (!file) {
            return;
        }

        const fileReader = new FileReader();

        fileReader.onload = function () {
            const csvText = fileReader.result;
            const data = csvParse(csvText, parseData);
            setData(data);
        };

        fileReader.readAsText(file);
    }, [file]);

    if (data.length == 0) {
        return <div>Loading...</div>
    }

    return(
        <Grid>
             <Grid>
                <StockChart data={data} />
             </Grid>
             <Grid>
                <input type="file" onChange={(event) => setFile(event.target.files[0])} />
             </Grid>
        </Grid>
    );
};

export default ChartComponent;
