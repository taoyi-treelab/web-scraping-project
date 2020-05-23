const puppeteer = require('puppeteer')

// navigating to https://www.google.com and saving a screenshot as example.png
async function example1() {
  // launch a browser instance
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.google.com')
  // default page size is 800x600
  await page.setViewport({
    width: 1920,
    height: 1080
  })
  await page.screenshot({ path: './google.png' })
  await browser.close()
}

// create a PDF
async function example2() {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  // waitUntil: when to consider navigation succeeded
  await page.goto('https://news.ycombinator.com', { waitUntil: 'networkidle2' })
  await page.pdf({ path: 'hn.pdf', format: 'A4' })
  await browser.close()
}

async function getIMDB() {
  const movieUrl = 'https://www.imdb.com/title/tt8244784/?ref_=fn_al_tt_2'
  const browser = await puppeteer.launch({
    headless: false
  })
  const page = await browser.newPage()
  // make sure navigation is finished when there are no more than 2 network connections in half second
  await page.goto(movieUrl, { waitUntil: 'networkidle2' })
  // run this code inside devtool console
  const data = await page.evaluate(() => {
    const title = document.querySelector('div[class="title_wrapper"] > h1')
      .innerText
    const ratingValue = document.querySelector('span[itemprop="ratingValue"]')
      .innerText
    const ratingCount = document.querySelector('span[itemprop="ratingCount"]')
      .innerText
    return {
      title,
      ratingValue,
      ratingCount
    }
  })

  console.log(data)
  console.log('ending')
  await browser.close()
}

getIMDB()
