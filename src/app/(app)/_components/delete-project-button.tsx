"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteProjectAction } from "@/features/projects/actions";
import { Button } from "./ui";

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useState(false);

  function handleDelete() {
    if (!window.confirm("Apakah Anda yakin ingin menghapus proyek ini? Seluruh data WBS, laporan, dan material akan hilang permanen.")) {
      return;
    }
    
    startTransition(true);
    deleteProjectAction(projectId).then((res) => {
      if (res.success) {
        router.push("/projects");
      } else {
        startTransition(false);
        alert(res.message);
      }
    });
  }

  return (
    <Button variant="danger" className="w-full" onClick={handleDelete} disabled={isPending}>
      {isPending ? "Menghapus..." : "Hapus Proyek"}
    </Button>
  );
}
