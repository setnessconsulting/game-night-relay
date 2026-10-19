import { spawnSync } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import os from 'node:os';
import { buildIdentity, verificationIdentity } from './build-identity.mjs';
const profileRoots=[...new Set([os.homedir(),process.env.USERPROFILE,process.env.HOME].filter(Boolean))];
function replaceFolded(input,needle,replacement) {
  let result=input;
  let index=result.toLowerCase().indexOf(needle.toLowerCase());
  while(index!==-1) {
    result=result.slice(0,index)+replacement+result.slice(index+needle.length);
    index=result.toLowerCase().indexOf(needle.toLowerCase(),index+replacement.length);
  }
  return result;
}
function redactProfilePaths(value) {
  let result=String(value);
  for(const profileRoot of profileRoots) {
    result=replaceFolded(result,profileRoot,'<user-profile>');
    const slashRoot=profileRoot.split(String.fromCharCode(92)).join('/');
    if(slashRoot!==profileRoot) result=replaceFolded(result,slashRoot,'<user-profile>');
  }
  return result;
}
const root=fileURLToPath(new URL('../',import.meta.url));
const out=new URL('../docs/evidence/improvement/after/',import.meta.url);
mkdirSync(out,{recursive:true});
const report={captured_at:new Date().toISOString(),environment:{node:process.version,platform:os.platform(),release:os.release(),arch:os.arch()},identity:buildIdentity(),verification:verificationIdentity(),commands:[]};
for(const command of ['npm run check','npm test','npm run test:browser']) {
  const started=new Date().toISOString();
  const result=process.platform==='win32'?spawnSync('cmd.exe',['/d','/s','/c',command],{cwd:root,encoding:'utf8'}):spawnSync(command,{cwd:root,shell:true,encoding:'utf8'});
  const log=command==='npm test'?'test.log':command.includes('test:browser')?'browser.log':'check.log';
  writeFileSync(new URL(log,out),redactProfilePaths((result.stdout??'')+(result.stderr??'')));
  report.commands.push({command,started,finished:new Date().toISOString(),exit_code:result.status,log,error:result.error?redactProfilePaths(result.error.message):null});
  console.log(`${command}: exit ${result.status}`);
  if(result.status!==0) process.exitCode=1;
}
writeFileSync(new URL('verification-results.json',out),JSON.stringify(report,null,2)+'\n');
