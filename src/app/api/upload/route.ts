import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  // Pastikan user sudah login
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    // Validasi ukuran (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Buat nama file unik
    const ext = file.name.split(".").pop() ?? "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // Pastikan folder ada
    const uploadDir = join(process.cwd(), "public", "uploads", "photos");
    await mkdir(uploadDir, { recursive: true });

    // Tulis file ke disk
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Kembalikan URL publik
    const publicUrl = `/uploads/photos/${fileName}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
