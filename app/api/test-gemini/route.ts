import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("ok", { status: 200 });
}

export async function POST() {
  return new NextResponse("ok", { status: 200 });
}
