(function(){
    var options = {
        showType :"console",//server //alert //nothing
        url:"",
        project:"test_error"
    }

    function GetScriptArgs(){
        var scripts=document.getElementsByTagName("script"),
            script=scripts[scripts.length-1],
            src=script.src,
            reg=/(?:\?|&)(.*?)=(.*?)(?=&|$)/g,
            temp,res={};
        while((temp=reg.exec(src))!=null) res[temp[1]]=decodeURIComponent(temp[2]);
        return res;
    };

    var args = GetScriptArgs();
    for(key in args){
        options[key] = args[key];
        console.log(key + "=" + options[key]);
    }

    /**
     * @param {String}  errorMessage
     * @param {String}  scriptURI
     * @param {Long}    lineNumber
     * @param {Long}    columnNumber
     * @param {Object}  errorObj
     */
    window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
        columnNumber = columnNumber || 0;
        errorObj = errorObj || {};
        if(options.showType == "console"){
            showConsole(errorMessage, scriptURI, lineNumber,columnNumber,errorObj);
        }
        else if(options.showType == "server"){
            setTimeout(function(){
                sendServer(errorMessage, scriptURI, lineNumber,columnNumber,errorObj);
            })
        }
        else if(options.showType == "alert"){
            showAlert(errorMessage, scriptURI, lineNumber,columnNumber,errorObj)
        }
        else if(options.showType == "nothing"){
            return true;
        }
    }

    function showAlert(errorMessage, scriptURI, lineNumber,columnNumber,errorObj){
        alert(errorMessage  + "\n" + "[url]="+scriptURI + "\n" + "[lineNumber]="+ lineNumber  + "\n" + "[columnNumber]="+ columnNumber + "\n" + "[errorObj]="+ JSON.stringify(errorObj));
    }

    function showConsole(errorMessage, scriptURI, lineNumber,columnNumber,errorObj){
        console.group("%c"+errorMessage,"color:red;font-size:16px;");
        console.log("%cscriptURI="+scriptURI,"color:red;");
        console.log("%clineNumber====="+lineNumber,"color:red;");
        console.log("%ccolumnNumber==="+ columnNumber,"color:red;");
        console.log("%cerrorObj="+JSON.stringify(errorObj),"color:red;");
        console.groupEnd();
    }

    function sendServer(errorMessage, scriptURI, lineNumber,columnNumber,errorObj){
        var con =  "[ErroMessage:"+errorMessage+"]" + "["+scriptURI+"]"+ "[lineNum:"+lineNumber+"]"+ "[columnNum:"+columnNumber+"]"+ "[ErrorStack:"+JSON.stringify(errorObj)+"]";
        var reqStr = 'logType=error&keyName='+options.keyName+'&content='+con;
        post(reqStr);
    }


    function createXMLHTTPRequest() {
        var xmlHttpRequest;
        if (window.XMLHttpRequest) {
            xmlHttpRequest = new XMLHttpRequest();
            if (xmlHttpRequest.overrideMimeType) {
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        } else if (window.ActiveXObject) {
            var activexName = [ "MSXML2.XMLHTTP", "Microsoft.XMLHTTP" ];
            for ( var i = 0; i < activexName.length; i++) {
                try {
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    if(xmlHttpRequest){
                        break;
                    }
                } catch (e) {
                }
            }
        }
        return xmlHttpRequest;
    }

    function post(content){
        var req = createXMLHTTPRequest();
        if(req){
            req.open("POST", options.url, true);
            req.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=gbk;");
            req.send(content);
            req.onreadystatechange = function(){
                if(req.readyState == 4 && req.status != 200){
                    console.log("ErrorJs.post Error");
                }
            }
        }
    }
})()