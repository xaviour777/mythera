import {resolve4,resolveMx} from 'node:dns/promises';

// Server-side screening for studio enquiries, run after the schema has passed.
// `bot` results are dropped silently (the sender still sees success); `error` results are shown to the person.
export type GuardResult={bot:true}|{bot:false,error:string}|null;

const throwawayDomains=new Set(['example.com','example.org','example.net','test.com','test.test','mailinator.com','guerrillamail.com','guerrillamail.net','sharklasers.com','grr.la','10minutemail.com','10minutemail.net','tempmail.com','temp-mail.org','tempmail.net','tempmailo.com','yopmail.com','yopmail.net','trashmail.com','getnada.com','nada.email','dispostable.com','maildrop.cc','throwawaymail.com','fakeinbox.com','mintemail.com','mohmal.com','emailondeck.com','spamgourmet.com','moakt.com','tempr.email','discard.email','mailnesia.com','burnermail.io','inboxkitten.com']);
const junkWords=/^(test|testing|tester|asdf|asd|qwerty|abc|abcd|xyz|aaa+|xxx+|na|n\/a|none|null|undefined|fake|demo|sample|name|foo|bar)$/i;
const junkMailbox=/^(test|testing|tester|asdf|qwerty|fake|aaa+|xxx+)\d*$/i;
const hasLink=/https?:\/\/|www\./i;
export const MIN_FILL_MS=2500;

export function screenLead(b:{kind:string,name:string,email:string,company:string,role:string,country:string,message:string,elapsedMs?:number}):GuardResult{
 if(typeof b.elapsedMs==='number'&&b.elapsedMs<MIN_FILL_MS)return {bot:true};
 const [local,domain='']=b.email.split('@');
 if(throwawayDomains.has(domain)||junkMailbox.test(local))return {bot:false,error:'Please use a real, permanent email address so the studio can reply.'};
 const name=b.name.trim();
 if(b.kind==='audience'||name){if(junkWords.test(name)||hasLink.test(name)||name.includes('@')||name.toLowerCase()===b.email||!/\p{L}.*\p{L}/u.test(name))return {bot:false,error:'Please enter your real name.'}}
 for(const v of [b.company,b.role,b.country])if(v&&hasLink.test(v))return {bot:true};
 for(const v of [b.company,b.role,b.country])if(v&&junkWords.test(v.trim()))return {bot:false,error:'Please fill in your details properly so the studio can follow up.'};
 if(b.country&&!/\p{L}.*\p{L}/u.test(b.country))return {bot:false,error:'Please enter the country you are based in.'};
 return null;
}

// Rejects email domains that cannot receive mail. DNS trouble on our side lets the lead through rather than losing it.
export async function emailDomainAccepts(email:string,timeoutMs=3000):Promise<boolean>{
 const domain=email.split('@')[1];if(!domain)return false;
 try{const records=await Promise.race([resolveMx(domain),new Promise<null>(r=>setTimeout(()=>r(null),timeoutMs))]);return records===null||records.some(r=>r.exchange&&r.exchange!=='.')}
 catch(e){const code=(e as {code?:string}).code;if(code==='ENOTFOUND')return false;if(code!=='ENODATA')return true;
  // No MX record: mail can still go to the domain's own address.
  try{return (await resolve4(domain)).length>0}catch(e2){return (e2 as {code?:string}).code!=='ENOTFOUND'&&(e2 as {code?:string}).code!=='ENODATA'}}
}
