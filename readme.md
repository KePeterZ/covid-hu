# covidgovhu
An unofficial API for `koronavirus.gov.hu`.

# Default setup
By default, covidgovhu is a TypeScript library, found in `src/govhu.ts`, however, if you want to interface with it from another language, there is `src/server.ts`, that can be used to create your own API server. Using that, you can communicate with any application with your own API calls, or the pre-written ones. 

# Using as a Library
There are several functions in the `govhu.ts` file, explained here.

## `getPages(pageAmount)`
This will download an amount of pages defined in pageAmount, and will return it as a list of articles.

## `getNews(pageNumber)`
This function is used to download and parse a single page containing news, and is depended on by in the other functions. Will return an array of objects, with the following structure: 
- `title`: the title of the article
- `date`: the publishing date of the article
- `teaser`: the short text summarizing the article
- `img`: the image (or banner) of the article
- `link`: the link to access the article

## `getNumbers()`
This function parses the current infection numbers, for example: 
```json
{
  "fertozott-pest": 12094,
  "fertozott-videk": 31506,
  "gyogyult-pest": 4756,
  "gyogyult-videk": 11735,
  "elhunyt-pest": 532,
  "elhunyt-videk": 940,
  "karantenban": 28070,
  "mintavetel": 990383,
  "elhunyt-global": 1154746,
  "fertozott-global": 43121946,
  "gyogyult-global": 28989995,
  "fertozott-lokal": 43600,
  "elhunyt-lokal": 1472
}
```

## `getNumberChanges(pagesToScan)`
`getNumberChanges` will retrieve the infection rates on a given day, or more precisely, will return a list of infection rates from a specified amount of pages. Since `koronavirus.gov.hu` doesn't make this data easily available (it's just an article, like the others), `covidgovhu` has to manually scan a given amount of pages, to get the results. So `pagesToScan` is roughly the amount of dates that will be returned, but this can change if a lot of articles were published on a day. 

## `mainAPI()`
This is the main function of the whole program. This just returns an object, containing 2 pages of articles, the current numbers regarding the virus in the country, and the latest infection rates. This is the main `/` route of the API, and should be somehow cached.

# ___Warning!___
This project is just a parser for the Hungarian coronavirus website, and could break at anytime. Because of that, __USE WITH CAUTION__.

# KePeterZ, 2020