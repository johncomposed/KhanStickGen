#Development

        // Requires
        // Initial CLI functions
        // Parsing the JSON
        // Choosing the content
        explore -d -u -o file
        // Download to archive 
        download -o file -f --clear-cache 
        // Building with harp
        demo
        deploy
        // All Together
        generate 









#Khan Academy on a Stick Generator 

kastickgen is a simple command line tool to create custom "Khan Academy on a Stick" instances. You can choose your own content, modify the css, etc. 

#Installation - COMING SOON
You should have node and npm installed.

Install kastickgen with:
	npm install -g kastickgen

#Usage
COMING SOON


# Where's the content coming from?

kastickgen pulls content from [https://learningequality.org/ka-lite/](KA Lite)'s download servers based off the JSON files in their [https://github.com/learningequality/ka-lite](Github repository).

- topics are in ka-lite/kalite/topic_tools/data,
- language are in ka-lite/kalite/i18n/data,
- video size are in ka-lite/kalite/updates/data,
- video mapping are in ka-lite/kalite/i18n/data/

kastickgen ships with a copy of the JSON files from Feb 2015 in `/data`, you can update these with `kastickgen --update-json`. 


# Shoutouts

- khan academy
- khan academy lite
- kaexplore
- gitsearch tutorial
- harpjs


