import { router } from './router.js';

console.log('oh?')

export function navigate(path) {
   if (!path.startsWith('/')) path = '/' + path;
   
   history.pushState({}, '', '/state' + path);
   router();
}