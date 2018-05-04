
# "homebridge-accessory-smartden" Plugin

Configuration:

```
    "accessories": [
        {
            "accessory": "smartDEN",
            "name": "smartDEN R5",
            "ip": "192.168.0.100",
            "password": "defaultpassword",
            "relay": "5"
        }

```
With this plugin you can create switches which will contact your smartDEN Relais Board. This is handy if you want to make use of homebridge but can't create plugins in NodeJS or want to use a somehow better language to control your devices/switch.

There is an optional value in the configuration "type":"NC|NO" see example below. The default is set to NO.


## Multiple Relais Bound Togheter
If you wish to do so you can specify an array of relays when your setups requires this (ex: double circuit interruption).
Below you can see an example config of an multi relay config.


```
    "accessories": [
        {
            "accessory": "smartDEN",
            "name": "smartDEN Group",
            "ip": "192.168.0.100",
            "password": "defaultpassword",
            "relay": [
                "2",
                "3",
                "8"
            ]
        }  
    ]

```

## Normal Closed Relays
See esxample:


```
    "accessories": [
        {
            "accessory": "smartDEN",
            "name": "smartDEN Group",
            "ip": "192.168.0.100",
            "password": "defaultpassword",
            "relay": [
                "2",
                "3",
                "8"
            ]
			"type":"NC"
        }  
    ]

```