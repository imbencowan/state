import { router } from './router.js';
import { config } from './config.js';


export function navigate(path) {
   updateURL(path);

   const from = location.pathname;
   router(from);
}



export function updateURL(path) {
   if (!path.startsWith('/')) path = '/' + path;
   history.pushState({}, '', config.appRoot + path);
}