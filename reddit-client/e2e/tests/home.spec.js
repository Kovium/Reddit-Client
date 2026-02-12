import { Builder, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

const APP_URL = "http://localhost:5173/";

async function run() {
  // Optional: headless, damit kein Browser-Fenster aufpoppt
  const options = new chrome.Options();
  options.addArguments("--headless=new");

  const driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(options)
    .build();

  try {
    await driver.get(APP_URL);
    console.log("URL:", await driver.getCurrentUrl());
    console.log("TITLE:", await driver.getTitle());

    // Warte bis mindestens eine PostCard da ist
    // (Passe den Selector ggf. an deine echte Klasse an)
    for (let i = 0; i < 10; i++) {
      console.log(`Versuch ${i + 1}: checke auf .post-card`);
      try {
        const postCards = await driver.findElements(
          By.css('[data-testid="post-card"]'),
        );
        if (postCards.length > 0) {
          console.log("✅ Posts gefunden:", postCards.length);
          break;
        }
      } catch (err) {
        console.log("Fehler beim Abfragen:", err.message);
      }

      await driver.sleep(3000); // 3 Sekunden warten pro Versuch
    }

    console.log("✅ E2E Smoke Test passed: Home loaded and post-card found");
  } finally {
    await driver.quit();
  }
}

run().catch(console.error);
