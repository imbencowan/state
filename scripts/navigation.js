import { router } from './router.js';


export function navigate(path) {
   if (!path.startsWith('/')) path = '/' + path;
   
   history.pushState({}, '', '/state' + path);
   router();
}