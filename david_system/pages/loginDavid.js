import React from "react";
import Avatar from "@material-ui/core/Avatar"; //頭像
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel"; //控制表單的標籤
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper"; //紙張的感覺
import Box from "@material-ui/core/Box"; //封裝零件
import Grid from "@material-ui/core/Grid"; //margin 控制格子與格子的分散
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"; //Material 內建 Icons
import Typography from "@material-ui/core/Typography"; //文字設計
import { makeStyles } from "@material-ui/core/styles";

function CopyRight() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {" "}
      {/*  variant 應用主題文字模式 */} {"CopyRight "}
      <Link color="inherit" href="https://material-ui.com/">
        {" "}
        我的網頁{" "}
      </Link>
      {new Date().getFullYear()} {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh", //視覺化的百分比
  },
  image: {
    backgroundImage: "url(https://source.unsplash.com/random)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900], //theme.palette.type 調背景顏色
    backgroundSize: "cover", //最大覆蓋頁面
    backgroundPosition: "center", //定位在中間
  },
  paper: {
    //背景質感
    margin: theme.spacing(8, 4), //間距 8 * 4
    display: "flex", //flex 方式排版
    flexDirection: "column", //以直排表示 column
    alignItems: "center", //置中排版
  },
  avatar: {
    //頭像
    margin: theme.spacing(1), //間距 1
    backgroundColor: theme.palette.secondary.main, //調色顏色
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

// q1: grid 的 xs md 中小型怎麼分
export default function LoginPage() {
  const classes = useStyles();
  return (
    <Grid container component="main" className={classes.root}>
      {" "}
      {/* className 會直接複製整個 class */}
      <CssBaseline /> {/* 下方都是 css */}
      <Grid item xs={false} sm={4} md={7} className={classes.image} />{" "}
      {/* xs = 小型設備網格數 sm = 間距 md = 中型設備網格數 */}
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        {" "}
        {/* elevation = 陰影 square 使用圓角 */} {/*q2 這裡有語法糖嗎? */}
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon /> {/* materialUI 內建 icon 上鎖的意思 */}
          </Avatar>
          <Typography component="h1" variant="h5">
            {" "}
            {/*  variant 應用主題文字模式 */}
            登入
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
            />

            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="密碼"
              label="password"
              type="password"
              id="password"
              autoComplete="current-password" //autoComplete 擁有提示功能
            />

            <FormControlLabel
              control={<Checkbox value="remeber" color="primary" />}
              label="記住我"
              // value 是 remeber 是為甚麼
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              登入
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  忘記密碼 ?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {" "}
                  {"沒有帳號嗎? 註冊"}
                </Link>
              </Grid>
            </Grid>
          </form>
          <Box mt={5}>
            <CopyRight />
          </Box>
        </div>
      </Grid>
    </Grid>
  );
}
