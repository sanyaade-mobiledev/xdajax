if(!NS)
{
    var NS =
    {
        debugEnabled: true,
        init: function()
        {
            if(!window.console)
            {
                NS.debugEnabled = false;
            }
            NS.debug('NS.init()', 'log');
            NS.auth.check();
            XD.processing = function(status)
            {
                XD.debug('XD.ajax.processing("'+status+'")', 'log');
                if(status=='on')
                {
                    $('#spinner').show()
                }
                else
                {
                    $('#spinner').hide();
                }
            }
        },
        debug: function(message, level)
        {
            if(NS.debugEnabled)
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
        auth:
            {
            token: null,
            valid: null,
            check: function()
            {
                NS.debug('NS.auth.check', 'log');
                if(NS.auth.token == null && $.cookie('NS_user'))
                {
                    NS.auth.token = $.cookie('NS_user');
                    NS.debug('NS.auth.check: Cookie Login with token '+NS.auth.token, 'log');
                    $('#login_form').hide();
                    $('#content').html('LOGGED IN (COOKIE). <input type="button" value="Logout" onclick="NS.auth.logout();" \/>');
                }
                else if(NS.auth.token != null && $.cookie('NS_user'))
                {
                    NS.debug('NS.auth.check: Form Login with token '+NS.auth.token, 'log');
                    $('#login_form').hide();
                    $('#content').html('LOGGED IN.  <input type="button" value="Logout" onclick="NS.auth.logout();" \/>');
                }
                else
                {
                    NS.debug('NS.auth.check: Not Logged In', 'log');
                    NS.auth.token = null;
                    $('#login_form').show();
                    $('#content').html('');
                }
            },
            login: function()
            {
                NS.debug('NS.auth.login', 'log');
                var username = $('#login_username').val();
                var password = $('#login_password').val();
                if(password!='')
                {
                    password = MD5(password);
                }
                NS.auth.valid = MD5(username+password);
                XD.ajax.send('?function=login&username='+username+'&password='+password+'&callback=NS.auth.validate');
            },
            logout: function()
            {
                NS.debug('NS.auth.logout', 'log');
                $.cookie('NS_user','');
                XD.ajax.send('?function=logout&callback=NS.auth.check');
            },
            validate: function(response)
            {
                NS.debug('NS.auth.validate', 'log');
                if(response.success)
                {
                    NS.debug('SUCCESS: '+response.success+' : '+NS.auth.valid, 'log');
                    NS.auth.token = response.success;
                    if(NS.auth.valid === NS.auth.token && NS.auth.token!=null)
                    {
                        NS.debug('-- valid token, allow login', 'log');
                        $.cookie('NS_user', response.success, {
                            expires: 30
                        });
                        NS.auth.check();
                    }
                    else
                    {
                        NS.debug('-- invalid token, do not allow login', 'log');
                    }
                }
                else if(response.error)
                {
                    NS.debug('ERROR: '+response.error, 'error');
                    $('#content').html(response.error);
                }
                else
                {
                    NS.debug('ERROR: '+response, 'error');
                }
            }
        }
    };
}
try
{   
    $().ready(function()
    {
        NS.init();
    });
}
catch(error){}