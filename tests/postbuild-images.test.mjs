import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,existsSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
const script=resolve('scripts/postbuild.mjs');
test('static export fixes social images and preserves unrelated references',()=>{
 const out=mkdtempSync(join(tmpdir(),'portfolio-export-'));
 try{
  writeFileSync(join(out,'opengraph-image'),'image fixture');
  writeFileSync(join(out,'index.html'),'<img src="/opengraph-image?abc123"><a href="/unchanged">same</a>');
  execFileSync(process.execPath,[script],{env:{...process.env,POSTBUILD_OUT:out}});
  assert.ok(existsSync(join(out,'opengraph-image.png')));
  assert.ok(!existsSync(join(out,'opengraph-image')));
  assert.equal(readFileSync(join(out,'index.html'),'utf8'),'<img src="/opengraph-image.png"><a href="/unchanged">same</a>');
  assert.ok(existsSync(join(out,'.nojekyll')));
 }finally{rmSync(out,{recursive:true,force:true});}
});
