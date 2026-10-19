import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serve } from './serve.mjs';
import { buildIdentity, verificationIdentity } from './build-identity.mjs';

const phase = process.argv[2];
assert.ok(['before', 'after'].includes(phase));
const out = new URL(`../docs/evidence/improvement/${phase}/`, import.meta.url);
await mkdir(out, { recursive: true });
const server = await serve({ port: 0 });
const browser = await chromium.launch({ headless: true });
const record = { captured_at: new Date().toISOString(), phase, identity: buildIdentity(), verification: verificationIdentity(),
  environment: { os: process.platform, node: process.version, browser: `Chromium ${browser.version()}`, headless: true }, views: [] };
try {
  for (const [name, viewport] of [['desktop', {width:1280,height:900}], ['narrow', {width:390,height:844}]]) {
    const page = await browser.newPage({viewport, reducedMotion:'reduce'});
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator('[data-ready=true]').waitFor();
    const shot = async moment => {
      await page.screenshot({path:fileURLToPath(new URL(`${name}-${moment}.png`,out))});
      await page.screenshot({path:fileURLToPath(new URL(`${name}-${moment}-full.png`,out)),fullPage:true});
      record.views.push({name,moment,viewport,metrics:await page.evaluate(()=>({documentHeight:document.documentElement.scrollHeight,
        documentWidth:document.documentElement.scrollWidth, visibleChoices:[...document.querySelectorAll('input[type=radio]')].filter(el=>el.getClientRects().length).length,
        mapVisible:!!document.querySelector('.route-map').getClientRects().length}))});
    };
    await shot('start');
    const choose = async tuple => {
      const fields=['path','gate','map_evidence','notice_evidence','conclusion'];
      for(let i=0;i<5;i++) {
        const input=page.locator(`input[name="${fields[i]}"][value="${tuple[i]}"]`);
        if(!await input.isVisible()) await page.locator(`[data-step="${i<2?'plan':'reason'}"]`).first().click();
        await input.check();
      }
      await page.locator('.send').click();
      await page.locator('#feedback').scrollIntoViewIfNeeded();
      await page.evaluate(()=>document.querySelector('#feedback').scrollIntoView({block:'start'}));
    };
    await choose(['North','Willow','M1','N2','C2']);
    assert.equal(await page.locator('#check-title').textContent(),'Check where visitors can enter');
    await shot('decision');
    await choose(['South','Bell','M2','N1','C1']);
    assert.equal(await page.locator('#check-title').textContent(),'Message complete');
    await shot('complete');
    await page.close();
  }
  record.result='PASS';
} finally {
  await browser.close(); server.close();
  await writeFile(new URL('comparison-capture.json',out),JSON.stringify(record,null,2)+'\n');
}
console.log(`${phase}: six viewport and six full-page captures; ${record.environment.browser}`);
