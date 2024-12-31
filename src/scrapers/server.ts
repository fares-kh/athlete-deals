const express = require('express')
const puppeteer = require('puppeteer')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
  res.send("Hello, World!")
})

enum Providers {
  BULK_POWDERS = 'bulk',
  MY_PROTEIN = 'myprotein'
}

enum SearchQueries {
  PEANUT_BUTTER = 'peanutbutter',
  POWDER = 'powder'
}

const domElements: Record<Providers, Record<string, string>> = {
  [Providers.BULK_POWDERS]: {
    name: '.header-title',
    price: '.dropin-price',
  },
  [Providers.MY_PROTEIN]: {
    name: '#product-title',
    price: '.price',
  }
}

const providerUrls: Record<Providers, string> = {
  [Providers.BULK_POWDERS]: 'https://www.bulk.com/uk/products/',
  [Providers.MY_PROTEIN]: 'https://www.myprotein.com/p/sports-nutrition/',
};

const searchQueryUrls: Record<SearchQueries, Record<Providers, string>> = {
  [SearchQueries.PEANUT_BUTTER]: {
    [Providers.BULK_POWDERS]: 'peanut-butter-1kg/bpf-pbut',
    [Providers.MY_PROTEIN]: 'all-natural-peanut-butter/10530743/',
  },
  [SearchQueries.POWDER]: {
    [Providers.BULK_POWDERS]: '/',
    [Providers.MY_PROTEIN]: '/',
  }
};

app.get('/scrape', async (req, res) => {
  try {
    const providers = Object.values(Providers)
    const browser = await puppeteer.launch({
      headless: true,
    })

    const searchQuery = SearchQueries.PEANUT_BUTTER // change this dep on search query
    const queryUrls = searchQueryUrls[searchQuery]

    const results = await Promise.all(
      providers.map(async (provider) => {
      const url = `${providerUrls[provider]}${queryUrls[provider]}`
      const page = await browser.newPage()
      await page.goto(url, { waitUntil: 'networkidle2' })

      await page.waitForSelector(domElements[provider].name)
      await page.waitForSelector(domElements[provider].price)

      const logName = await page.$eval(domElements[provider].name, (el) => el.textContent.trim())
      const logPrice = await page.$eval(domElements[provider].price, (el) => el.textContent.trim())
      return {
        [provider]: {
          product: {
            name: logName,
            price: logPrice,
          }
        },
      }
    }))

    await browser.close()

    const responseJson = results.reduce((acc, result) => {
      return {...acc, ...result}
    }, {})

    res.json(responseJson)

  } catch (err) {
    console.error("Error scraping data:", err)
    res.status(500).json({ error: "Failed to scrape data" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
