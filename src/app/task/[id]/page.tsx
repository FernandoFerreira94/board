"use client";
import { useEffect, useState } from "react";
import TaskClient from "./TaskClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(
    null
  );

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  if (!resolvedParams) {
    return <p>Carregando...</p>;
  }

  return <TaskClient id={resolvedParams.id} />;
}
