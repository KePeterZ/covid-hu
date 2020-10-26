import axios from "axios"
import { JSDOM } from "jsdom"

export const max = (num: number, max: number) => num>max ? max : num

export const getNews = async (pageNumber=1) => {
  let dom = new JSDOM(await (await axios.get(`https://koronavirus.gov.hu/hirek?page=${pageNumber}`)).data)
  let newsArray = Array.from(dom.window.document.querySelectorAll("div.article-teaser"))
  let news = newsArray.map(e => {
    return { 
      title: e.querySelector("h3")?.textContent as string,
      date: e.querySelector("i")?.textContent as string,
      teaser: Array.from(e.querySelectorAll("p")).sort((a, b) => {
        return (b.textContent?.length as number) - (a.textContent?.length as number)
      })[0].textContent as string,
      img: e.querySelector("img")?.src as string,
      link: "https://koronavirus.gov.hu" + e.querySelector("a")?.href as string
    }
  })
  return news
}

export const getNumbers = async () => {
  let dom = new JSDOM(await (await axios.get("https://koronavirus.gov.hu/")).data)
  let apiData = Array.from(dom.window.document.querySelector(".alittleHelpForYourAPI")?.children as HTMLCollection)
  let apiObject: any = {};
  apiData.forEach(e => {
    apiObject[(e.getAttribute("id") as string).slice(4)] = Number.parseInt(e.textContent?.replace(/\s/g, "") as string)
  })
  apiObject["fertozott-lokal"] = apiObject["fertozott-pest"] + apiObject["fertozott-videk"]
  apiObject["elhunyt-lokal"] = apiObject["elhunyt-pest"] + apiObject["elhunyt-videk"]
  return apiObject
}

export const getPages = async (pageAmount: number) => {
  let pages = []
  for(let pageNumber=0; pageNumber<pageAmount; pageNumber++) {
    pages.push(getNews(pageNumber))
  }
  pages = await Promise.all(pages)
  let allPages = pages.reduce((obj, elem) => obj.concat(elem))
  return allPages as Array<typeof allPages[0]>
}

export const getNumberChanges = async (pagesToScan: number) => {
  let pagesScanned = await getPages(pagesToScan)
  let articles = pagesScanned.filter((elem) => elem.link.includes("fovel-emelkedett"))
  let changesWithDates = articles.map(e => {
    let numbersFromChange: number[] = e.title.match(/\d+/g)?.map(Number) ?? []
    return {
      infected: numbersFromChange[0],
      deaths: numbersFromChange[1],
      date: e.date.split(" ").slice(0,3).join(" ")
    }
  })
  return changesWithDates
}

export const mainAPI = async () => {
  let newsPage1 = getNews()
  let newsPage2 = getNews(2)
  let numbers = getNumbers()
  let numberChanges = getNumberChanges(2)
  return { 
    news: (await newsPage1).concat(await newsPage2),
    numbers: await numbers,
    latestNumbers: (await numberChanges)[0]
  }
}