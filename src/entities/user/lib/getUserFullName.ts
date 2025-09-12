import type { User } from "../model/types";

export const getUserFullName = (user: User): string => {
	return user.firstName + user.lastName;
};
