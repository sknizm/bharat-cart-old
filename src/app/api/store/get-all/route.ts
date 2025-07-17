import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/queries/user'

export const runtime = 'nodejs' // ensure Prisma works (not edge)

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let stores = []

    
      // Stores owned by the user
      stores = await prisma.store.findMany({
        where: { ownerId: user.id },
        select: {
          id: true,
          name: true,
          slug: true,
          domain: true,
        },
      })

    return NextResponse.json({ stores })
  } catch (error) {
    console.error('[GET_STORES_ERROR]', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
