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

app.get('/scrape', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
        headless: true,
      })

    const page = await browser.newPage()

    const BULK_POWDERS = 'https://www.bulk.com/uk/products/peanut-butter-1kg/bpf-pbut'

    await page.goto(BULK_POWDERS, { waitUntil: 'networkidle2' })

    await page.waitForSelector('.header-title')
    await page.waitForSelector('.dropin-price')

    const bulkPowdersName = await page.$eval('.header-title', (el) => el.textContent.trim())
    const bulkPowdersPrice = await page.$eval('.dropin-price', (el) => el.textContent.trim())

    const MY_PROTEIN = 'https://www.myprotein.com/p/sports-nutrition/all-natural-peanut-butter/10530743/'

    await page.goto(MY_PROTEIN, { waitUntil: 'networkidle2' })

    await page.waitForSelector('#product-title')
    await page.waitForSelector('.price')

    const myProteinName = await page.$eval('#product-title', (el) => el.textContent.trim())
    const myProteinPrice = await page.$eval('.price', (el) => el.textContent.trim())

    // Optionally, extract the product image URL
    // const imageUrl = await page.$eval('.product-image img', (img) => img.src)

    await browser.close()

    res.json({
        bulk: {
        product: {
            name: bulkPowdersName,
            price: bulkPowdersPrice
        },
        },
        myprotein: {
        product: {
            name: myProteinName,
            price: myProteinPrice
        }
        }
    })
  } catch (err) {
    console.error("Error scraping data:", err)
    res.status(500).json({ error: "Failed to scrape data" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
