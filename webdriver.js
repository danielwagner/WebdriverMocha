
var wd = require('webdriver-sync');
var webdrSetup = require('./setupWebdr.js');
var fs = require('fs');
var tem;
var browser;
var result;
var tap = "";
var errtext;
var error;
var newErr;
var isError = false;
var url;
var server;
var capabilities;

driver = webdrSetup.setup(wd);
wd.wait(function() {
    return driver.executeScript("return window.testsDone");
},{ timeout: 50000, period: 100 });
 
var appName = driver.executeScript('return window.navigator.appName');
var userAgent = driver.executeScript('return window.navigator.userAgent');
var browser = userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
if (browser && (tem = userAgent.match(/version\/([\.\d]+)/i)) !== null) {
  browser[2] = tem[1];
}
browser = browser ? [browser[1], browser[2]] : [appName, driver.executeScript('return window.navigator.appVersion')];

var suites = driver.findElements(wd.By.xpath("//li[contains(@class,'suite')]"));

suites.forEach(function(suite) {
var suitename = suite.findElement(wd.By.xpath("h1/a")).getText();
var tests = suite.findElements(wd.By.xpath("ul/li"));
var num = 1;
var map = {};

tests.forEach(function(test) {
  var cl = test.getAttribute("class");
  var text = test.getText();
    if (cl.indexOf("test pass") != -1) {
      result = "ok";
    } else {
      result = "not ok";
      error = test.findElement(wd.By.xpath("pre[contains(@class,'error')]")).getText();
      newErr = error;
      newErr = newErr.replace(/^/g, "\t#");
      newErr = newErr.replace(/\n/g, "\n\t#");
      text = text.replace(error, newErr);
    }
    text = text.replace("\n‣", "");
    map[num] = text;
    tap = tap.concat(result + " " + num + " " + browser[0] + " " + browser[1] + " - " + suitename + " " + map[num] + "\n");
    console.log(tap);
    fs.writeFileSync('result1.tap', tap);
     num++;
});
});