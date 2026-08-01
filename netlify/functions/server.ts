import serverless from 'serverless-http';
import { app } from '../../server/app';

const wrapped = serverless(app);

export async function handler(event: any, context: any) {
  if (event.path?.startsWith('/.netlify/functions/server')) {
    event.path = event.path.replace('/.netlify/functions/server', '') || '/';
  }
  return wrapped(event, context);
}
