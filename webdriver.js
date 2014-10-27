var webdriver = require('selenium-webdriver');

var fs = require('fs');
//debugger;
//  var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
// driver.manage().window().maximize();
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
process.argv.forEach(function(val, index, array) {
  url = array[2];
  server = array[3];
  capabilities = array[4];
});
driver = new webdriver.Builder().
usingServer(server + '/wd/hub').
withCapabilities(capabilities).
build();

driver.get(url).then(function() {
  //get browser name and version
  driver.executeScript('return window.navigator.appName').then(function(appName) {
    driver.executeScript('return window.navigator.userAgent').then(function(userAgent) {
      var browser = userAgent.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
      if (browser && (tem = userAgent.match(/version\/([\.\d]+)/i)) !== null) {
        browser[2] = tem[1];
      }
      browser = browser ? [browser[1], browser[2]] : [appName, driver.executeScript('return window.navigator.appVersion').then(function(c) {})];

      //get test suites
      driver.findElements(webdriver.By.xpath("//li[contains(@class,'suite')]")).then(function(suites) {
        suites.forEach(function(suite) {
          suite.findElement(webdriver.By.xpath("h1/a")).getText().then(function(suitename) {
            //get tests
            suite.findElements(webdriver.By.xpath("ul/li")).then(function(tests) {
              var num = 1;
              var map = {};

              tests.forEach(function(test) {
                test.getAttribute("class").then(function(cl) {

                  if (cl.indexOf("test pass fast") != -1) {
                    result = "ok";
                    error = test;

                  } else {
                    result = "not ok";
                    error = test.findElement(webdriver.By.xpath("pre[contains(@class,'error')]"));
                    isError = true;
                  }
                  test.getText().then(function(text) {
                    error.getText().then(function(errtext) {
                      if (isError) {
                        newErr = errtext;
                        newErr = newErr.replace(/^/g, "\t#");
                        newErr = newErr.replace(/\n/g, "\n\t#");
                        text = text.replace(errtext, newErr);
                      }

                      text = text.replace("\n‣", "");
                      map[num] = text;
                      tap = tap.concat(result + " " + num + " " + browser[0] + " " + browser[1] + " - " + suitename + " " + map[num] + "\n");
                      fs.writeFileSync('result.tap', tap);
                      num++;
                      isError = false;
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

    driver.quit();
  });
});
