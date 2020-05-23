const puppeteer = require('puppeteer')
const Rembrandt = require('rembrandt')

/**
 * @ref https://medium.com/@filipvitas/how-to-bypass-slider-captcha-with-js-and-puppeteer-cd5e28105e3c
 */
async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    defaultViewport: { width: 1920, height: 1080 }
  })
  const page = await browser.newPage()
  let originImage = ''
  await page.setRequestInterception(true)
  page.on('request', (request) => request.continue())
  page.on('response', async (response) => {
    if (response.request().resourceType() === 'image') {
      originImage = await response.buffer().catch(() => {})
    }
  })

  await page.goto('https://monoplasty.github.io/vue-monoplasty-slide-verify')

  const sliderElement = await page.$('.slide-verify-slider')
  const slider = await sliderElement.boundingBox()

  const sliderHandle = await page.$('.slide-verify-slider-mask-item')
  const handle = await sliderHandle.boundingBox()

  let currentPosition = 0
  let bestSlider = {
    position: 0,
    difference: 100
  }

  await page.mouse.move(
    handle.x + handle.width / 2,
    handle.y + handle.height / 2
  )
  await page.mouse.down()

  while (currentPosition < slider.width - handle.width / 2) {
    await page.mouse.move(
      handle.x + currentPosition,
      handle.y + handle.height / 2 + Math.random() * 10 - 5
    )

    const sliderContainer = await page.$('.slide-verify')
    const sliderImage = await sliderContainer.screenshot()
    const rembrandt = new Rembrandt({
      imageA: originImage,
      imageB: sliderImage,
      thresholdType: Rembrandt.THRESHOLD_PERCENT
    })

    const result = await rembrandt.compare()
    const difference = result.percentageDifference * 100
    if (difference < bestSlider.difference) {
      bestSlider.difference = difference
      bestSlider.position = currentPosition
    }

    currentPosition += 5
  }

  await page.mouse.move(
    handle.x + bestSlider.position.handle.y + handle.height / 2,
    {
      steps: 10
    }
  )
  await page.mouse.up()
  await browser.close()
}

run()
