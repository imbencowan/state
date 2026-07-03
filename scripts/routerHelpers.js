export function splitPath(path = location.pathname.replace('/state', '')) {
      // make an array, splitting the path at '/'s. // remove falsy parts. // trim()
   return path.split('/').filter(Boolean).map(p => p.trim());
}