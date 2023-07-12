export async function fetchData<T>(url: string): Promise<{ data: T[], size: number }> {
  const res = await fetch(url)

  if (res.ok) {
    const data = await res.json()
    const size = Number(res.headers.get('content-length'))

    return { data, size }
  }

  throw new Error();
}