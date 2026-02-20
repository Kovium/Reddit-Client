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
    console.log("🌐 Seite geladen");

    // Warten bis FilterBar gerendert ist
    await driver.wait(
      until.elementLocated(By.css('[data-testid="filter-new"]')),
      15000,
    );
    console.log("🧭 FilterBar geladen");

    // Warten bis mindestens 1 Post existiert
    await driver.wait(
      until.elementLocated(By.css('[data-testid="post-card"]')),
      15000,
    );
    console.log("📦 PostCards geladen");

    // Ersten Titel merken
    const firstTitleElement = await driver.findElement(
      By.css('[data-testid="post-card"] .post-title'),
    );
    const firstTitleBefore = await firstTitleElement.getText();
    console.log("📌 Erster Titel vorher:", firstTitleBefore);

    // Rate-Limit Schutz
    console.log("⏳ Warte 4 Sekunden (Rate Limit Schutz)...");
    await driver.sleep(4000);

    // Filter-Button lokalisieren
    const newFilterButton = await driver.findElement(
      By.css('[data-testid="filter-new"]'),
    );

    await driver.executeScript(
      "arguments[0].scrollIntoView();",
      newFilterButton,
    );

    await driver.sleep(500);
    await newFilterButton.click();
    console.log("🔄 Filter 'new' geklickt");

    // kurze Pause nach Klick
    await driver.sleep(3000);

    // Warten bis sich Titel ändert
    await driver.wait(async () => {
      const updatedTitleElement = await driver.findElement(
        By.css('[data-testid="post-card"] .post-title'),
      );
      const updatedTitle = await updatedTitleElement.getText();
      return updatedTitle !== firstTitleBefore;
    }, 15000);

    console.log("✅ Filter E2E Test erfolgreich – Posts wurden aktualisiert");
  } catch (err) {
    console.error("❌ Filter E2E Test fehlgeschlagen:", err);
  } finally {
    await driver.quit();
  }
}

run();
