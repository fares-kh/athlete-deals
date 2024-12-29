const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())

app.get('/', (req, res) => {
  res.send("Hello, World!")
})

app.get('/scrape', async (req, res) => {
  try {
    const url = 'https://www.bulk.com/uk/products/peanut-butter-1kg/bpf-pbut'
    
    // Fetch the HTML of the page
    const { data } = await axios.get(url)
    console.log(data)

    // Load HTML into Cheerio for parsing
    const $ = cheerio.load(data)

    // Extract the product data
    const name = $('.header-title').text().trim() // Replace with the correct selector
    const price = $('.dropin-price').text().trim() // Replace with the correct selector
    // const imageUrl = $('.product-image img').attr('src') // Replace with the correct selector for the image

    // Return the product data in JSON format
    const productData = {
      name,
      price,
    //   imageUrl,
    }

    res.json(productData)

  } catch (err) {
    console.error("Error scraping data:", err)
    res.status(500).json({ error: "Failed to scrape data" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
