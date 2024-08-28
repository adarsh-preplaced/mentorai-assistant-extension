// Get current host and current URL
const currentHost = document.location.host;
const currentUrl = window.location.href;

const config = {
    "domains": {
        "leetcode.com": {
            "patterns": [
                {
                    "urlRegex": "leetcode.com/problems/*",
                    "content": [
                        {
                            "jsPath": "div.flex.w-full.flex-1.flex-col.gap-4.overflow-y-auto.px-4.py-5 > div.elfjS",
                            "toScrape": "innerText",
                            "prefix": "Leetcode Question Description: "
                        },
                        {
                            "jsPath": "#editor > div.flex.flex-1.flex-col.overflow-hidden.pb-2 > div.flex-1.overflow-hidden > div > div > div.overflow-guard > div.monaco-scrollable-element.editor-scrollable.vs-dark.mac > div.lines-content.monaco-editor-background > div.view-lines.monaco-mouse-cursor-text",
                            "toScrape": "innerText",
                            "prefix": "User Code: "
                        }
                    ]
                },
                {
                    "urlRegex": "https://leetcode.com/explore/learn/*",
                    "content": [
                        {
                            "jsPath": "div.some-class-for-learn-section",
                            "toScrape": "innerText",
                            "prefix": "Leetcode Learn Section: "
                        }
                    ]
                }
            ]
        },
        "youtube.com": {
            "patterns": [
                {
                    "urlRegex": "youtube.com/watch/*",
                    "content": [
                        {
                            "jsPath": "#title > h1",
                            "toScrape": "innerText",
                            "prefix": "Youtube Video Title: "
                        }
                    ]
                }
            ]
        },
        "takeuforward.org": {
            "patterns": [],
            "default":  [
                {
                    "jsPath": "#root > div:nth-child(1) > div.flex.h-screen.overflow-hidden.font-primary.bg-\\[\\#fafafa\\].dark\\:bg-dark > div.relative.flex.flex-col.flex-1.overflow-y-auto.overflow-x-hidden > section",
                    "toScrape": "innerText",
                    "prefix": "Page Content:"
                }
            ]
        }
    }
}

// Function to check if the current URL matches the regex pattern
function urlMatches(pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));  // Convert wildcard to regex format
    return regex.test(currentUrl);
}

export default function scrapeData() {
    // Check if the current host is in the config domains
    console.log("scraping data")
    let scrapedData = "";
    if (config.domains.hasOwnProperty(currentHost)) {
        const patterns = config.domains[currentHost].patterns;
        console.log("scraping data for ", config.domains[currentHost])
        let patternFound = false;
        patterns.forEach(pattern => {
            if (urlMatches(pattern.urlRegex)) {
                pattern.content.forEach(item => {
                    const elements = document.querySelectorAll(item.jsPath);
                    elements.forEach(element => {
                        const data = item.toScrape === "innerText" ? element.innerText : element.innerHTML;
                        console.log(item.prefix + data.trim());
                        scrapedData+=data+"\n";
                        patternFound = true;
                    });
                });
            }
        });
        if (!patternFound && config.domains[currentHost].default) {
            config.domains[currentHost].default.forEach(item => {
                const elements = document.querySelectorAll(item.jsPath);
                elements.forEach(element => {
                    const data = item.toScrape === "innerText" ? element.innerText : element.innerHTML;
                    console.log(item.prefix + data.trim());
                    scrapedData+=data+"\n";
                });
            });
        }
    }
    return scrapedData;
}