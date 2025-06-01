import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const baseUrl = process.env.DO_FUNCTION_BASE_URL as string
    // Append the path to the base URL stored in env
    const res = await fetch(`${baseUrl}/batches/get-batches`)

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream error: ${res.statusText}` },
        { status: 502 }
      )
    }

    const payload = await res.json()
    return NextResponse.json(payload)
  } catch (err) {
    return NextResponse.json(
      { error: 'Unable to reach batches API' },
      { status: 500 }
    )
  }
}
