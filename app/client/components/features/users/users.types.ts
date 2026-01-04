export type User = {
  id: string;
  username: string;
  name: string;
  role: "super_user" | "manager" | "staff";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
