const express = require("express")
const app = express()
const { createProxyMiddleware } = require("http-proxy-middleware")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
//URLのパラメーターを取得
const url = require("url")

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
})

// このプロキシサーバーすべてのURLに適用する場合は以下
// app.use(limiter)

// Getリクエスト、このコードのURL、ブラウザからのリクエスト、ブラウザへのレスポンス
app.get("/", (req, res) => {
  res.send("This is my proxy server")
})

//個別のURLにのみ適用する場合は以下 

// app.use("/corona-tracker-world-data", limiter, (req, res, next) => {
//   createProxyMiddleware({
//     target: process.env.BASE_API_URL_CORONA_WORLD,
//     changeOrigin: true,
//     pathRewrite: {
//       [`^/corona-tracker-world-data`]: "",
//     },
//   })(req, res, next)
// })

app.use("/weather-data", (req, res, next) => {
  // URLを文字列に変換、URLのパラメーターを取得
  const city = url.parse(req.url).query
  createProxyMiddleware({
    // envファイルの情報を参照する（process）
    target: `${process.env.BASE_API_URL_WEATHERAPI}${city}&api=no`,
    changeOrigin: true,
    pathRewrite: {
      [`^/weather-data`]: "",
    },
  })(req, res, next)
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

module.exports = app