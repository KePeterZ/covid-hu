import axios from "axios"
import e from "express"
import { JSDOM } from "jsdom"

export const getNews = async () => {
  let dom = new JSDOM(await (await axios.get("https://koronavirus.gov.hu/hirek")).data)
  let newsArray = Array.from(dom.window.document.querySelectorAll("div.article-teaser"))
  let news = newsArray.map(e => {
    return { 
      title: e.querySelector("h3")?.textContent,
      date: e.querySelector("i")?.textContent,
      teaser: Array.from(e.querySelectorAll("p")).sort((a, b) => {
        return (b.textContent?.length as number) - (a.textContent?.length as number)
      })[0].textContent,
      img: e.querySelector("img")?.src,
      link: "https://koronavirus.gov.hu" + e.querySelector("a")?.href
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

export const mainAPI = async () => {
  let news = getNews()
  let numbers = getNumbers()
  return { 
    news: await news,
    numbers: await numbers
  }
}