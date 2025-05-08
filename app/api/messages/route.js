import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const friendId = searchParams.get("friendId");
  const action = searchParams.get("action");
  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  try {
    if (action === "unreadCounts") {
      // Fetch unread message counts for all friends
      const unreadCounts = await prisma.message.groupBy({
        by: ["senderId"],
        where: {
          receiverId: userId,
          read: false,
        },
        _count: {
          id: true,
        },
      });

      const unreadMessages = unreadCounts.reduce((acc, { senderId, _count }) => {
        acc[senderId] = _count.id;
        return acc;
      }, {});

      return NextResponse.json({ unreadMessages });
    }

    if (!friendId) {
      return NextResponse.json(
        { error: "friendId is required for fetching messages" },
        { status: 400 }
      );
    }

    // Fetch messages between userId and friendId
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      orderBy: { time: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error handling GET request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
  try {
    const { userId, friendId } = await request.json();

    if (!userId || !friendId) {
      return NextResponse.json(
        { error: "userId and friendId are required" },
        { status: 400 }
      );
    }

    // Mark messages from friendId to userId as read
    await prisma.message.updateMany({
      where: {
        senderId: friendId,
        receiverId: userId,
        read: false,
      },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}