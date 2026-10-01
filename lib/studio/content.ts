import defaults from '@/content/studio.json';
import {contentSchema,type StudioContent} from './content-schema';

// On Vercel there is no D1 store, so content/studio.json is the single source of truth.
export async function getContent():Promise<StudioContent>{return contentSchema.parse(defaults)}
