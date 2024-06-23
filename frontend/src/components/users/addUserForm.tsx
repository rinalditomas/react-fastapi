import { Dispatch, SetStateAction, useState } from "react";
import Loading from "../common/loading";

export interface AddUserFormProps {
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  fetchUsers: () => void;
}
interface UserFieldsProps {
  email: string;
  name: string;
}

export default function AddUserForm({
  setOpenModal,
  fetchUsers,
}: AddUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [userFields, setUserFields] = useState<UserFieldsProps>({
    email: "",
    name: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const addNewUser = async (user: UserFieldsProps) => {
    try {
      setError(null);
      setLoading(true);

      const response = await fetch("http://localhost:8001/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorBody = await response.json();

        const errorMessage = errorBody.detail || "Failed to create a new user";
        throw new Error(errorMessage);
      }
      const data = await response.json();
      setLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        fetchUsers();
        setShowSuccess(false);
        setOpenModal(false);
      }, 1000);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
        setLoading(false);
      }
    }
  };

  if (loading) return <Loading />;

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center flex-col space-y-2">
        <h1 className="text-gray-700 text-lg font-medium">
          User succcesfully created
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          color="#000000"
          fill="none"
          className="w-12 h-12 text-green-500"
        >
          <path
            d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8 12.5L10.5 15L16 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto">
      <h3 className="text-xl font-semibold leading-6 text-gray-900">
        Add a new user
      </h3>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          addNewUser(userFields);
        }}
        className="flex flex-col space-y-5 mt-6"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-700"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              type="text"
              name="name"
              id="name"
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="John Doe"
              value={userFields.name}
              onChange={(e) =>
                setUserFields((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-700"
          >
            Email
          </label>
          <div className="mt-2">
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              placeholder="example@gmail.com"
              value={userFields.email}
              onChange={(e) =>
                setUserFields((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
        </div>

        {error && (
          <span className="text-red-500 w-fit bg-red-100 px-2 py-1 rounded-lg">
            {error}
          </span>
        )}
        <div className=" px-4 py-3 mt-6 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
          >
            Create
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={() => setOpenModal(false)}
            data-autofocus
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
