import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const host = '127.0.0.1';
const port = Number(process.env.PORT || 4173);
let aiConfig = null; // API secrets live in memory only and are never written to disk.
let lastAiCall = 0;
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml' };

function send(res, status, body, contentType='application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type':contentType, 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Referrer-Policy':'no-referrer' });
  res.end(typeof body === 'string' ? body : JSON.stringify(body));
}
async function readJson(req, limit=150_000) {
  const parts=[]; let size=0;
  for await (const part of req) { size+=part.length; if(size>limit) throw Object.assign(new Error('Request is too large.'),{status:413}); parts.push(part); }
  try { return JSON.parse(Buffer.concat(parts).toString('utf8')); }
  catch { throw Object.assign(new Error('Invalid JSON request.'),{status:400}); }
}
function allowedOrigin(req) {
  const origin=req.headers.origin;
  return !origin || origin===`http://${host}:${port}` || origin===`http://localhost:${port}`;
}
async function callAnthropic({prompt, system='', maxTokens=900}) {
  if(!aiConfig?.key) throw Object.assign(new Error('Add your Anthropic API key in Settings first.'),{status:409});
  const now=Date.now(); if(now-lastAiCall<700) await new Promise(r=>setTimeout(r,700-(now-lastAiCall))); lastAiCall=Date.now();
  const upstream=await fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'content-type':'application/json','x-api-key':aiConfig.key,'anthropic-version':'2023-06-01'},
    body:JSON.stringify({model:aiConfig.model,max_tokens:maxTokens,system,messages:[{role:'user',content:prompt}]})
  });
  const result=await upstream.json().catch(()=>({}));
  if(!upstream.ok) {
    const message=result?.error?.message || `AI provider returned status ${upstream.status}.`;
    throw Object.assign(new Error(message),{status:upstream.status===401?401:502});
  }
  return (result.content||[]).filter(x=>x.type==='text').map(x=>x.text).join('\n').trim();
}

const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,`http://${host}:${port}`);
    if(url.pathname.startsWith('/api/')) {
      if(!allowedOrigin(req)) return send(res,403,{error:'Requests must come from this local StudyLoop page.'});
      if(req.method==='GET'&&url.pathname==='/api/health') return send(res,200,{ok:true,aiConfigured:Boolean(aiConfig?.key)});
      if(req.method==='GET'&&url.pathname==='/api/ai/status') return send(res,200,{configured:Boolean(aiConfig?.key),provider:aiConfig?.provider||null,model:aiConfig?.model||null});
      if(req.method==='DELETE'&&url.pathname==='/api/ai/config') { aiConfig=null; return send(res,200,{configured:false}); }
      if(req.method==='POST'&&url.pathname==='/api/ai/config') {
        const body=await readJson(req,10_000);
        const key=String(body.key||'').trim(); const model=String(body.model||'claude-sonnet-4-6').trim();
        if(key.length<20||key.length>500) return send(res,400,{error:'That key does not look complete.'});
        if(!/^[a-zA-Z0-9._:-]{3,100}$/.test(model)) return send(res,400,{error:'Use a model identifier made of letters, numbers, dots, underscores, colons, or hyphens.'});
        aiConfig={provider:'Anthropic',key,model};
        return send(res,200,{configured:true,provider:aiConfig.provider,model:aiConfig.model,note:'Key is held in memory until this server stops.'});
      }
      if(req.method==='POST'&&url.pathname==='/api/ai/test') {
        const text=await callAnthropic({prompt:'Reply with exactly: Connection is working.',maxTokens:40});
        return send(res,200,{ok:true,text});
      }
      if(req.method==='POST'&&url.pathname==='/api/ai/chat') {
        const body=await readJson(req); const prompt=String(body.prompt||'').trim();
        if(!prompt||prompt.length>18_000) return send(res,400,{error:'Add a message up to 18,000 characters.'});
        const tool=String(body.tool||'Study coach').slice(0,60); const subject=String(body.subject||'').slice(0,100);
        const answer=await callAnthropic({
          system:`You are a careful study coach for secondary students. Use Socratic hints before giving full solutions. Make feedback specific and supportive. Do not claim to be an official examiner or guarantee marks. If the user asks for assessment feedback, separate what is present, what is missing, and one next step. Active tool: ${tool}. Subject: ${subject||'not specified'}.`,
          prompt,
          maxTokens:1200
        });
        return send(res,200,{answer,provider:aiConfig.provider,model:aiConfig.model});
      }
      if(req.method==='POST'&&url.pathname==='/api/ai/generate') {
        const body=await readJson(req); const notes=String(body.notes||'').trim(); const kind=String(body.kind||'quiz');
        if(!notes||notes.length>18_000) return send(res,400,{error:'Add notes up to 18,000 characters.'});
        const instruction=kind==='cards'
          ? 'Create 6 concise active-recall flashcards from these notes. Return only valid JSON as an array of objects with keys question and answer. Do not include markdown fences.'
          : kind==='outline'
          ? 'Create a compact mind-map outline from these notes. Return only valid JSON as an array of objects with keys topic and children, where children is an array of short strings. Do not include markdown fences.'
          : 'Create 6 VCE-style practice questions from these notes, mixing recall and application. Return only valid JSON as an array of objects with keys question, answer, marks, and hint. Do not include markdown fences.';
        const answer=await callAnthropic({system:'Use only the supplied notes. If information is missing, do not invent facts. Keep language clear and age-appropriate.',prompt:`Subject: ${String(body.subject||'').slice(0,100)}\nTopic: ${String(body.topic||'').slice(0,150)}\n\n${instruction}\n\nNOTES:\n${notes}`,maxTokens:1800});
        return send(res,200,{answer,provider:aiConfig.provider,model:aiConfig.model});
      }
      return send(res,404,{error:'No such local API route.'});
    }
    if(req.method!=='GET'&&req.method!=='HEAD') return send(res,405,'Method not allowed','text/plain; charset=utf-8');
    const pathname=decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname);
    const file=path.resolve(root,`.${pathname}`);
    if(!file.startsWith(root+path.sep)) return send(res,403,'Forbidden','text/plain; charset=utf-8');
    const data=await fs.readFile(file);
    res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer','Content-Security-Policy':"default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; base-uri 'self'; frame-ancestors 'none'"});
    if(req.method==='HEAD') return res.end();
    res.end(data);
  } catch(err) {
    if(err.name==='AbortError') return send(res,504,{error:'The AI provider took too long. Please try again.'});
    send(res,err.status||500,{error:err.message||'Something went wrong.'});
  }
});
server.listen(port,host,()=>console.log(`StudyLoop is ready at http://${host}:${port}`));
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>{aiConfig=null;server.close(()=>process.exit(0));});
