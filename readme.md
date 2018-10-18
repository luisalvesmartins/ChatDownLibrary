# ChatDown Library & Explorer

Two projects in this repo:

## ChatDown Explorer

Enables you to write chatdown code and see it live in the embedded bot emulator window. You can export the transcript or the bot NodeJS dialog to use in your bot code.

Done in pure HTML and Javascript, reusing the [chatdown tools](https://github.com/Microsoft/botbuilder-tools), [Monaco editor](https://microsoft.github.io/monaco-editor/) and the [Offline Web Botchat](https://github.com/luisalvesmartins/WebChatControlOffline)

Drop the files into an Azure Storage Blob and run the ChatDownExplorer_monaco.html. Or drop them into your favorite webserver.

Chat files can be loaded and saved locally or downloaded from an URL. Transcript files can also be saved locally.

![Image](/ChatDown%20Explorer/screenshot.png "Screenshot")

### Try it

Here: https://lambot.blob.core.windows.net/github/ChatDownExplorer/ChatDownExplorer_monaco.html

### To use the Node.JS exported code

You may use [Jamie's Waterfall Dialog Sample](https://github.com/daltskin/WaterfallDialogBotv4) as a base start. Replace the bot.js with the export file and simply run it.

Or add this code in your bot to run it:
```javascript
// Import the custom bot class that provides a turn handling function.
const { WaterfallDialogBot } = require('./<exportedfile>');

// Create conversation state with in-memory storage provider.
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Create the bot object that provides the turn handler function.
const bot = new WaterfallDialogBot(conversationState, userState);
```

## Possible future developments 

- Develop a cooperative solution that enables two persons to build the chat performing role playing in two different computers. One is the bot, the other is a user.

## ChatDown Libraries

A list of ChatDown flows, organized by industry, demonstrating "happy path" conversations. Your contribution is more than welcome.
