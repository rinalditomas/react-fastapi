import * as React from "react";
import { User } from "../types/userTypes";

export interface usersTableProps {
  connections: User[];
  deleteConnection: (userId: string) => void;
}

export default function ConnectionsTable({
  connections,
  deleteConnection,
}: usersTableProps) {
  return (
    <div className=" divide-y divide-gray-300 space-y-5 ">
      {connections.map((connection: User) => (
        <div className="flex justify-between" key={connection.id}>
          <span className="text-gray-700 font-semibold pt-5  capitalize">
            {connection.name}
          </span>
          <button
            type="button"
            className="font-semibold text-indigo-600 hover:text-indigo-500"
            onClick={() => deleteConnection(connection.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
