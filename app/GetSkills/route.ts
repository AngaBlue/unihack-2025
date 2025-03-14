import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    // Your API logic here
    console.log(process.env.apiKey);
    return NextResponse.json({ message: 'Hello from Next.js!' });
}