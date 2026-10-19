import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { serve } from './serve.mjs';
import { buildIdentity, verificationIdentity } from './build-identity.mjs';
import { fixture, tuples, expectedResult } from '../tests/oracle.mjs';
import { checkInteractions } from './interaction-check.mjs';

const out = new URL('../docs/evidence/improvement/after/', import.meta.url);
await mkdir(out, { recursive:true });
const server = await serve({ port:0 });
const url = `http://127.0.0.1:${server.address().port}`;
const report = { captured_at:new Date().toISOString(), identity:buildIdentity(), verification:verificationIdentity(),
  lane:'automated browser checks; not human accessibility or device acceptance', browsers:[], checks:[], limitations:[
    'Desktop headless engines and emulated viewports; no physical iPad or Safari/VoiceOver/NVDA checks.',
    '320 CSS pixel reflow and 200% text enlargement are proxies; actual 400% browser zoom and human assistive-technology review remain pending.',
    'No intended-age learner, educator, disabled-player, owner-acceptance or release evidence.',
  ] };
let browser;
const note = (name, details = {}) => { report.checks.push({ name, result:'PASS', ...details }); console.log(`PASS: ${name}`); };
const activeId = page => page.evaluate(() => document.activeElement.id);
const selected = page => page.locator('input:checked').evaluateAll(inputs => inputs.map(i => [i.name,i.value]));
const choose = async (page, tuple) => {
  for (let i=0;i<5;i++) {
    const field = fixture.input.field_order[i];
    if (!await page.locator(`#${field}`).isVisible()) await page.locator(`.steps [data-step="${i<2?'plan':'reason'}"]`).click();
    if (tuple[i] === null) await page.locator(`[data-clear="${fixture.input.field_order[i]}"]`).click();
    else await page.locator(`input[name="${fixture.input.field_order[i]}"][value="${tuple[i]}"]`).check();
  }
};
try {
  console.log('Starting Chromium browser checks…');
  browser = await chromium.launch({ headless:true, timeout:60000 });
  report.browsers.push({ engine:'Chromium', version:browser.version() });
  const context = await browser.newContext({ viewport:{width:1280,height:900}, reducedMotion:'reduce' });
  const page = await context.newPage();
  const errors = []; const requests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push({ method:request.method(), url:request.url() }));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(url);
  await page.locator('[data-ready=true]').waitFor();
  assert.equal((await selected(page)).length,0);
  assert.equal(await page.locator('input[required]').count(),0);
  assert.equal(await page.locator('input').count(),11);
  assert.equal(await page.locator('#feedback').isVisible(),false);
  assert.equal(await page.locator('#explanation').isVisible(),false);
  for (const fact of [...fixture.sources.route_guide.facts,...fixture.sources.festival_notice.facts]) {
    assert.equal((await page.locator(`#${fact.id} span`).last().textContent()).trim(),fact.text);
  }
  const ids = await page.locator('[id]').evaluateAll(items=>items.map(item=>item.id));
  assert.equal(new Set(ids).size,ids.length);
  note('Blank start, independent native controls, authored sources, unique DOM targets');
  await page.screenshot({path:fileURLToPath(new URL('desktop-start.png',out)),fullPage:true});

  await page.locator('.send').click();
  assert.equal(await activeId(page),'result-title');
  assert.equal(await page.locator('#issues > li').count(),5);
  const firstSource = page.locator('#issues [data-target="M1"]').first();
  await firstSource.click(); assert.equal(await activeId(page),'M1');
  await page.locator('#return-to-message').click();
  assert.equal(await firstSource.evaluate(el=>el===document.activeElement),true);
  await page.getByRole('button',{name:'Revise',exact:true}).click();
  assert.equal(await page.evaluate(()=>document.activeElement.name),'path');
  note('Blank Send, single result focus, exact source target and invoking-control restoration, revision focus');

  await choose(page,['South','Willow','M2','N2','C2']);
  await page.locator('.send').click();
  assert.equal(await page.locator('#issues > li').count(),6);
  const draftBefore = await selected(page);
  await page.getByRole('button',{name:'Show explanation',exact:true}).click();
  assert.deepEqual(await selected(page),draftBefore);
  assert.equal(await page.getByRole('button',{name:'Show explanation',exact:true}).getAttribute('aria-expanded'),'true');
  await page.locator('#explanation [data-target="conclusion"]').click();
  assert.equal(await activeId(page),'conclusion');
  await page.locator('#return-to-message').click();
  assert.equal(await page.locator('#explanation [data-target="conclusion"]').evaluate(el=>el===document.activeElement),true);
  note('Mixed-error secondary rows, explicit reveal without correction, conclusion link and return');

  await choose(page,['South','Bell','M2','N1','C1']);
  assert.match(await page.locator('#submission-note').textContent(),/last sent message/);
  const recipientBefore = await page.locator('#recipient-text').textContent();
  assert.equal(recipientBefore,fixture.overrides[4].text);
  await page.locator('.send').click();
  assert.equal(await page.locator('#check-title').textContent(),'Message complete');
  assert.match(await page.locator('#submission-note').textContent(),/answer help/);
  await page.getByRole('button',{name:'Inspect sources',exact:true}).click();
  assert.equal(await activeId(page),'route_guide');
  await page.locator('#return-to-message').click();
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  assert.equal(await activeId(page),'request');
  assert.equal((await selected(page)).length,0);
  assert.equal(await page.locator('#feedback').isVisible(),false);
  assert.match(await page.locator('#session-label').textContent(),/Replay/);
  note('Submitted feedback remains stable during edits, assisted completion, inspect sources, explicit replay reset');
  await checkInteractions(page,note);

  // Full connected DOM sweep. Native events drive the same public controls as manual input.
  for (const tuple of tuples()) {
    await page.evaluate(({tuple,fields}) => {
      for (let i=0;i<fields.length;i++) {
        if(tuple[i]===null) document.querySelector(`[data-clear="${fields[i]}"]`).click();
        else {
          const input=document.querySelector(`input[name="${fields[i]}"][value="${tuple[i]}"]`);
          input.checked=true; input.dispatchEvent(new Event('change',{bubbles:true}));
        }
      }
      document.querySelector('#message-form').requestSubmit();
    },{tuple,fields:fixture.input.field_order});
    const dom=await page.evaluate(()=>({
      recipient:document.querySelector('#recipient-text').textContent,
      heading:document.querySelector('#check-title').textContent,
      status:document.querySelector('#source-status').textContent,
      statusLinks:[...document.querySelectorAll('#status-links [data-target]')].map(b=>b.dataset.target),
      actions:[...document.querySelectorAll('#actions button')].map(b=>b.textContent),
      rows:[...document.querySelectorAll('#issues > li')].map(row=>({code:row.dataset.issue,text:row.querySelector('p').textContent,links:[...row.querySelectorAll('[data-target]')].map(b=>b.dataset.target)})),
    }));
    const expected=expectedResult(tuple);
    assert.deepEqual(dom,{recipient:expected.recipient_text,heading:expected.feedback_heading,status:expected.source_status.text,statusLinks:expected.source_status.links,actions:expected.source_status.actions,rows:expected.source_rows},JSON.stringify(tuple));
  }
  note('All 324 connected UI outputs match independent oracle, including exact text/rows/link order/actions');

  const beforeInvalid = await selected(page);
  await page.evaluate(()=>{
    const input=document.querySelector('input[name=path]'); const old=input.value;
    input.value='invalid'; input.dispatchEvent(new Event('change',{bubbles:true})); input.value=old;
  });
  assert.match(await page.locator('#failure').textContent(),/draft is still here/);
  assert.deepEqual(await selected(page),beforeInvalid);
  note('Malformed control input reports an implementation failure and retains draft');

  await choose(page,['South','Willow',null,'N2','C3']); await page.locator('.send').click();
  const a11y = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();
  report.axe={version:a11y.testEngine.version,violations:a11y.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})),incomplete:a11y.incomplete.map(v=>v.id)};
  assert.deepEqual(report.axe.violations,[]);
  note('Automated axe scan of mixed-error feedback', {incomplete:report.axe.incomplete});

  // Keyboard-only blank-to-complete sequence through the entire scene.
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  for(const [field,value] of Object.entries({path:'South',gate:'Bell',map_evidence:'M2',notice_evidence:'N1',conclusion:'C1'})) {
    if(field==='map_evidence') {
      for(let steps=0;steps<20;steps++) {
        if(await page.locator('.next').evaluate(el=>el===document.activeElement)) break;
        await page.keyboard.press('Tab');
      }
      assert.equal(await page.locator('.next').evaluate(el=>el===document.activeElement),true);
      await page.keyboard.press('Enter');
    }
    for(let steps=0;steps<100;steps++) {
      if(await page.evaluate(field=>document.activeElement?.name===field,field)) break;
      await page.keyboard.press('Tab');
    }
    assert.equal(await page.evaluate(()=>document.activeElement.name),field);
    // Native tab entry can retain the most recently focused radio after a reset.
    // Use the group's actual focused value, rather than assume its first option.
    for(let arrows=0;arrows<4;arrows++) {
      if(await page.evaluate(()=>document.activeElement.value)===value) break;
      await page.keyboard.press('ArrowRight');
    }
    await page.keyboard.press('Space');
    assert.equal(await page.evaluate(()=>document.activeElement.value),value);
  }
  for(let steps=0;steps<20;steps++) {
    if(await page.locator('.send').evaluate(el=>el===document.activeElement)) break;
    await page.keyboard.press('Tab');
  }
  assert.equal(await page.locator('.send').evaluate(el=>el===document.activeElement),true);
  await page.keyboard.press('Enter');
  assert.equal(await activeId(page),'result-title');
  assert.equal(await page.locator('#check-title').textContent(),'Message complete');
  note('Keyboard-only full loop: Tab, native radio arrows/Space, Enter Send');
  await page.screenshot({path:fileURLToPath(new URL('desktop-complete.png',out)),fullPage:true});

  await page.setViewportSize({width:320,height:900});
  const assertReflow = async label => {
    const widths=await page.evaluate(()=>({viewport:innerWidth,body:document.body.scrollWidth,doc:document.documentElement.scrollWidth}));
    assert.ok(widths.body<=widths.viewport+1 && widths.doc<=widths.viewport+1,`${label}: ${JSON.stringify(widths)}`);
  };
  await assertReflow('320 CSS pixels');
  assert.equal(await page.locator('.route-map').isVisible(),true);
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  await checkInteractions(page,note);
  await choose(page,['South','Bell','M2','N1','C1']); await page.locator('.send').click();
  await page.screenshot({path:fileURLToPath(new URL('narrow-complete.png',out)),fullPage:true});
  await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  await assertReflow('320 CSS pixels plus 200% text');
  await page.evaluate(()=>{document.documentElement.style.fontSize='';});
  note('320 CSS pixel reflow and 200% root text enlargement; no horizontal document overflow');

  const contrasts=await page.evaluate(()=>{
    const rgb=text=>text.match(/[\d.]+/g).slice(0,3).map(Number);
    const luminance=color=>rgb(color).map(x=>{const v=x/255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,x,i)=>sum+x*[.2126,.7152,.0722][i],0);
    const ratio=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
    const sample=(selector,background,kind)=>{
      const style=getComputedStyle(document.querySelector(selector));
      const bg=getComputedStyle(document.querySelector(background)).backgroundColor;
      return {selector,kind,foreground:style.color,background:bg,ratio:ratio(style.color,bg)};
    };
    const records=[sample('.visitor','body','text'),sample('.hint','.composer','text'),sample('.source-link','.feedback','text'),sample('.recipient p','.recipient','text'),sample('.send','.send','text'),sample('.card-eyebrow','.source-card','text')];
    // body inherits its background from the root; use the actual painted root surface.
    records[0].background=getComputedStyle(document.documentElement).backgroundColor;
    records[0].ratio=ratio(records[0].foreground,records[0].background);
    const style=selector=>getComputedStyle(document.querySelector(selector));
    const color=value=>{const element=document.createElement('span');element.style.color=value;return element.style.color;};
    for(const [foreground,background,kind] of [
      [style('.choice').borderTopColor,style('.composer').backgroundColor,'control boundary'],
      [style('.choice:has(input:checked)').borderTopColor,style('.choice:has(input:checked)').backgroundColor,'selected boundary'],
      [color(style(':root').getPropertyValue('--focus')),style('.composer').backgroundColor,'light focus'],
      [color(style(':root').getPropertyValue('--amber')),style('.recipient').backgroundColor,'dark focus'],
    ]) records.push({kind,foreground,background,ratio:ratio(foreground,background)});
    return records;
  });
  for(const item of contrasts) assert.ok(item.ratio>=(item.kind==='text'?4.5:3),JSON.stringify(item));
  report.contrast=contrasts;
  note('Measured representative text >=4.5:1 and control/focus palettes >=3:1', {samples:contrasts.length});

  const postReadyRequests=requests.length;
  await context.setOffline(true);
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  await choose(page,['South','Bell','M2',null,'C1']); await page.locator('.send').click();
  await page.getByRole('button',{name:'Revise',exact:true}).click();
  await page.locator('input[name=notice_evidence][value=N1]').check(); await page.locator('.send').click();
  assert.equal(await page.locator('#check-title').textContent(),'Message complete');
  await page.getByRole('button',{name:'Replay',exact:true}).click();
  assert.equal(requests.length,postReadyRequests);
  const storage=await page.evaluate(async()=>({local:localStorage.length,session:sessionStorage.length,cookie:document.cookie,dbs:(await indexedDB.databases()).length,caches:(await caches.keys()).length,workers:(await navigator.serviceWorker.getRegistrations()).length}));
  assert.deepEqual(storage,{local:0,session:0,cookie:'',dbs:0,caches:0,workers:0});
  assert.deepEqual(await context.cookies(),[]);
  assert.ok(requests.every(r=>r.url.startsWith(url) && r.method==='GET'));
  assert.deepEqual(errors,[]);
  note('Offline revision, completion and Replay; no subsequent requests, writes, cookies or learner storage', {initial_requests:requests.length,storage});
  await context.setOffline(false);
  await choose(page,['South','Bell','M2','N1','C1']);
  await page.reload(); await page.locator('[data-ready=true]').waitFor();
  assert.equal((await selected(page)).length,0);
  note('Online reload clears draft; no restoration promise');
  await context.close(); await browser.close(); browser=null;

  // Supplemental engines are reported separately; WebKit on Windows is not physical iPad Safari.
  for(const [name,engine] of [['Firefox',firefox],['WebKit',webkit]]) {
    let other;
    console.log(`Starting supplemental ${name} smoke…`);
    try { other=await engine.launch({headless:true,timeout:60000}); }
    catch(error) { report.browsers.push({engine:name,result:'UNAVAILABLE',reason:error.message.split('\n')[0]}); continue; }
    try {
      const p=await other.newPage({viewport:{width:390,height:844}});
      await p.goto(url); await p.locator('[data-ready=true]').waitFor();
      await choose(p,['South','Bell','M2','N1','C1']); await p.locator('.send').click();
      assert.equal(await p.locator('#check-title').textContent(),'Message complete');
      await p.getByRole('button',{name:'Replay',exact:true}).click(); assert.equal((await selected(p)).length,0);
      report.browsers.push({engine:name,version:other.version(),result:'PASS',scope:'complete + replay smoke at 390 CSS pixels'});
    } finally { await other.close(); }
  }
  report.result='PASS';
} catch(error) {
  report.result='FAIL'; report.error=error.stack; process.exitCode=1;
} finally {
  if(browser) await browser.close();
  server.close();
  await writeFile(new URL('browser-results.json',out),JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
}
