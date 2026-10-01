import {inquirySchema} from '@/lib/studio/inquiry-schema';
import {deliverGhlLead} from '@/lib/studio/ghl-client';

// Vercel version of the studio enquiry endpoint: validate, then deliver straight to GoHighLevel.
// There is no database here, so if the CRM is not configured or fails, the lead is written to the
// server log (Vercel → Logs) so it can be recovered by hand.
function ghlConfig(){const {GHL_API_KEY,GHL_LOCATION_ID,GHL_PIPELINE_ID,GHL_STAGE_ID,GHL_API_VERSION}=process.env;if(!GHL_API_KEY||!GHL_LOCATION_ID||!GHL_PIPELINE_ID||!GHL_STAGE_ID)return null;return {apiKey:GHL_API_KEY,locationId:GHL_LOCATION_ID,pipelineId:GHL_PIPELINE_ID,stageId:GHL_STAGE_ID,version:GHL_API_VERSION||'2021-07-28'}}

export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 const raw=await request.text();if(raw.length>15000)return Response.json({error:'Your message is too long.'},{status:413});
 let json;try{json=JSON.parse(raw)}catch{return Response.json({error:'Invalid request'},{status:400})}
 if(json?.website)return Response.json({ok:true});
 const parsed=inquirySchema.safeParse(json);if(!parsed.success)return Response.json({error:parsed.error.issues[0]?.message||'Please check your details.'},{status:400});
 const b=parsed.data;
 const lead={id:b.requestId,kind:b.kind,name:b.name,email:b.email,company:b.company,role:b.role,country:b.country,category:b.category,message:b.message,phone:b.phone,portfolio:b.portfolio,budget:b.budget,timeline:b.timeline,marketingConsent:b.kind==='audience'?1:Number(b.marketingConsent),attribution:JSON.stringify({utm:b.utm,pagePath:b.pagePath,referrer:b.referrer}),createdAt:new Date().toISOString()};
 const config=ghlConfig();
 if(!config){console.error('MYTHRA enquiry not sent to CRM (GHL env vars missing):',JSON.stringify(lead))}
 else{try{await deliverGhlLead(config,lead,{contactId:'',opportunityId:'',noteId:''},async()=>{})}catch(e){console.error('MYTHRA enquiry CRM delivery failed:',e instanceof Error?e.message:e,JSON.stringify(lead))}}
 return Response.json({ok:true,reference:b.requestId.slice(0,8).toUpperCase()});
}
