import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
    const publicDir = path.join(process.cwd(), 'public')
    const files = fs.readdirSync(publicDir)
    const glbFiles = files.filter(file => file.endsWith('.glb'))

    const models = glbFiles.map(file => ({
        id: file.replace('.glb', '').toLowerCase(),
        name: file.replace('.glb', ''),
        url: `/${file}`,
        emotion: '감정',
        story: '이 동물의 이야기입니다.',
    }))

    return NextResponse.json(models)
}