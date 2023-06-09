const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const corsAnywhere = require('cors-anywhere');

const app = express();
const port = 8080;

const proxy = createProxyMiddleware({
    target: '',
    router: (req) => req.url.slice(1),
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        corsAnywhere.onProxyReq(proxyReq, req, res);
    },
    onProxyRes: (proxyRes, req, res) => {
        corsAnywhere.onProxyRes(proxyRes, req, res);
    },
});

app.use('/', proxy);

app.listen(port, () => {
    console.log(`CORS proxy server running on http://localhost:${port}`);
});
