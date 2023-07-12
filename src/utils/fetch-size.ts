export async function fetchSize(url: string): Promise<number> {
  const res = await fetch(url, { method: 'HEAD' })
  const size = res.headers.get('Content-Length')

  if (size) {
    return +size
  }

  throw new Error()
}
