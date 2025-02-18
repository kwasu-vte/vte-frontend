import { instance } from "../api";

export interface CreateGroupPayload {
  name: string;
  end_date: string;
  course: string;
  members: string[];
}

export interface CreateGroupResponse {
  id: string;
  name: string;
  end_date: string;
  course: string;
  members: string[];
}

export const createGroup = async (
  data: CreateGroupPayload
): Promise<CreateGroupResponse> => {
  const response = await instance.post<CreateGroupResponse>(
    "/api/grouping/groups/",
    data
  );
  return response.data;
};
