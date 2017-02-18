var linebot = require('linebot');
var express = require('express');
var getJSON = require('get-json');

var bot = linebot({
  channelId: '1501849021',
  channelSecret: '182a23a7e9c6b80bad4a557c8e7879d3',
  channelAccessToken: 'fPPdnXyU1WDXhQGVXUswJU9AJC4jRgaDm/B84ezhp+Av8KCJbQRdFjDR6OQnF5R9vwTqLb7G7vDFwAvjjo+dpXzPwTv4tEIjcfQlms6bftGPEQl+pHm6qO/HZqJjB2cIoR7wj2Odw+ANaASE30j+agdB04t89/1O/w1cDnyilFU='
});

var timer;
var pm = [];
_getPMJSON();

_bot();

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

//因為 express 預設走 port 3000，而 heroku 上預設卻不是，要透過下列程式轉換
var server = app.listen(process.env.PORT || 8080, function() {
  var port = server.address().port;
  console.log("App now running on port", port);
});

//回答的 function
function _bot() {
  bot.on('message', function(event) {
    if (event.message.type == 'text') {
      var msg = event.message.text;
      var replyMsg = '';
      if (msg.indexOf('PM2.5') != -1) {
        pm.forEach(function(e, i) {
          if (msg.indexOf(e[0]) != -1) {
            replyMsg = e[0] + '的 PM2.5 數值為 ' + e[1];
          }
        });
        if (replyMsg == '') {
          replyMsg = '找不到你他媽說的地方';
        }
      }
      if (replyMsg == '') {
        replyMsg = '你在公三小都聽不懂';
      }

      event.reply(replyMsg).then(function(data) {
        console.log(replyMsg);
      }).catch(function(error) {
        console.log('error');
      });
    }
  });

}

//取得 PM2.5 OpenData Json 的資料
function _getPMJSON() {
  clearTimeout(timer);
  getJSON('http://opendata2.epa.gov.tw/AQX.json', function(error, response) {
    response.forEach(function(e, i) {
      pm[i] = [];
      pm[i][0] = e.SiteName;
      pm[i][1] = e['PM2.5'] * 1;
      pm[i][2] = e.PM10 * 1;
    });
  });
  timer = setInterval(_getJSON, 1800000); //每半小時抓取一次新資料
}