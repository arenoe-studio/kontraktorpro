import { EditProjectPage } from "../../../_components/EditProjectPage";

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditProjectPage params={params} />;
}
