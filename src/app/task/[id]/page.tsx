import TaskClient from ".";

interface ParamsProps {
  params: {
    id: string;
  };
}

export default function TaskPage({ params }: ParamsProps) {
  // Aqui você pode buscar dados no Firestore ou apenas mostrar o ID
  return <TaskClient id={params.id} />;
}
