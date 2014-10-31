var wd = require('webdriver-sync');
var mocha = require('mocha');
var chai = require('chai');
var assert = chai.assert;
var webdrSetup = require('./setupWebdr.js');
var driver;
describe('PlayIT',function (){
  this.timeout(15000);

  before(function(){
	 driver = webdrSetup.setup(wd);
  });


  after(function(){
    driver.quit();
  });


	it('get the title', function (){
	  title = driver.getTitle();
	  assert.equal("Play",title);
	});


	it('edit text', function (){
	  var textfield = driver.findElement(wd.By.xpath('//textarea'));
		textfield.sendKeys(wd.Keys.CONTROL,"a");
			textfield.sendKeys("lalalalala");
	  
	  editor = driver.findElement(wd.By.id('editor'));
	  assert.equal(editor.getText(),"1\nlalalalala");

	});


	it('check Samples', function (){
	  var samplesButton = driver.findElement(wd.By.id('samplesButton'));
	  samplesButton.click();
	  var samples = driver.findElements(wd.By.xpath("//div[contains(@class,'menu')]/descendant::div[contains(@class,'list')]"));
	  assert.equal(5,samples.length);
	});


	it('close samples', function (){
		var samples = driver.findElement(wd.By.xpath("//div[contains(@class,'menu')]/descendant::div[contains(@class,'list')]"));
		assert.isTrue(samples.isDisplayed());
		var closeButton = driver.findElement(wd.By.xpath("//div[text()= 'Close']/ancestor::button"));
		closeButton.click();
		assert.isFalse(samples.isDisplayed());
	});


	it('sample: Button', function (done){
		var samplesButton = driver.findElement(wd.By.id('samplesButton'));
		samplesButton.click();
		var button=driver.findElement(wd.By.xpath("//li[contains(@class, 'list-item')]/descendant::div[text() = 'Button']/ancestor::li"));
		button.click();
		setTimeout(function(){
			editor = driver.findElement(wd.By.id('editor'));
			assert.isTrue(editor.getText().indexOf("q.create(\"<button>\")")!=-1);
			var createdButton = driver.findElement(wd.By.xpath("//div[contains(@id,playroot)]/descendant::div[text() = 'First Button']"));
			var title = driver.findElement(wd.By.xpath("//div[contains(@id,playroot)]/descendant::div[text() = 'Hello World']"))
			assert.isTrue(createdButton.isDisplayed());
			assert.isFalse(title.isDisplayed());
			done();
		},500);

	});


	it('click Shorten Url Button', function (){
		this.timeout(15000);
		driver.findElement(wd.By.id('shorteButton')).click();
		var browsertabs = driver.getWindowHandles();
		var shortenurltab = driver.switchTo().window(browsertabs[1]);
		assert.isTrue(shortenurltab.getTitle().indexOf("TinyURL.com")!=-1);
	});

});
