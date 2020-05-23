// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer')
// const puppeteer = require('puppeteer-extra')

// add stealth plugin and use defaults (all evasion techniques)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth')
// puppeteer.use(StealthPlugin())

const navigationPromise = async (page) => {
  page.waitForNavigation({
    waitUntil: ['networkidle2']
  })
}

const userAgent = require('user-agents')

;(async () => {
  const url = 'https://accounts.douban.com/passport/login'
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    defaultViewport: {
      width: 1920,
      height: 1080
    }
  })
  const page = await browser.newPage()
  let originalImage = ''
  await page.setRequestInterception(true)
  page.on('request', (request) => request.continue())
  await page.setUserAgent(userAgent.toString())
  await page.goto(url, { waitUntil: ['networkidle2'] })
  await page.click('.account-tab-account')
  await page.waitForSelector('input[name="username"]')
  await page.type('input[name="username"]', process.env.username)
  await page.waitForSelector('input[name="password"]')
  await page.type('input[name="password"]', process.envpassword)

  await page.click('div[class="account-form-field-submit "]')
  await navigationPromise(page)
  await browser.close()
})()
