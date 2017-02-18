var linebot = require('linebot');
var express = require('express');

var bot = linebot({
  channelId: '1501849021',
  channelSecret: '182a23a7e9c6b80bad4a557c8e7879d3',
  channelAccessToken: 'fPPdnXyU1WDXhQGVXUswJU9AJC4jRgaDm/B84ezhp+Av8KCJbQRdFjDR6OQnF5R9vwTqLb7G7vDFwAvjjo+dpXzPwTv4tEIjcfQlms6bftGPEQl+pHm6qO/HZqJjB2cIoR7wj2Odw+ANaASE30j+agdB04t89/1O/w1cDnyilFU='
});

bot.on('message', function(event) {
  console.log(event); //把收到訊息的 event 印出來看看
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});