import { instance } from "../api";

export interface CreateGroupPayload {
 skill_id: string,
  force: boolean
}

export interface Mentor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Skill {
  id: string;
  code: string;
  description: string;
}

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  
}

export interface ResponseData {
  id: string;
  name: string;
  creation_date: string; 
  end_date: string; 
  skill: Skill;
  primary_mentor: Mentor;
  additional_mentors: Mentor[];
  members: Member[];
}

export interface CreateGroupResponse {
 status: boolean;
  message: string;
  data: ResponseData;
}

export const createGroup = async (
  data: CreateGroupPayload
): Promise<CreateGroupResponse> => {
  const response = await instance.post<CreateGroupResponse>(
    "/api/group/create-group/",
    data
  );
  return response.data;
};
