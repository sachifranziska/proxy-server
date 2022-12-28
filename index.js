const express = require("express")
const app = express()
const { createProxyMiddleware } = require("http-proxy-middleware")
const rateLimit = require("express-rate-limit")
require("dotenv").config()
// const url = require("url")　URLのパラメーターを取得

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000,
})

// このプロキシサーバーすべてのURLに適用する場合は以下
// app.use(limiter)

// Getリクエスト、このコードのURL、ブラウザからのリクエスト、ブラウザへのレスポンス
app.get("/", (req, res) => {
  // console.log(req.url)
  // const params = url.parse(req.url).query URLを文字列に変換、URLのパラメーターを取得
  // console.log(params)
  res.send("This is my proxy server")
})

//個別のURLにのみ適用する場合は以下 
app.use("/corona-tracker-world-data", limiter, (req, res, next) => {
  createProxyMiddleware({
    // envファイルの情報を参照する（process）
    target: process.env.BASE_API_URL_CORONA_WORLD,
    changeOrigin: true,
    pathRewrite: {
      [`^/corona-tracker-world-data`]: "",
    },
  })(req, res, next)
})

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

module.exports = app