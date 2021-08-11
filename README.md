

# Khan Academy on a Stick Generator (2015)

kastickgen is a simple command line tool to create custom "Khan Academy on a Stick" instances. You can choose your own content, modify the css, etc. 

See also: https://github.com/johncomposed/neoKhanStick


# Where's the content coming from?

kastickgen pulls content from [https://learningequality.org/ka-lite/](KA Lite)'s download servers based off the JSON files in their [https://github.com/learningequality/ka-lite](Github repository).

- topics are in ka-lite/kalite/topic_tools/data,
- language are in ka-lite/kalite/i18n/data,
- video size are in ka-lite/kalite/updates/data,
- video mapping are in ka-lite/kalite/i18n/data/

kastickgen ships with a copy of the JSON files from Feb 2015 in `/data`, you can update these with `kastickgen --update-json`. 



# Development

- [x] Initial CLI functions
- [x] Parsing the JSON
- [x] Choosing the content `explore -d -u -o file`
- [x] Download to archive  `download -o file -f --clear-cache`
- [x] Building with harp `demo` && `deploy`
- [x] All Together `generate`




# Shoutouts

- khan academy
- khan academy lite
- kaexplore
- gitsearch tutorial
- harpjs


