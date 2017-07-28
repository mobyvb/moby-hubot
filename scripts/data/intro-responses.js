module.exports = [
  {
    regex: /^update$/i,
    response: 'All Storj packages can be found on our github repository here: github.com/Storj.\n\nAre you looking for how to update a specific package?, type in “Help update”.'
  },
  {
    regex: /(^help update$)|(^update storj$)/i,
    response: 'Type in the following commands to get info on updating specific Storj packages:\n\n\t1. “Update Storj Share GUI”\n\t2. “Update Storj Share-daemon CLI”\n\t3. “Update FileZilla”\n\t4. “Update Libstorj”\n\nFor info on updating packages not on this list please ask in the respective Rocketchat channel.'
  },
  {
    regex: /(^help update$)|(^update storj$)/i,
    response: 'Type in the following commands to get info on updating specific Storj packages:\n\n\t1. “Update Storj Share GUI”\n\t2. “Update Storj Share-daemon CLI”\n\t3. “Update FileZilla”\n\t4. “Update Libstorj”\n\nFor info on updating packages not on this list please ask in the respective Rocketchat channel.'
  },
  {
    regex: /^update ((storjshare)|(storj share)) gui$/i,
    response: 'To update Storj Share GUI do the following:\n\n\t1. Click on “View” -> “Check for Updates”.\n\t2. Once the popup appears click on “yes”below “Would you like to download the update now?”.\n\t3. Now a Web-page should open which brings you to the Storj Share GUI github repository. Download the latest version for your system\n\t4. Click on “File” -> “Quit”.\n\t5. Once Storj Share GUI quits install the newly downloaded executable and install it.\n\nFurther Storj Share (GUI) documentation can be found here: https://docs.storj.io/v1.1/docs/storj-share-gui\n\nIf you have any other Storj Share (GUI) released questions please join the #storjshare channel'
  },
  {
    regex: /(^help update$)|(^update storj$)/i,
    response: 'Type in the following commands to get info on updating specific Storj packages:\n\n\t1. “Update Storj Share GUI”\n\t2. “Update Storj Share-daemon CLI”\n\t3. “Update FileZilla”\n\t4. “Update Libstorj”\n\nFor info on updating packages not on this list please ask in the respective Rocketchat channel.'
  }
];
