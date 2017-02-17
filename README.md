#UnaHack Teams monitoring

Uses the Sigfox API to 
* List of device types associated to a parent group (including subgroups)
* Get all messages sent by devices associated to these device types
* Display the list

Add the following env vars :
* SIGFOX_LOGIN : **API** Login, ~~not your Sigfox backend login~~
* SIGFOX_PASSWORD: **API** Password , ~~not your Sigfox backend pwd~~
* LOGIN : used for http basic auth on the web page
* PASSWORD: used for http basic auth on the web page

Or a `config.js` file formatted as follow :
```
module.exports = {
  SIGFOX_USERNAME: '',
  SIGFOX_PASSWORD: '',
  LOGIN: '',
  PASSWORD: ''
};

```


