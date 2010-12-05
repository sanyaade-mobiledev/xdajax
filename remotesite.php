<?PHP

#################################################################################
## Developed by Manifest Interactive, LLC                                      ##
## http://www.manifestinteractive.com                                          ##
## ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ##
##                                                                             ##
## THIS SOFTWARE IS PROVIDED BY MANIFEST INTERACTIVE 'AS IS' AND ANY           ##
## EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE         ##
## IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR          ##
## PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL MANIFEST INTERACTIVE BE          ##
## LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR         ##
## CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF        ##
## SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR             ##
## BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,       ##
## WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE        ##
## OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,           ##
## EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.                          ##
## ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ##
## Author of file: Peter Schmalfeldt                                           ##
#################################################################################

header('Content-type: application/javascript');

if ($_GET['apikey'] != '8D292CF8-8CE0-AA04-5D4B-44812E71DC42')
{
    exit(bad_api());
}

switch ($_GET['function'])
{
    case "logout":
        $json = array('success' => 'User Logged Out');
        js_response($json);
        break;

    case "login":
        if (isset($_GET['username']) && isset($_GET['password']))
        {
            $username = $_GET['username'];
            $password = $_GET['password'];
            if ($username == 'username' && $password == md5('password'))
            {
                $json = array('success' => md5($username . $password));
            }
            else
            {
                $json = array('error' => 'Username or Password Incorrect');
            }
        }
        else
        {
            $json = array('error' => 'Username or Password Blank');
        }
        js_response($json);
        
        break;

    default:
        break;
}

function js_response($json='')
{
    $callback = (!empty($_GET['callback']))
        ? "'" . $_GET['callback'] . "'"
        : 'null';

    $json = (!empty($json))
        ? json_encode($json)
        : json_encode(array('error' => 'Nothing to return'));
    
    $js = "function triggerResponse(){\n";
    $js .= "\t var json = {$json};\n";
    if (!empty($_GET['callback']))
        $js .= "\t " . $_GET['callback'] . "(json);\n";
    else
        $js .= "\t XD.ajax.success(json);\n";
    $js .= "\t parent.XD.ajax.responseReceived();\n";
    $js .= "}";
    echo $js;
}

function bad_api()
{
    $json = json_encode(array('error' => 'Invalid API Key'));
    $js = "function triggerResponse(){\n"
        . "\t var json = {$json};\n"
        . "\t XD.ajax.success(json);\n"
        . "\t parent.XD.ajax.responseReceived();\n"
        . "}";
        
    echo $js;
}
?>