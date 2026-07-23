import { POST as contactPOST } from '../contact/route';

export async function POST(request: Request) {
  return contactPOST(request);
}
