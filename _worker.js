const TELEGRAPH_URL = 'https://api.openai.com';
const page = `
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta charset="UTF-8">
    <title>ChatGPT-Proxy</title>
    <meta name="viewport" content="width=device-width, maximum-scale=1, initial-scale=1"/>
    <style>
        html, body{
            height: 100%;
        }

        body{
            color: #333;
            margin: auto;
            padding: 1em;
            display: table;
            box-sizing: border-box;
            font: lighter 20px "微软雅黑";
        }
        a{
            color: #3498db;
            text-decoration: none;
        }
        h1{
            margin-top: 0;
            font-size: 3.5em;
        }
        main{
            margin: 0 auto;
            text-align: center;
            display: table-cell;
            vertical-align: middle;
        }

        .btn{
            color: #fff;
            padding: .75em 1em;
            background: #3498db;
            border-radius: 1.5em;
            display: inline-block;
            transition: opacity .3s, transform .3s;
        }
        .btn:hover{
            transform: scale(1.1);
        }
        .btn:active{
            opacity: .7;
        }
    </style>
</head>
<body>
<main>
    <h1>ChatGPT Proxy</h1>
    <p>基于 CloudFlare Pages 部署的 ChatGPT 代理服务。</p>
    <p>ChatGPT proxy service deployed on CloudFlare Pages.</p>
    <p>将 https://api.openai.com 替换成 <strong>https://chatgptproxyapi-cf.pages.dev</strong> 即可体验。</p>
</main>
</body>
</html>

`

export default {
    async fetch(request, env) {
        const NewResponse = await handleRequest(request)
        return NewResponse
    },

};

async function handleRequest(request) {
    const url = new URL(request.url);
    //  路径
    if (url.pathname == "/") {
        return new Response(page, {
            headers: {
                "content-type": "text/html;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Methods": "*",
            },
        })
    }
    else {
        const headers_Origin = request.headers.get("Access-Control-Allow-Origin") || "*"
        url.host = TELEGRAPH_URL.replace(/^https?:\/\//, '');
        const modifiedRequest = new Request(url.toString(), {
            headers: request.headers,
            method: request.method,
            body: request.body,
            redirect: 'follow'
        });
        const response = await fetch(modifiedRequest);
        const modifiedResponse = new Response(response.body, response);
        // 添加允许跨域访问的响应头
        modifiedResponse.headers.set('Access-Control-Allow-Origin', headers_Origin);
        return modifiedResponse;
    }

}

