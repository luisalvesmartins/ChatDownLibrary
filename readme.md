# ChatDown Library & Explorer

Two projects in this repo:

## ChatDown Explorer

Enables you to write chatdown code and see it live in the embedded bot emulator window.

Done in pure HTML and Javascript, reusing the chatdown tools (https://github.com/Microsoft/botbuilder-tools)

Drop the files into an Azure Storage Blob and run the ChatDownExplorer.html. Or drop them into your favorite webserver.

An experimental version with the Monaco editor is also available.

Chat files can be loaded and saved locally or downloaded from an URL. Transcript files can also be saved locally.

![Image](/ChatDown%20Explorer/screenshot.png "Screenshot")

## ChatDown Libraries

A list of ChatDown flows, organized by industry, demonstrating "happy path" conversations.

### Try it

Here: https://lambot.blob.core.windows.net/public/ChatDownExplorer.html

or here with the Monaco editor: https://lambot.blob.core.windows.net/public/ChatDownExplorer_monaco.html

## Possible future developments 

with no specific order:
- Choose between Monaco or Textarea version
- Develop a cooperative solution that enables two persons to build the chat performing role playing in two different computers. One is the bot, the other is a user.
