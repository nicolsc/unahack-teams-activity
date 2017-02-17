const request = require('request-promise');
const moment = require('moment');
require('./loadConfig');


var SigfoxMsg = function(msg){
  this.deviceId = msg.device;
  this.frame = msg.data
  this.time = msg.time * 1000;
  this.date = moment(this.time).calendar();
  this.linkQuality = msg.linkQuality;
  this.callbacks = msg.cbStatus ? msg.cbStatus.map(function(cb){return cb.info;}) : null;
  this.location = msg.location ? JSON.stringify(msg.location) : null;
};

function getRequest(method, path, body){
  return request[method.toLowerCase()]({
    uri:'http://backend.sigfox.com/api'+path,
    json: true,
    auth:{
      user: process.env.SIGFOX_USERNAME,
      pass: process.env.SIGFOX_PASSWORD
    },
    body:body
  });
}

module.exports = {

  getGroupMessages: function(filter){
    return new Promise(function(resolve, reject){
      this.getDeviceTypes(filter)
      .then(function(deviceTypes){
        console.log("✅ %s deviceTypes", deviceTypes.length);
        deviceTypes = deviceTypes.filter(function(item){return item.name.match(filter)});
        console.log("✅ %s filtered deviceTypes", deviceTypes.length);
        console.log(deviceTypes)
        Promise.all(deviceTypes.map(this.getDeviceTypeMessages))
        .then(resolve)
        .catch(function(err){
          console.warn("🔴 Error retrieving messages")
          console.log(err);
          process.exit(0);
        })
      }.bind(this))
      .catch(function(err){
        console.log("🔴 getGroupMessages", err);
        reject(err);
      });
    }.bind(this));
  },
  getDeviceTypes: function(filter){
    return new Promise(function(resolve, reject){
      getRequest('GET', '/devicetypes?includeSubGroups=true')
      .then(function(result, err){
        if (!result || !result.data || !result.data.length){
          return reject(new Error("No devicetypes retrieved"));
        }
        var output = [];
        result.data.forEach(function(item){output.push(item);});
        resolve(output);
      })
      .catch(function(err){
        console.log("🔴 getDT", err);
        reject("sorry")
      });
    });
  },
  getDeviceTypeMessages: function(deviceType){
    return new Promise(function(resolve,reject){
      getRequest('GET', '/devicetypes/'+deviceType.id+'/messages')
      .then(function(result){
        if (!result || !result || !result.data.length){
          var msg = "🔴 No messages for deviceType "+ deviceType.id;
          console.log(msg);
          return resolve({deviceType:deviceType, messages:[]});
        }
        console.log("✅ %s : %s messages", deviceType.id, result.data.length);
        return resolve({deviceType:deviceType, messages:result.data.map(function(item){return new SigfoxMsg(item)})});
      })
      .catch(reject);
    });
  }

  //messages.data.forEach(function(item){output.push(});

};
