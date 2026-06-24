import { createUploadthing, type FileRouter } from "uploadthing/next";
import { requireAuth } from "@/lib/auth/session";

const f = createUploadthing();

export const ourFileRouter = {
  projectImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // Pastikan user sudah login
      const user = await requireAuth();
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
