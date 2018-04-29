"use strict";
var Service, Characteristic;
var request = require("request");

module.exports = function (homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-accessory-smartden", "smartDEN", smartDEN_Relay);
};

function smartDEN_Relay(log, config) {
    this.log = log;
    this.name = config.name;
    this.relay = [];
    this.password = config.password;
    this.ip = config.ip;

    if (!!config.relay && config.relay.constructor === Array) {
        this.relay = config.relay;
    }
    else if (config.relay) {
        this.relay = [config.relay];
    }

    this.statusUrl = "http://" + this.ip + "/current_state.json?pw=" + this.password;
	
	
    
	this.homebridgeService = new Service.Switch(this.name);
    this.homebridgeService.getCharacteristic(Characteristic.On)
        .on("get", this.getStatus.bind(this))
        .on("set", this.setStatus.bind(this));
}

smartDEN_Relay.prototype = {
    identify: function (callback) {
        this.log("Identify requested!");
        callback();
    },

    getServices: function () {
		return [this.homebridgeService];
		
		/*
                this._httpRequest(this.statusUrl, "", "GET", function (error, response, body) {
                    if (error) {
                        this.log("getServices() failed: %s", error.message);
                        callback(error);
                    }
                    else if (response.statusCode !== 200) {
                        this.log("getServices() http request returned http error code: %s", response.statusCode);
                        callback(new Error("Got html error code " + response.statusCode));
                    }
                    else {
						var RelayStates = JSON.parse(body);
						var DevMacAddress = RelayStates.CurrentState.Device.MAC
						this.log("getServices() http request returned DeviceMacAddress: " + DevMacAddress);
						var DevName = RelayStates.CurrentState.Device.Name
						this.log("getServices() http request returned DeviceName: " + DevName);
                    }
                }.bind(this));

		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Denkovi")
			.setCharacteristic(Characteristic.Model, "smartDEN-IP-16R")
			//.setCharacteristic(Characteristic.SerialNumber, DevMacAddress)
			//.setCharacteristic(Characteristic.Name, DevName)

		return [informationService, this.service];*/
    },

    getStatus: function (callback) {

	this._httpRequest(this.statusUrl, "", "GET", function (error, response, body) {
                    if (error) {
                        console.log("getStatus() failed: %s", error.message);
                        callback(error);
                    }
                    else if (response.statusCode !== 200) {
                        console.log("getStatus() http request returned http error code: %s", response.statusCode);
                        callback(new Error("Got html error code " + response.statusCode));
                    }
                    else {
						var relayArray =  this.relay
						var RelayStates = JSON.parse(body);
						var  relayState = 0;
						//this.log(RelayStates.CurrentState.Output);
						for (var i = 0; i < relayArray.length; i++){
							var correctRelay = relayArray[i] - 1;
							var obj = RelayStates.CurrentState.Output[correctRelay];
							for (var key in obj){
								var attrName = key;
								var attrValue = obj[key];
								//this.log("attrName= " + attrName);
								//this.log("attrValue= " + attrValue);
								if (attrName == "Value"){
									relayState = relayState + Number(attrValue);
									//this.log("relayState= " + relayState);
								}
							}
						}
						this.log(this.name);
						this.log(" -> relayArray.length: " + relayArray.length);
						this.log(" -> relayState: " + relayState);
						if (relayState/relayArray.length == 1 ){
								var state="1"
						}else{
								var state="0"
						}		
						callback(null, state);
                    }
                }.bind(this));

    },

    setStatus: function (on, callback) {
		this.makeSetRequest(on, callback);
    },

    makeSetRequest: function (on, callback) {
        var httpSwitch = this;
		httpSwitch.log("Value on variable: " + on + ", in number: " + Number(on));
        var relayArray = this.relay;
		var relayString = "";
		
		for (var i = 0; i < relayArray.length; i++){
			httpSwitch.log("current relayArray: " + relayArray[i]);
			relayString += "Relay" + relayArray[i] + "=" + Number(on) + "&"
		}
						
		relayString = relayString.substring(0, relayString.length - 1);
		httpSwitch.log("relayString: " + relayString);
		httpSwitch.log("full request url: " + this.statusUrl + "&" + relayString);
		
	   this._httpRequest(this.statusUrl + "&" + relayString, "", "GET", function (error, response, body) {
		   if (error) {
			   httpSwitch.log("setStatus() failed: %s", error.message);
			   callback(error);
			}
			else if (response.statusCode !== 200) {
				httpSwitch.log("setStatus() http request returned http error code: %s", response.statusCode);
				callback(new Error("Got html error code " + response.statusCode));
			}
			else {
				httpSwitch.log("setStatus() successfully set switch to %s", on? "ON": "OFF");
				callback(undefined, body);
			}
		}.bind(this));
    },
	
    _httpRequest: function (url, body, method, callback) {
        request(
            {
                url: url,
                body: body,
                method: method,
                rejectUnauthorized: false
            },
            function (error, response, body) {
                callback(error, response, body);
            }
        )
    }
};