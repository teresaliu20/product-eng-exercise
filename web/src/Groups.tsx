import { GroupsDataTable } from "./components/GroupsDataTable";
import { useGroupsQuery } from "./hooks";

type Props = {
  filters?: unknown;
};

export function Groups({ filters }: Props) {

  const dataReq = useGroupsQuery({
    filters,
  });
  if (dataReq.isLoading || !dataReq.data) {
    return <div>Loading...</div>;
  }
  return <GroupsDataTable data={dataReq?.data?.data || []} />;
}
