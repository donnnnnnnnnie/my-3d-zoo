import { put, del } from '@vercel/blob'

export async function uploadModel(file: File) {
  const blob = await put(file.name, file, {
    access: 'public',
  })
  return blob
}

export async function deleteModel(url: string) {
  await del(url)
}
