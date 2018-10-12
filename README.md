# Edinburgh Bus Timetable for iOS using Scriptable

## Description

This application enables you to easily get Edinburgh bus times using Siri shortcuts.  It is implmented on Scriptable by Simon Støvring - available on the Apple app store ([https://itunes.apple.com/gb/app/scriptable/id1405459188?mt=8](https://itunes.apple.com/gb/app/scriptable/id1405459188?mt=8))

## Usage

### API

**Note:**  a valid API key is required before you can access the bustracker API (see: [http://www.mybustracker.co.uk/?page=API%20Key](http://www.mybustracker.co.uk/?page=API%20Key))

### MD5

The script converts the API key into an MD5 hash.  My script implements blueimp implementation - [available here](https://github.com/blueimp/JavaScript-MD5).  The script needs to be stored on your iCloud in the Scriptable folder to make everything work.

### Keychain

I've chosen to hide my API key using the Scriptable Keychain.  To set yours, run the following:

let key = Keychain.set('busapi','your_private_code')

[![IMAGE ALT TEXT HERE](https://img.youtube.com/vi/SilvolPQ5a4/0.jpg)](https://youtu.be/SilvolPQ5a4)

Feedback always appreciated!
