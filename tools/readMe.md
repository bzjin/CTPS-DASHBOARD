All offline processing documentation and datasets can be found in this folder.

INSTRUCTIONS: 
1. Navigate to the metric in question, replace the “script src=“app.js”” in the current directory’s index.html with the appropriate path. 

2. Open index.html with an appropriate localhost/server. The console will log the “pruned” version of whatever data set the code is processing. Keep in mind that some of the console may take even up to a minute to load - offline processing was done offline for a reason - to save time and space on the actual dashboard. Some of these datasets (especially the non-interstate inventories, for instance) are very heavy and take some time to comb through. 

3. The JSON array that appears in the console is what was copy-and-pasted into a separate, often much smaller file and stored in the “JSON” folder for the dashboard. The comments in the console.log code will point to the name of the particular array that was produced.

COMMENTS: 
1. Each app.js will have some comments pointing to the reasoning behind why offline processing was done a particular way. 