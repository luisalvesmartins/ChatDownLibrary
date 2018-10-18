var MenuChatDown={
    New:function(){
        setChat("user=me\nbot=bot\n");
        render();
    },
    Download:function(){
        var url=prompt("URL","https://raw.githubusercontent.com/Microsoft/botbuilder-tools/master/packages/Chatdown/Examples/BookTable-happyPath.chat");
        $.get( url, function( data ) {
            setChat(data);
            render();
        });        
    },
    LoadLocal:function(){
        document.getElementById('fileInput').click();
    },
    SaveLocal:function(){
        var text=getChat();
        var filename="file.chat"

        var file = new Blob([text], {type: "text"});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }
    }
}

var MenuChatEmulator={
    SaveTranscript:function(){
        var text=document.all("result").innerText;
        var filename="file.transcript"

        var file = new Blob([text], {type: "text"});
        if (window.navigator.msSaveOrOpenBlob) // IE10+
            window.navigator.msSaveOrOpenBlob(file, filename);
        else { // Others
            var a = document.createElement("a"),
                    url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);  
            }, 0); 
        }

    },
    ExportToNode:function(){
        var dialogName=prompt("Name of the Dialog","SimpleWaterfallDialogBot");
        $.get( "nodetemplate.js", function( data ) {
            data=data.replace(/\[DIALOGNAME\]/g,dialogName);
            var steps="";

            var chatDown=readContents(getChat())
            for(let activity of chatDown){
                switch (activity.type) {
                case "ActivityTypes.Message":
                    if (activity.from.role=="bot")
                    {

                        if (activity.attachments)
                        {
                            var card=JSON.parse(activity.attachments[0].content);

                            steps+="            async function (step) {\n                ";
                            steps+="await step.context.sendActivity({attachments: [CardFactory.adaptiveCard(" + JSON.stringify(card) + ")]});";
                            steps+="\n            },\n";
                        }
                        else
                            steps+="            async function (step) {\n                await step.prompt(NAME_PROMPT, `" + activity.text + "?`);\n            },\n";
                        //sOutput+=markdownit().render(activity.text);
                    }
                    
                    break;
                case "typing":
                    break;
                case "conversationUpdate":
                    break;
                default:
                    steps+="//UNPROCESSED:" + activity.type + "\n";
                    break;
                }
            }
        
            data=data.replace(/\[STEPS\]/g,steps);

            //SAVE LOCAL
            var text=data;
            var filename=dialogName + ".js"
    
            var file = new Blob([text], {type: "text"});
            if (window.navigator.msSaveOrOpenBlob) // IE10+
                window.navigator.msSaveOrOpenBlob(file, filename);
            else { // Others
                var a = document.createElement("a"),
                        url = URL.createObjectURL(file);
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                setTimeout(function() {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);  
                }, 0); 
            }
    
        });    
    }
}

//THE TEXT INPUT
function send(){
    setChat(getChat() + "\n" + document.all("fromChat").value + ":" + document.all("textChat").value);
    document.all("fromChat").selectedIndex=1-document.all("fromChat").selectedIndex;
    document.all("textChat").value="";
    render();
}
function init(){    
    if (document.all("marktext")){
        marktext.addEventListener('keyup',function(e){
            if (e.keyCode==13)
                render();
        });
    }
    

    textChat.addEventListener('keyup',function(e){
        if (e.keyCode==13)
            send();
    });
    //THE TEXT INPUT

    fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                setChat(contents);
                render();
            }
            reader.readAsText(file)
    });
    render();
}

function render()
{
   renderContent(getChat());
}

var fileList=[];
function renderContent(content){
    var original=content;
    var pos=original.indexOf("Attachment=");
    var xhrObj = new XMLHttpRequest();
    while (pos>0) {
        var pos2=original.substr(pos+11).indexOf(" ");
        var file=original.substr(pos+11,pos2);
        // open and send a synchronous request
        xhrObj.open('GET', file, false);
        xhrObj.send('');

        fileList.push({ file:file, content:xhrObj.responseText});
        pos=original.indexOf("Attachment=",pos+1);
    }

    var chatDown=readContents(content)
    document.all("result").innerText= JSON.stringify(chatDown, undefined,2 );
    var sOutput="";
    for(let activity of chatDown){
        sOutput+="<div class='wc-message-wrapper list'>";
        switch (activity.type) {
        case "ActivityTypes.Message":
            var sFrom="";
            if (activity.from.role=="bot")
                sFrom="bot";
            else
                sFrom="me";
            sOutput+="<div class='wc-message wc-message-from-" + sFrom + "'>";

            sOutput+="<div class='wc-message-content'>"
            if (activity.attachments)
            {
                switch (activity.attachments[0].contentType) {
                    case "application/vnd.microsoft.card.adaptive":
                        var card=JSON.parse(activity.attachments[0].content);
                        delete card["$schema"];

                        var adaptiveCard = new AdaptiveCards.AdaptiveCard();
        
                        adaptiveCard.hostConfig = new AdaptiveCards.HostConfig({
                            fontFamily: "Segoe UI, Helvetica Neue, sans-serif"
                        });
                        adaptiveCard.onExecuteAction = function(action) { alert("Ow!"); }
        
                        // For markdown support you need a third-party library
                        // E.g., to use markdown-it, include in your HTML page:
                        //      type="text/javascript" src="https://unpkg.com/markdown-it/dist/markdown-it.js">
                        // And add this code to replace the default markdown handler:
                        adaptiveCard.processMarkdown = function(text) { return markdownit().render(text); }
        
                        // Parse the card payload
                        adaptiveCard.parse(card);
        
                        // Render the card to an HTML element:
                        var renderedCard = adaptiveCard.render();
                        sOutput+=renderedCard.outerHTML;
                        break;
                    case "application/vnd.microsoft.card.hero":
                        var card=activity.attachments[0];
                        var s = "# " + card.content.title + "\n" + 
                            "## " + card.content.subtitle + "\n" + 
                            card.content.text + "\n";
                        sOutput+=markdownit().render(s);
                        for(var f=0;f<card.content.buttons.length;f++){
                            sOutput+='<input type=button value="' + card.content.buttons[f].title + '"/><br>';
                        }
                        break;
                
                    default:
                        sOutput+=markdownit().render(activity.text);
                        break;
                }
            }
            else
                sOutput+=markdownit().render(activity.text);
            sOutput+= "</div>";
            sOutput+="</div>";
            sOutput+='<div class="wc-message-from wc-message-from-' + sFrom + '"><span>' + activity.from.name + '</span></div>';
            
            break;
        case "typing":
            sOutput+="<div class='wc-message-content'>(typing)</div>";
            break;
        case "conversationUpdate":
            for(var f=0;f<activity.membersAdded.length;f++)
            {
                sOutput+='<div class="wc-message-from wc-message-from-bot"><span>' + activity.membersAdded[f].name + ' joined the conversation</span></div>';
            }
            for(var f=0;f<activity.membersRemoved.length;f++)
            {
                sOutput+='<div class="wc-message-from wc-message-from-bot"><span>' + activity.membersRemoved[f].name + ' left the conversation</span></div>';
            }
            break;
        default:
            sOutput+="<div class='wc-message-content'>" + activity.type + "</div>";
            break;
        }

        sOutput+="</div>";
    }
    document.all("displayActivities").innerHTML=sOutput;
    document.all("botWC").scrollTop=60000;
}
function refreshLayout() {
    if (!document.all("marktext"))
        editor.layout();
};
function setChat(text){
    if (document.all("marktext"))
        document.all("marktext").value=text;
    else
    {
        editor.setValue(text);
    }
}
function getChat(){
    if (document.all("marktext"))
        return document.all("marktext").value
    else
    {
        if (editor)
            return editor.getValue();
        else
            return "";
    }
}
window.onresize = refreshLayout;
window.onload=init;
