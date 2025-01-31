import { NextResponse } from "next/server";

/**
 * GET handler for superheroes list with caching
 */
export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/superheroes`,
      {
        next: {
          revalidate: 30, // Revalidate every 30 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch superheroes");
    }

    const data = await response.json();

    // Set cache headers
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching superheroes:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to fetch superheroes" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
