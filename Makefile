chrome:
	@cp manifest.chrome.json manifest.json
	@cp popup/choose_scrapper.chrome.js popup/choose_scrapper.js

firefox:
	@cp manifest.firefox.json manifest.json
	@cp popup/choose_scrapper.firefox.js popup/choose_scrapper.js

clean:
	@rm manifest.json popup/choose_scrapper.js