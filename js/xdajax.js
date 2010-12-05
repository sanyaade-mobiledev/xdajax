if(!XD)
{
    var XD =
    {
	apikey: '8D292CF8-8CE0-AA04-5D4B-44812E71DC42',
	debugEnabled: true,
	init: function()
        {
            if(!window.console)
            {
                XD.debugEnabled = false;
            }
            XD.debug('XD.init()', 'log');
	},
	ajax:
        {
            connectionId: -1,
            connections: new Array(),
            interval: null,
            intervalPeriod: 100,
            pollingDebugCount: 0,
            pollingDebugFirst: true,
            pollingDebugThrottle: 100,
            requestQueue: new Array(),
            scriptObject: null,
            serverUrl: 'remotesite.php',
            timeoutPeriod: 20000,
            version: '1.0',

            buildConnectionUrl: function(query)
            {
                XD.debug('XD.ajax.buildConnectionUrl("'+query+'")', 'log');
                XD.ajax.connectionId = XD.ajax.connections.length ;
                var url = XD.ajax.serverUrl+query+'&connectionId='+XD.ajax.connectionId+'&apikey='+XD.apikey;
                XD.debug('-- built url: [' + url + ']', 'log');
                XD.ajax.requestQueue[XD.ajax.requestQueue.length] = new XD.ajax.requestQueueNode(url);
            },
            createScriptObject: function(source)
            {
                XD.debug('XD.ajax.createScriptObject("'+source+'")', 'log');
                XD.ajax.scriptObject = document.createElement('SCRIPT');
                XD.ajax.scriptObject.src = source;
                XD.ajax.scriptObject.type = 'text/javascript';
                var head=document.getElementsByTagName('HEAD')[0];
                head.appendChild(XD.ajax.scriptObject);
            },
            failure: function(errorMsg)
            {
                XD.debug('XD.ajax.failure("'+errorMsg+'")', 'error');
            },
            flushQueue: function()
            {
                XD.debug('XD.ajax.flushQueue()', 'log');
                XD.ajax.requestQueue.length = 0;
            },
            makeRequest: function()
            {
                XD.debug('XD.ajax.makeRequest()', 'log');
                if(XD.ajax.requestQueue.length > 0)
                {
                    XD.processing('on');
                    var connectionCode = XD.ajax.requestQueue[0].connectionUrl;
                    parent.triggerResponse = null;
                    XD.ajax.createScriptObject(connectionCode);
                    XD.ajax.serverTimeoutTime = XD.ajax.now() + XD.ajax.timeoutPeriod;
                }
            },
            now: function()
            {
                XD.debug('XD.ajax.now()', 'log');
                return (new Date()).getTime();
            },
            poll: function()
            {
                XD.debug('XD.ajax.poll()', 'log');
                if(XD.ajax.pollingDebugCount == XD.ajax.pollingDebugThrottle)
                {
                    XD.debug('-- poll [' + XD.ajax.now() + '] (x' + XD.ajax.pollingDebugCount + ')', 'log');
                    XD.ajax.pollingDebugCount = 0;
                }
                else if(XD.ajax.pollingDebugFirst)
                {
                    XD.debug('-- poll [' + XD.ajax.now() + ']', 'log');
                    XD.ajax.pollingDebugFirst = false;
                    XD.ajax.pollingDebugCount = 0;
                }
                XD.ajax.pollingDebugCount++;
                if(XD.ajax.serverTimeoutTime)
                {
                    if(XD.ajax.serverTimeoutTime <= XD.ajax.now())
                    {
                        XD.ajax.stopPolling();
                        XD.ajax.failure('Server Timed Out');
                    }
                    else if(parent.triggerResponse != null)
                    {
                        parent.triggerResponse();
                    }
                }
                else if(XD.ajax.requestQueue.length > 0)
                {
                    XD.ajax.makeRequest();
                }
                else
                {
                    XD.ajax.stopPolling();
                }
            },
            removeScriptObject: function()
            {
                XD.debug('XD.ajax.removeScriptObject()', 'log');
                XD.ajax.scriptObject.parentNode.removeChild(XD.ajax.scriptObject);
                XD.ajax.scriptObject = null;
            },
            requestQueueNode: function(url)
            {
                XD.debug('XD.ajax.requestQueueNode("'+url+'")', 'log');
                this.connectionUrl = url;
                this.requestSent = false;
            },
            responseReceived: function()
            {
                XD.debug('XD.ajax.responseReceived()', 'log');
                XD.processing('off');
                XD.ajax.requestQueue.shift();
                XD.ajax.serverTimeoutTime = null
                XD.ajax.removeScriptObject();
            },
            send: function(query)
            {
                XD.debug('XD.ajax.send("'+query+'")', 'log');
                XD.ajax.buildConnectionUrl(query);
                XD.ajax.startPolling();
            },
            startPolling: function()
            {
                XD.debug('XD.ajax.startPolling()', 'log');
                if(XD.ajax.interval == null)
                {
                    XD.debug('polling (re)started');
                    XD.ajax.interval=window.setInterval(function(){XD.ajax.connections[XD.ajax.connectionId]; XD.ajax.poll();}, XD.ajax.intervalPeriod);
                }
            },
            stopPolling: function()
            {
                XD.debug('XD.ajax.stopPolling()', 'log');
                XD.ajax.serverTimeoutTime = null;
                XD.ajax.flushQueue();
                if(XD.ajax.interval)
                {
                    window.clearInterval(XD.ajax.interval);
                }
                XD.ajax.interval = null;
            },
            success: function(response)
            {
                if(response.success)
                {
                    XD.debug('SUCCESS: '+response.success, 'log');
                }
                else if(response.error)
                {
                    XD.debug('ERROR: '+response.error, 'error');
                }
            }
	},
	debug: function(message, level)
        {
            if(XD.debugEnabled)
            {
                if(level=='warn')
                {
                    console.warn(message);
                }
                else if(level=='error')
                {
                    console.error(message);
                }
                else
                {
                    console.log(message);
                }
            }
	},
	processing: function(status)
        {
            XD.debug('XD.ajax.processing("'+status+'")', 'log');
	}
    };
}
try
{   
    XD.init();
}
catch(error){}