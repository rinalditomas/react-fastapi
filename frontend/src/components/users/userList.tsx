import { useNavigate } from "react-router-dom";
import { User } from "../types/userTypes";
import { formatDistanceToNow } from "date-fns";

interface UserListProps {
  users: User[];
}
export default function UserList({ users }: UserListProps) {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`/users/${userId}`);
  };

  return (
    <ul
      role="list"
      className="divide-y divide-gray-100 "
    >
      {users.map((user: User) => (
        <li
          key={user.id}
          className=" hover:bg-gray-100"
          onClick={() => handleUserClick(user.id)}
        >
          <div className="w-11/12 mx-auto flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div
                className="h-12 w-12 flex-none rounded-full bg-blue-100 flex items-center justify-center text-xl font-medium"
                aria-label={user.name}
              >
                {user.name.includes(" ")
                  ? user.name
                      .split(" ")
                      .map((part) => part[0].toUpperCase())
                      .slice(0, 2)
                      .join("")
                  : user.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">
                  {user.name}
                </p>
                <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="text-sm leading-6 text-gray-900">
                {user?.last_updated_at}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500">
                {` Created  ${formatDistanceToNow(
                  new Date(user.created_at)
                )} ago`}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
