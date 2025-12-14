import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const res = await fetch('https://christmas-for-ct.vercel.app/api/letters')
        const data = await res.json()

        const letters = Array.isArray(data) ? data : data.letters || data.data || []

        // 모든 데이터 가져오고, GLB 없으면 GiftBox.glb 사용
        const models = letters.map((item: any) => ({
            id: item.id,
            name: item.ornamentName,
            emotion: item.emotion,
            story: item.podcastScript,
            url: item.asset3dUrl || '/GiftBox.glb',  // 없으면 기본 선물상자
        }))

        return NextResponse.json(models)
    } catch (error) {
        console.log('Error:', error)
        return NextResponse.json([])
    }
}