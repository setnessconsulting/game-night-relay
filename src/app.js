import { content } from './content.js';
import { createSession } from './session.js';
import { preview } from './format.js';

const escape = value => String(value).replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const fieldLabels = { path:'Path', gate:'Gate', map_evidence:'Route-guide detail', notice_evidence:'Notice detail', conclusion:'Connecting conclusion' };
const linkLabel = target => ({M1:'M1 · North Path connection',M2:'M2 · South Path connection',M3:'M3 · Changing paths',N1:'N1 · Bell Gate notice',N2:'N2 · Willow Gate notice',route_guide:'Route guide',festival_notice:'Tonight’s notice',conclusion:'Your conclusion'})[target];
const links = targets => targets.map(target => `<button type="button" class="source-link" data-target="${target}">${escape(linkLabel(target))}<span aria-hidden="true"> ↗</span></button>`).join('');
const facts = (items, field) => items.map(item => `<div class="fact-card"><p class="fact" id="${item.id}" tabindex="-1"><span class="fact-id">${item.id}</span><span>${escape(item.text)}</span></p>${item.id === 'M3' ? '' : `<button type="button" class="pin" data-pin="${item.id}" data-field="${field}" aria-pressed="false">Use ${item.id} in my reason <span aria-hidden="true">＋</span></button>`}</div>`).join('');

function group(field, title, hint, options, number) {
  return `<fieldset id="${field}" tabindex="-1" aria-describedby="${field}-hint ${field}-status">
    <legend><span class="step-number">${number}</span>${title}</legend>
    <p class="hint" id="${field}-hint">${hint}</p>
    <div class="links field-sources">${links(field==='path'||field==='map_evidence'?['route_guide']:field==='gate'||field==='notice_evidence'?['festival_notice']:['route_guide','festival_notice'])}</div>
    <div class="options ${field === 'path' || field === 'gate' ? 'short-options' : ''}">
      ${options.map(([value,text]) => `<label class="choice"><input type="radio" name="${field}" value="${value}"><span>${escape(text)}</span></label>`).join('')}
    </div><div class="choice-meta"><span id="${field}-status" class="choice-status">Not selected</span><button type="button" class="clear" data-clear="${field}">Clear ${escape(fieldLabels[field].toLowerCase())}</button></div>
  </fieldset>`;
}

export function start() {
  const session = createSession();
  const root = document.getElementById('game');
  const guide = content.scenario.route_guide;
  const notice = content.scenario.festival_notice;
  root.innerHTML = `
    <section class="intro" aria-labelledby="request">
      <div class="chapter">THE FESTIVAL IS WAITING FOR YOUR MESSAGE</div>
      <h1 id="request" tabindex="-1">Two sources. One way in.</h1>
      <div class="visitor-request"><span class="visitor-label">A visitor asks</span><p class="visitor">${escape(content.scenario.visitor_request)}</p></div>
      <p class="intro-note">Plan a route. Pick the details that back it up. Send your message and see what needs another look.</p>
      <p id="session-label" class="session-label">First visit · no time limit</p>
    </section>
    <div class="workspace">
      <div class="sources" id="sources">
        <section class="source-card" aria-labelledby="route_guide">
          <div class="card-eyebrow">SOURCE 01 · WHERE THE PATHS GO</div>
          <h2 id="route_guide" tabindex="-1">${escape(guide.title)}</h2><p>${escape(guide.intro)}</p>
          <div class="route-map" aria-hidden="true">
            <div class="map-origin">Festival Plaza</div>
            <div class="map-branches">
              <div class="map-route" data-route="North"><span>North Path</span><span class="map-line">→</span><strong>Willow Gate</strong><small>Your path</small></div>
              <div class="map-route" data-route="South"><span>South Path</span><span class="map-line">→</span><strong>Bell Gate</strong><small>Your path</small></div>
            </div>
          </div>
          <div class="source-facts">${facts(guide.facts,'map_evidence')}</div>
        </section>
        <section class="source-card notice-card" aria-labelledby="festival_notice">
          <div class="card-eyebrow">SOURCE 02 · WHO CAN ENTER TONIGHT</div>
          <h2 id="festival_notice" tabindex="-1">${escape(notice.title)}</h2><div class="source-facts">${facts(notice.facts,'notice_evidence')}</div>
        </section>
      </div>
      <div class="message-desk">
        <section class="composer" aria-labelledby="compose-title">
          <div class="card-eyebrow">YOUR LANTERN POST DESK</div><h2 id="compose-title">Make a plan the visitor can use.</h2>
          <p class="compose-intro">Both paths are step-free. Which one reaches a gate the visitor can enter tonight?</p>
          <nav class="steps" aria-label="Message steps"><button type="button" data-step="plan" aria-current="step">1 · Plan a route</button><button type="button" data-step="reason">2 · Build a reason</button></nav>
          <p class="plan-summary" id="plan-summary"></p>
          <form id="message-form" autocomplete="off">
            <aside id="repair-note" class="repair-note" hidden aria-label="Issue you are revising"><strong>From your last send</strong><p id="repair-text"></p><div id="repair-links" class="links"></div><p class="hint">Change your choice, then send again to check it.</p></aside>
            <div id="plan-step">
              ${group('path','Choose a path','Use the route guide to trace a path from Festival Plaza.',[['North','North Path'],['South','South Path']],'1')}
              ${group('gate','Choose an entrance','Read tonight’s notice. Which gate will you name?', [['Willow','Willow Gate'],['Bell','Bell Gate']],'2')}
              <button class="secondary next" type="button" data-step="reason">Next: build your reason →</button>
            </div>
            <div id="reason-step" hidden>
              <p class="hint reason-intro">Choose here, or use a detail directly from each source. Your route stays yours to decide.</p>
              ${group('map_evidence','The guide says…','Which detail backs up your chosen path and gate?',guide.facts.slice(0,2).map(f=>[f.id,`${f.id} · ${f.text}`]),'3')}
              ${group('notice_evidence','Tonight’s notice says…','Which detail tells the visitor about entry at that gate?',notice.facts.map(f=>[f.id,`${f.id} · ${f.text}`]),'4')}
              ${group('conclusion','Together, these details show…','Connect where the path goes with whether visitors can enter.',content.message.conclusion_choices.map(f=>[f.id,f.text]),'5')}
            </div>
            <section class="preview" aria-labelledby="preview-title"><h3 id="preview-title">Your message preview</h3><p id="preview"></p></section>
            <p id="preview-status" class="sr-only" role="status" aria-live="polite" aria-atomic="true"></p>
            <button class="primary send" type="submit">Send message <span aria-hidden="true">→</span></button><p class="send-note">You can send an unfinished message. Nothing is sent off this page.</p>
          </form>
        </section>
      </div>
    </div>
        <p id="failure" role="alert" hidden></p>
        <section id="feedback" class="feedback" hidden aria-label="Feedback on your sent message">
          <p class="submission-note" id="submission-note"></p>
          <section class="recipient" aria-labelledby="result-title"><div class="card-eyebrow">THE VISITOR READS YOUR MESSAGE</div><h2 id="result-title" tabindex="-1">Here is what I understood.</h2><p id="recipient-text"></p></section>
          <section class="source-check" aria-labelledby="check-title"><div class="card-eyebrow">CHECK AGAINST THE SOURCES</div><h2 id="check-title"></h2><p id="source-status"></p><div id="status-links" class="links"></div><ol id="issues"></ol></section>
          <section id="delivery" class="delivery" hidden aria-labelledby="delivery-title"><span class="delivery-lantern" aria-hidden="true">✦</span><div><h3 id="delivery-title">A route, backed by both sources.</h3><p id="delivered-message"></p><p class="hint">You connected where the path goes with who can enter. Your completed message is here to reread.</p></div></section>
          <div id="actions" class="actions"></div>
          <section id="explanation" class="explanation" hidden aria-labelledby="explanation-title"><h3 id="explanation-title">The supported explanation</h3><p>${escape(content.evaluator.rendering.reveal.text)}</p><div class="links">${links(content.evaluator.rendering.reveal.links)}</div><p class="hint">Your choices have been kept. Further submissions in this visit use answer help.</p></section>
        </section>
    <button type="button" id="return-to-message" class="return-button" hidden>Return to message <span aria-hidden="true">↩</span></button>
    <p class="ready-note" id="ready">Ready to play. Once loaded, this page works without a connection.</p>`;

  const byId = id => document.getElementById(id);
  let returnControl = null;
  function showStep(next) {
    byId('plan-step').hidden = next !== 'plan';
    byId('reason-step').hidden = next !== 'reason';
    for (const button of root.querySelectorAll('.steps [data-step]')) {
      if (button.dataset.step === next) button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    }
  }
  const focusField = field => {
    showStep(['path','gate'].includes(field) ? 'plan' : 'reason');
    const group = byId(field);
    (group.querySelector('input:checked') ?? group.querySelector('input')).focus();
  };
  function repair(field, code) {
    const row = session.snapshot.result?.source_rows.find(row=>row.code===code);
    byId('repair-note').hidden = !row;
    byId('repair-text').textContent = row?.text ?? '';
    byId('repair-links').innerHTML = links(row?.links ?? []);
    focusField(field);
  }
  function updateDraft(announcement='') {
    const state = session.snapshot;
    byId('preview').textContent = preview(state.draft);
    const names = content.evaluator.input.display_names;
    byId('plan-summary').textContent = `Your directions: ${names[state.draft.path] ?? 'choose a path'} → ${names[state.draft.gate] ?? 'choose a gate'}.`;
    for (const [field,value] of Object.entries(state.draft)) {
      byId(`${field}-status`).textContent = value === null ? 'Not selected' : 'Selected';
      for (const input of byId(field).querySelectorAll('input')) input.checked = input.value === value;
    }
    for (const button of root.querySelectorAll('[data-pin]')) {
      const selected = state.draft[button.dataset.field] === button.dataset.pin;
      button.setAttribute('aria-pressed',String(selected));
      button.textContent = selected ? `${button.dataset.pin} is in your reason ✓` : `Use ${button.dataset.pin} in my reason ＋`;
    }
    for (const route of root.querySelectorAll('[data-route]')) route.classList.toggle('chosen',route.dataset.route === state.draft.path);
    if(announcement) byId('preview-status').textContent = announcement;
    byId('failure').hidden = !state.failure;
    byId('failure').textContent = state.failure ?? '';
    if(state.submitted) {
      const edited = Object.keys(state.draft).some(field=>state.draft[field]!==state.submitted[field]);
      byId('submission-note').textContent = edited ? 'Draft changed. The feedback below describes your last sent message. Send again to check your changes.' : state.context.assisted ? 'This sent message uses answer help. Your draft is preserved.' : state.context.replay ? 'Feedback on your replay message. Your draft is preserved.' : 'Feedback on your sent message. Your draft is preserved.';
    }
  }
  function renderFeedback() {
    const state = session.snapshot;
    const result = state.result;
    byId('feedback').hidden = !result;
    if(!result) return;
    byId('recipient-text').textContent = result.recipient_text;
    byId('check-title').textContent = result.feedback_heading;
    byId('source-status').textContent = result.source_status.text;
    byId('status-links').innerHTML = links(result.source_status.links);
    byId('issues').innerHTML = result.source_rows.map((row,i)=>{
      const field=content.evaluator.issue_rules.find(rule=>rule.code===row.code).focus_field;
      return `<li data-issue="${row.code}"><span class="issue-tag">${i?'Also check':'Start here'}</span><p>${escape(row.text)}</p><div class="links">${links(row.links)}</div><button class="secondary repair" type="button" data-repair="${field}" data-code="${row.code}">Edit ${escape(fieldLabels[field].toLowerCase())} →</button></li>`;
    }).join('');
    byId('issues').hidden = result.source_rows.length===0;
    byId('actions').innerHTML = result.source_status.actions.map(action=>`<button type="button" data-action="${escape(action)}" class="${action==='Revise'?'primary':'secondary'}" ${action==='Show explanation'?`aria-controls="explanation" aria-expanded="${state.explanationVisible}"`:''}>${action}</button>`).join('');
    byId('explanation').hidden = !state.explanationVisible;
    byId('delivery').hidden = !result.complete;
    byId('delivered-message').textContent = result.complete ? preview(state.submitted) : '';
    byId('feedback').classList.toggle('complete',result.complete);
    updateDraft();
  }
  root.addEventListener('change',event=>{
    if(!event.target.matches('input[type=radio]')) return;
    try { session.choose(event.target.name,event.target.value); }
    catch { updateDraft(); return; }
    updateDraft(`${fieldLabels[event.target.name]} selected. Message preview updated.`);
  });
  byId('message-form').addEventListener('submit',event=>{
    event.preventDefault();
    const sent=session.send(); updateDraft();
    if(sent.ok) {
      renderFeedback(); byId('repair-note').hidden=true; byId('return-to-message').hidden=true; byId('result-title').focus();
    } else if(session.snapshot.submitted) byId('submission-note').textContent='This check failed. Feedback below is from your previous successful check.';
  });
  root.addEventListener('click',event=>{
    const stepButton=event.target.closest('[data-step]');
    if(stepButton) {
      showStep(stepButton.dataset.step);
      // Moving to the next step is explicit; changing an answer never advances.
      if(stepButton.classList.contains('next')) focusField('map_evidence');
      return;
    }
    const pin=event.target.closest('[data-pin]');
    if(pin) {
      session.choose(pin.dataset.field,pin.dataset.pin);
      session.inspectSource();
      updateDraft(`${pin.dataset.pin} added to your reason. Your path and gate are unchanged.`);
      return;
    }
    const clear=event.target.closest('[data-clear]');
    if(clear) { session.choose(clear.dataset.clear,null); updateDraft(`${fieldLabels[clear.dataset.clear]} cleared. Message preview updated.`); return; }
    const edit=event.target.closest('[data-repair]');
    if(edit) { repair(edit.dataset.repair,edit.dataset.code); return; }
    const source=event.target.closest('[data-target]');
    if(source) {
      returnControl=source; session.inspectSource(); byId('return-to-message').hidden=false;
      if(source.dataset.target==='conclusion') showStep('reason');
      byId(source.dataset.target).focus(); return;
    }
    const action=event.target.closest('[data-action]')?.dataset.action;
    if(action==='Revise') repair(session.revise(),session.snapshot.result.primary_issue);
    if(action==='Inspect sources') { returnControl=event.target.closest('[data-action]'); session.inspectSource(); byId('return-to-message').hidden=false; byId('route_guide').focus(); }
    if(action==='Show explanation') { session.reveal(); byId('explanation').hidden=false; event.target.closest('[data-action]').setAttribute('aria-expanded','true'); }
    if(action==='Replay') {
      session.replay(); returnControl=null; showStep('plan');
      for(const id of ['feedback','explanation','delivery','return-to-message','repair-note']) byId(id).hidden=true;
      byId('session-label').textContent='Replay · same scenario · no time limit';
      updateDraft('Replay started. All five choices are cleared.'); byId('request').focus();
    }
  });
  byId('return-to-message').addEventListener('click',()=>{
    if(returnControl?.isConnected) returnControl.focus(); else focusField('path');
    byId('return-to-message').hidden=true;
  });
  byId('message-form').reset(); updateDraft();
  root.setAttribute('aria-busy','false'); root.dataset.ready='true';
}
