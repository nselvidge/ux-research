import { getTokenHeader } from "../utils";
import fetch from "node-fetch";
import { object, string, InferType } from "yup";
import { BASE_URL } from "../consts";

const userResponse = object({
  id: string().required(),
  email: string().email().required(),
  first_name: string().default(""),
  last_name: string().default(""),
});

type UserResponseType = InferType<typeof userResponse>;

const isZoomUserResponse = (data: any): data is UserResponseType =>
  userResponse.isType(data);

export const users = {
  getCurrentUser: async (token: string) => {
    const result = await fetch(`${BASE_URL}/users/me`, {
      method: "GET",
      headers: {
        Authorization: getTokenHeader(token),
      },
    });

    const data = await result.json();

    if (!isZoomUserResponse(data)) {
      throw new Error("error retreiving zoom user details");
    }

    return data;
  },
};
