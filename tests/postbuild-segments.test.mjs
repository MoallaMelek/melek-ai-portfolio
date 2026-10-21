import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
test('nested segment payloads get flattened without removing originals',()=>{
 const out=mkdtempSync(join(tmpdir(),'portfolio-rsc-'));
 try{
  const folder=join(out,'projects','__next.a','$d$slug');mkdirSync(folder,{recursive:true});
  const original=join(folder,'__PAGE__.txt');writeFileSync(original,'payload');
  const run=()=>execFileSync(process.execPath,[resolve('scripts/postbuild.mjs')],{env:{...process.env,POSTBUILD_OUT:out}});
  run();run();
  assert.equal(readFileSync(original,'utf8'),'payload');
  assert.equal(readFileSync(join(out,'projects','__next.a.$d$slug.__PAGE__.txt'),'utf8'),'payload');
  assert.ok(existsSync(join(out,'.nojekyll')));
 }finally{rmSync(out,{recursive:true,force:true});}
});
