const Property = require('../models/Property');
const puppeteer = require('puppeteer');

exports.texasSiteScrap = async (req, res) => {
  const { searchTerm } = req.body;

  
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto('https://apps.hhs.texas.gov/LTCSearch/namesearch.cfm', { waitUntil: 'networkidle2' });
    
    await page.waitForSelector('#searchterm');
    await page.$eval('#searchterm', (el, value) => el.value = value, searchTerm);
    await page.waitForSelector('button.ctaButton');
    await page.click('button.ctaButton');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });


    const providers = await page.$$eval('table.sortabletable tbody tr', rows => 
        rows.map(row => ({
          name: row.querySelector('td:first-child a').textContent.trim(),
          url: row.querySelector('td:first-child a').href,
          address: row.children[1].textContent.trim(),
          city: row.children[2].textContent.trim(),
          zipCode: row.children[3].textContent.trim(),
          county: row.children[4].textContent.trim()
        }))
    );

    let results = [];

    for (const provider of providers) {
        const newPage = await browser.newPage();
        await newPage.goto(provider.url, { waitUntil: 'networkidle2' });
  
        const providerData = await newPage.evaluate(() => {
          const phoneNumber = document.querySelector('i.fa.fa-phone')?.nextSibling?.textContent.trim();
          const mapElement = document.querySelector('i.fa.fa-map-marker ~ a');
          const mapUrl = mapElement ? mapElement.href : null;
          const bedCountElement = Array.from(document.querySelectorAll('div.p7tp3-col-wrapper ul li')).find(li => li.textContent.includes('Total Bed Count'));
  
          const bedCount = bedCountElement ? bedCountElement.textContent.split(':').pop().trim() : 'N/A';
         
          console.log('bedcount', bedCount);

          return {
            phoneNumber: phoneNumber || 'N/A',
            mapUrl: mapUrl || 'N/A',
            bedCount: bedCount || 'N/A',
          };
        });
  
        results.push({ 
          provider: provider.name,
          address: provider.address,
          city: provider.city,
          zipCode: provider.zipCode,
          county: provider.county,
          phone: providerData.phoneNumber,
          capacity: providerData.bedCount || 'N/A',
          map: providerData.mapUrl,
        });

        
    
        await newPage.close(); 
    }

    await Property.bulkCreate(results);
    return res.json({ links: results});

    const pageContent = await page.content();
    await browser.close();

    return res.send(pageContent);
    //return res.json({ message: 'Texas site form submitted successfully', pageContent });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};
