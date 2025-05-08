import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUser = session.user.id;
    const { friend } = await req.json();

    if (!friend) {
      return NextResponse.json(
        { message: "Friend userId is missing" },
        { status: 400 }
      );
    }

    // Update the current user's friends array
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser,
      },
      data: {
        friends: {
          push: friend,
        },
      },
    });

    // Update the friend's friends array to include the current user's id
    const updatedFriend = await prisma.user.update({
      where: {
        id: friend,
      },
      data: {
        friends: {
          push: currentUser,
        },
      },
    });

    return NextResponse.json("Friend added successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const currentUserEmail = session.user.email;

    const currentUser = await prisma.user.findUnique({
      where: { email: currentUserEmail },
      select: { friends: true },
    });

    if (!currentUser || !currentUser.friends.length) {
      return NextResponse.json(
        { message: "No friends found" },
        { status: 404 }
      );
    }

    const friendsDetails = await prisma.user.findMany({
      where: {
        id: { in: currentUser.friends },
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        lastOnline:true,
      },
    });

    return NextResponse.json(friendsDetails, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUserId = session.user.id;
    const { friendId } = await req.json();

    if (!friendId) {
      return NextResponse.json(
        { message: "Friend userId is missing" },
        { status: 400 }
      );
    }

    // Fetch current user's friends
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      select: { friends: true },
    });

    if (!currentUser || !currentUser.friends.includes(friendId)) {
      return NextResponse.json(
        { message: "Friend not found in your friends list" },
        { status: 404 }
      );
    }

    // Remove friendId from current user's friends
    const updatedUser = await prisma.user.update({
      where: { id: currentUserId },
      data: {
        friends: {
          set: currentUser.friends.filter((id) => id !== friendId),
        },
      },
    });

    // Remove currentUserId from friend's friends
    const friend = await prisma.user.findUnique({
      where: { id: friendId },
      select: { friends: true },
    });

    if (friend) {
      await prisma.user.update({
        where: { id: friendId },
        data: {
          friends: {
            set: friend.friends.filter((id) => id !== currentUserId),
          },
        },
      });
    }

    return NextResponse.json("Friend removed successfully", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}