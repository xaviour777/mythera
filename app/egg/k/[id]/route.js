// /egg/k/K-XXXXXX — a Keeper's shareable card page (rich previews on WhatsApp, Facebook, X).
import { cardResponse } from '../../../../lib/egg/card.js';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  const { id } = await params;
  return cardResponse(id);
}
