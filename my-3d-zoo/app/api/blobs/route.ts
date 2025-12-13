import { list } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const { blobs } = await list()
    
    // GLB 파일만 필터링
    const glbFiles = blobs.filter(blob => blob.pathname.endsWith('.glb'))
    
    return NextResponse.json({ models: glbFiles })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch blobs' }, { status: 500 })
  }
}
