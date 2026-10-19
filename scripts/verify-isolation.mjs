import assert from 'node:assert/strict';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { sha256, buildIdentity, verificationIdentity } from './build-identity.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'docs/evidence/improvement');
const baseline=JSON.parse(readFileSync(resolve(out,'baseline.json'),'utf8').replace(/^\uFEFF/,''));
const collect=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.name==='.git'?[]:entry.isDirectory()?collect(resolve(dir,entry.name)):[resolve(dir,entry.name)]);
const sourceFiles=collect(baseline.source);
assert.equal(sourceFiles.length,baseline.files.length,'Source file count changed');
for(const file of baseline.files) assert.equal(sha256(readFileSync(resolve(baseline.source,file.path))),file.sha256,`Source changed: ${file.path}`);
const git=args=>execFileSync('git',args,{cwd:baseline.source,encoding:'utf8'}).trim();
assert.equal(git(['rev-parse','HEAD']),baseline.head);
assert.equal(git(['branch','--show-current']),baseline.branch);
const status=execFileSync('git',['--no-optional-locks','status','--porcelain=v1','--untracked-files=all'],{cwd:baseline.source,encoding:'utf8'}).trimEnd().split(/\r?\n/);
assert.deepEqual(status,baseline.status);
const previous=new Map(baseline.files.map(f=>[f.path,f.sha256]));
const changed=[];
for(const path of collect(root)) {
  const name=relative(root,path).replaceAll('\\','/');
  if(name.startsWith('node_modules/')||name==='docs/evidence/improvement/isolation-final.json') continue;
  const hash=sha256(readFileSync(path));
  if(previous.get(name)!==hash) changed.push({path:name,change:previous.has(name)?'modified':'added',sha256:hash});
}
const report={captured_at:new Date().toISOString(),source:baseline.source,copy:root,baselineBranch:baseline.branch,baselineHead:baseline.head,
  sourceUnchanged:true,verifiedSourceFiles:sourceFiles.length,identity:buildIdentity(),verification:verificationIdentity(),changed};
writeFileSync(resolve(out,'isolation-final.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({sourceUnchanged:true,verifiedSourceFiles:sourceFiles.length,changedProjectFiles:changed.filter(f=>!f.path.startsWith('docs/evidence/')).map(f=>f.path)},null,2));
