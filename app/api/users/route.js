import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const session = await getServerSession(req);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserEmail = session.user.email;
    const url = new URL(req.url);
    const query = url.searchParams.get("query");

    if (!query || query.trim() === "") {
      return NextResponse.json({ message: "Query is missing" }, { status: 400 });
    }

    // Fetch the current user with friends
    const currentUser = await prisma.user.findUnique({
      where: { email: currentUserEmail },
      select: { friends: true },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          { email: { not: currentUserEmail } },
          { id: { notIn: currentUser.friends } }, 
        ],
      },
    });

    return NextResponse.json(users, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: process.env.NODE_ENV === "development" ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

