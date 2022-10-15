chrome:
	@cp manifest.chrome.json manifest.json
	@cp popup/choose_scrapper.chrome.js popup/choose_scrapper.js
	@cp dependencies/chrome.js content_scripts/dep.js

firefox:
	@cp manifest.firefox.json manifest.json
	@cp popup/choose_scrapper.firefox.js popup/choose_scrapper.js
	@cp dependencies/firefox.js content_scripts/dep.js

clean:
	@rm manifest.json popup/choose_scrapper.js content_scripts/dep.js
