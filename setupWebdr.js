var webdr = module.exports = {};
webdr.setup = function (wd){

	var caps;
	var capabilities=[];
	var url;
	var server;
	var args = process.argv;

	for(var i = 0; i < args.length; i++){
		if(args[i].indexOf("--")==0){
			args[i]= args[i].slice(2);
		}
	}	
	if(args[3].indexOf("no-timeout") == 0){
		url = args[4];
		server = args[5];
		caps = JSON.parse(args[6]);
	} else {
	   url = args[3];
	   server = args[4];
	   caps = JSON.parse(args[5]);
	}

	var capability = new wd.DesiredCapabilities().firefox();
	for (var key in caps) {
	  capability.setCapability(key,caps[key]);   
	}
	driver = new wd.RemoteWebDriver(server + "/wd/hub", capability);
	driver.manage().window().maximize();
  driver.get(url);
  return driver;
}
