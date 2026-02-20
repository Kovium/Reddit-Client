import { Builder, By, Key, until } from "selenium-webdriver";
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
    console.log("🌐 Seite geladen");

    // Warte auf Search Input
    const searchInput = await driver.wait(
      until.elementLocated(By.css('[data-testid="search-input"]')),
      10000,
    );

    console.log("🔎 SearchInput gefunden");

    // Begriff eingeben
    await searchInput.sendKeys("react", Key.RETURN);
    console.log("⌨️ 'react' eingegeben");

    // Warten bis neue PostCards geladen sind
    const posts = await driver.wait(
      until.elementsLocated(By.css('[data-testid="post-card"]')),
      15000,
    );

    console.log(`📦 ${posts.length} Posts nach Suche gefunden`);

    if (posts.length === 0) {
      throw new Error("❌ Keine Posts nach Suche gefunden");
    }

    console.log("✅ Search E2E Test erfolgreich");
  } catch (err) {
    console.error("❌ Search E2E Test fehlgeschlagen:", err);
  } finally {
    // await driver.quit(); // Debug offen lassen
  }
}

run();
