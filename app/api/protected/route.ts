// app/api/protected/route.ts

import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";

import { authOptions } from "@/lib/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

async function proxy(req: NextRequest, method: string) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const accessToken = (session as any).token.accessToken;

  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return Response.json({ message: "Missing endpoint" }, { status: 400 });
  }

  const url = `${API_BASE_URL}/${endpoint}`;

  const headers: HeadersInit = {
    Authorization: `Bearer ${accessToken}`,
    "access-token": "key",
    "Content-Type": "application/json"
  };

  const options: RequestInit = {
    method,
    headers
  };

  if (method !== "GET") {
    options.body = await req.text();
  }

  const res = await fetch(url, options);

  const data = await res.text();
  return new Response(data, {
    status: res.status,
    headers: {
      "Content-Type": res.headers.get("Content-Type") ?? "application/json"
    }
  });
}

export async function GET(req: NextRequest) {
  return proxy(req, "GET");
}
export async function POST(req: NextRequest) {
  return proxy(req, "POST");
}
export async function PUT(req: NextRequest) {
  return proxy(req, "PUT");
}
export async function DELETE(req: NextRequest) {
  return proxy(req, "DELETE");
}
