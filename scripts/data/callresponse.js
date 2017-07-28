module.exports = [
{
	regex: /^update$/i,
	response: 'All Storj packages can be found on our github repository here: github.com/Storj.\n\nAre you looking for how to update a specific package?, type in “Help update”.\n'
},
{
	regex: /^(help update)|(update storj)$/i,
	response: 'Type in the following commands to get info on updating specific Storj packages:\n\n\t1. “Update Storj Share GUI”\n\t2. “Update Storj Share-daemon CLI”\n\t3. “Update FileZilla”\n\t4. “Update Libstorj”\n\t5. “Update Community GUI”\n\nFor info on updating packages not on this list please ask in the respective Rocketchat channel.\n'
},
{
	regex: /^update storj( |)share gui$/i,
	response: 'To update Storj Share GUI do the following:\n\n\t1. Click on “View” -> “Check for Updates”.\n\t2. Once the popup appears click on “yes”below “Would you like to download the update now?”.\n\t3. Now a Web-page should open which brings you to the Storj Share GUI github repository. Download the latest version for your system.\n\t4. Click on “File” -> “Quit”.\n\t5. Once Storj Share GUI quits install the newly downloaded executable and install it.\n\nFurther Storj Share (GUI) documentation can be found [here](https://docs.storj.io/v1.1/docs/storj-share-gui).\n\nIf you have any other Storj Share (GUI) released questions please join the #storjshare channel\n'
},
{
	regex: /^update storj( |)share( |-)daemon cli$/i,
	response: '\t1. `storjshare save`\n\t2. `storjshare killall`\n\t3. `npm install -g storjshare-daemon`\n\nOnce the new version is installed execute the following commands to start the node:\n\n\t1. `storjshare daemon`\n\t2. `storjshare load`\n\nThe node(s) should now start, to check if the nodes are running correctly execute the following command:\n\n\t`storjshare status`\n\nFurther Storj Share-daemon (CLI) documentation can be found [here](https://docs.storj.io/v1.1/docs/storj-share-daemon-cli).\n\nIf you have any other Storj Share-damon (CLI) released questions please join the #storjshare channel\n'
},
{
	regex: /^update filezilla$/i,
	response: 'FileZilla will automatically prompt you if a new update is available when you restart it.\n\nFor more info on FileZilla please consult the official documentation in the links below:\n\n\t1. https://wiki.filezilla-project.org/Documentation\n\t2. https://docs.storj.io/v1.1/docs/filezilla-getting-started\n\t3. https://wiki.filezilla-project.org/Storj\n'
},
{
	regex: /^update libstorj$/i,
	response: 'The latest Libstorj release for your specific OS can be found [here](https://github.com/Storj/libstorj/releases)\n'
},
{
	regex: /^update community gui$/i,
	response: 'The latest community made GUI release for up-and downloading for your specific OS can be found [here](https://github.com/lakewik/storj_gui_client/releases)\n'
},
{
	regex: /^(faq)|(frequently asked questions)$/i,
	response: 'The Storj FAQ can be found [here](https://storj.io/faq).\n'
},
{
	regex: /^newbie$/i,
	response: 'newbie Looks like we have a new user.\n\n\n\t1. Put up a profile picture, we like pics especially of cats.\n\t2. Fill in the New volunteer Form if you have some skills to offer: goo.gl/pr1nYQ.\n\t3. When entering new channels first scroll up and read previous comments before repeating the same questions that have already been answered.\n\t4. Have fun and respect others\' opinion!\n'
}
];