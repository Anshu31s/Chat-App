//api/messages/[receiverId]/route.js
import { NextResponse } from "next/server";
import prismaClient from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const senderId = session.user.id;
  const { receiverId } = params;

  if (!senderId || !receiverId) {
    return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 });
  }

  try {
    const messages = await prismaClient.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { time: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
};

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    console.error("Unauthorized access attempt");
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const senderId = session.user.id;
  const { receiverId } = params;

  if (!senderId || !receiverId) {
    console.error("Missing senderId or receiverId:", { senderId, receiverId });
    return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 });
  }

  try {
    const deleted = await prismaClient.message.deleteMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });
    console.log("Deleted messages count:", deleted.count, { senderId, receiverId });
    return NextResponse.json({ message: "Conversation deleted successfully", deletedCount: deleted.count }, { status: 200 });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return NextResponse.json({ error: "Failed to delete conversation", details: error.message }, { status: 500 });
  }
};