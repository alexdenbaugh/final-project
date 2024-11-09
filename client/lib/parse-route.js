export default function parseRoute(hashRoute) {
  const cleanRoute = hashRoute.startsWith('#')
    ? hashRoute.slice(1)
    : hashRoute;
  const [path, queryString] = cleanRoute.split('?');
  const params = new URLSearchParams(queryString);
  return { path, params };
}
