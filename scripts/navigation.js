import { router } from './router.js';


export function navigate(path) {
   const from = location.pathname;

   if (!path.startsWith('/')) path = '/' + path;
   
   history.pushState({}, '', '/state' + path);
   router(from);
}