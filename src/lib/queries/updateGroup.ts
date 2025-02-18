import { instance } from "../api";

export interface UpdateGroupPayload {
  name?: string;
  end_date?: string;
  course?: string;
  members?: string[];
}

export interface UpdateGroupResponse {
  id?: string;
  name?: string;
  end_date?: string;
  course?: string;
  members?: string[];
}

export const updateGroup = async (
  groupId: string,
  data: UpdateGroupPayload
): Promise<UpdateGroupResponse> => {
  const response = await instance.patch<UpdateGroupResponse>(
    `/api/grouping/groups/${groupId}/`,
    data
  );
  return response.data;
};
