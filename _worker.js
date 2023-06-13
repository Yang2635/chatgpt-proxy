const TELEGRAPH_URL = 'https://api.openai.com';
const page = `
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
 <head> 
  <meta charset="UTF-8" /> 
  <title>ChatGPT API Proxy</title> 
  <meta name="viewport" content="width=device-width, maximum-scale=1, initial-scale=1" /> 
  <!-- import element-ui CSS --> 
  <link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css" /> 
  <!-- import Vue before Element --> 
  <script src="https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.js"></script> 
  <!-- import element-ui JavaScript --> 
  <script src="https://unpkg.com/element-ui/lib/index.js"></script> 
  <style>
  html, body{
    height: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  body{
    color: #333;
    margin: 0;
    padding: 0;
	user-select: none;
    font: lighter 20px "微软雅黑";
  }
  
  p {
    margin-bottom: 0px;
  }

  main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    padding: 0 1em;
    box-sizing: border-box;
  }

  footer {
    width: 100%;
    margin: auto auto 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1em;
    box-sizing: border-box;
    flex-direction: column;
    margin-top: auto;
    padding-bottom: 20px;
  }

  footer p {
    font-size: 1rem;
  }

  h1{
    margin-top: 0;
    font-size: 3.5em;
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

  a {
    color: #0077cc;
    text-decoration: none;
    background-color: #f0f0f0;
    padding: 3px 6px;
    border-radius: 3px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.1);
  }

  a:hover {
    background-color: #ddd;
  }
</style>

</head> 
<body> 
  <div style="display: flex; flex-direction: column; height: 100%;">
    <main style="flex-grow: 1;">
      <h1>ChatGPT API Proxy</h1> 
      <p>基于 CloudFlare Pages 部署的 ChatGPT API 代理服务。</p> 
      <p>ChatGPT API Proxy service deployed on CloudFlare Pages.</p> 
      <div id="app"> 
        <p>将域名 https://api.openai.com 替换成 <strong><a @click="copyToClipboard('https://openai.api.isisy.com')">https://openai.api.isisy.com</a></strong> 即可体验。</p> 
      </div> 
    </main> 
    <footer> 
      <p id="aipinfo"></p> 
      <p id="ipinfo"></p> 
      <p id="googleipinfo"></p> 
    </footer> 
  </div>
  <script>
    new Vue({
      el: '#app',
      methods: {
        showMessage() {
          this.$message({
            message: '文本复制成功！',
            type: 'success'
          });
        },
	copyToClipboard(text) {
	  const input = document.createElement('textarea');
	  input.style.position = 'fixed';
	  input.style.opacity = 0;
	  input.value = text;
	  document.body.appendChild(input);
	  input.select();
	  document.execCommand('Copy');
	  document.body.removeChild(input);
	  this.showMessage();
	}
      }
    });
    
    fetch("https://ip.isisy.com/info")
      .then(response => response.json())
      .then(res => {
        var ipinfo = "您的 IP 地址是: " + res.ip + " " + res.region + " " + res.city + " " + res.detail;
        document.getElementById('ipinfo').textContent = ipinfo;
      })
      .catch(error => console.error(error));
	  
    fetch('https://ipkk.herokuapp.com')
      .then(response => response.json())
      .then(res => {
        var googleipinfo = "访问 Google 的 IP 是:" + res.ip + " " + res.addr + res.info;
        document.getElementById('googleipinfo').textContent = googleipinfo;
      })
      .catch(error => console.error(error));
      
  </script>
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

