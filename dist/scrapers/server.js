"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
const cors = require('cors');
app.use(cors());
app.get('/', (req, res) => {
    res.send("Hello, World!");
});
var Providers;
(function (Providers) {
    Providers["BULK_POWDERS"] = "bulk";
    Providers["MY_PROTEIN"] = "myprotein";
})(Providers || (Providers = {}));
app.get('/scrape', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const providers = Object.values(Providers);
        providers.map((provider) => {
            console.log(provider);
        });
        const browser = yield puppeteer.launch({
            headless: true,
        });
        const page = yield browser.newPage();
        const BULK_POWDERS = 'https://www.bulk.com/uk/products/peanut-butter-1kg/bpf-pbut';
        yield page.goto(BULK_POWDERS, { waitUntil: 'networkidle2' });
        yield page.waitForSelector('.header-title');
        yield page.waitForSelector('.dropin-price');
        const bulkPowdersName = yield page.$eval('.header-title', (el) => el.textContent.trim());
        const bulkPowdersPrice = yield page.$eval('.dropin-price', (el) => el.textContent.trim());
        const MY_PROTEIN = 'https://www.myprotein.com/p/sports-nutrition/all-natural-peanut-butter/10530743/';
        yield page.goto(MY_PROTEIN, { waitUntil: 'networkidle2' });
        yield page.waitForSelector('#product-title');
        yield page.waitForSelector('.price');
        const myProteinName = yield page.$eval('#product-title', (el) => el.textContent.trim());
        const myProteinPrice = yield page.$eval('.price', (el) => el.textContent.trim());
        // Optionally, extract the product image URL
        // const imageUrl = await page.$eval('.product-image img', (img) => img.src)
        yield browser.close();
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
        });
    }
    catch (err) {
        console.error("Error scraping data:", err);
        res.status(500).json({ error: "Failed to scrape data" });
    }
}));
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
