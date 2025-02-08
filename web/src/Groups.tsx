import { GroupsDataTable } from "./components/GroupsDataTable";
import { useGroupsQuery } from "./hooks";

type Props = {
  filters?: unknown;
};

export function Groups({ filters }: Props) {
  const dataReq = useGroupsQuery({
    _: "Update this object to pass data to the /groups endpoint.",
    filters,
  });
  console.log("Groups")
  console.log(dataReq?.data?.data[0].groupings)

  if (dataReq.isLoading || !dataReq.data) {
    return <div>Loading...</div>;
  }

  return <GroupsDataTable data={dataReq?.data?.data[0].groupings || []} />;
}
