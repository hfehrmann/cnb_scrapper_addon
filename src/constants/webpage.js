export const CNB_WEBPAGE = 'cnb';
export const AMEX_WEBPAGE = 'amex';

const cnbMatcher = {
  webpage: CNB_WEBPAGE,
  urlMatcher: url => {
    return url.match(/https:\/\/cno\.cnb\.com\/.*/) != null;
  },
};

const amexMatcher = {
  webpage: AMEX_WEBPAGE,
  urlMatcher: url => {
    return url.match(/https:\/\/global\.americanexpress\.com\/.*/) != null;
  },
};

export function allowedURL(url) {
  const allowedWebpages = [cnbMatcher, amexMatcher];

  return new Promise((resolver) => {
    allowedWebpages.forEach(webpage => {
      if (webpage.urlMatcher(url)) {
        resolver(webpage.webpage);
      }
    });
  });
}
