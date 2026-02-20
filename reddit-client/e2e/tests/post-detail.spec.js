import { Builder, By, until } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const APP_URL = "http://localhost:5173/";

async function run() {
  const options = new chrome.Options();

  if (process.env.CI === "true") {
    options.addArguments("--headless=new");
    options.addArguments("--no-sandbox");
    options.addArguments("--disable-dev-shm-usage");
  }

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(APP_URL);
    console.log("🌐 Seite geladen:", await driver.getCurrentUrl());

    // 1) Warte auf PostCards
    const cards = await driver.wait(
      until.elementsLocated(By.css('[data-testid="post-card"]')),
      15000,
    );
    console.log("📦 Anzahl PostCards:", cards.length);

    // 2) Scroll + Klick
    await driver.executeScript("arguments[0].scrollIntoView();", cards[0]);
    await driver.sleep(300);
    await cards[0].click();

    // 3) Warte auf Detailseite
    const detailTitle = await driver.wait(
      until.elementLocated(By.css('[data-testid="post-detail-title"]')),
      10000,
    );

    console.log("✅ Detailseite geladen:", await detailTitle.getText());
  } catch (err) {
    console.error("❌ Fehler im Detailseiten-Test:", err);
  } finally {
    // await driver.quit(); // zum Debuggen auskommentieren
  }
}

run();
