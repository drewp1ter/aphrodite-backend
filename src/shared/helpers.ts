export function fetchAbsolute(baseUrl: string) {
  return (url: string, init?: RequestInit) => (url.startsWith('/') ? fetch(baseUrl + url, init) : fetch(url, init))
}
