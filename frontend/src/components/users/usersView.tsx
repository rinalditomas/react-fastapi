import { useEffect, useState } from "react";
import Modal from "../common/modal";
import AddUserForm from "./addUserForm";
import UserList from "./userList";
import Header from "../common/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../common/loading";
import Error from "../common/error";

export interface UsersViewProps {}

export default function UsersView(props: UsersViewProps) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/users");
      setUsers(response.data);
    } catch (error) {
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  if (users.length < 1) {
    return (
      <div className="bg-gray-50 h-screen flex justify-center items-center">
        <Modal openModal={openModal} setOpenModal={setOpenModal}>
          <AddUserForm setOpenModal={setOpenModal} fetchUsers={fetchUsers} />
        </Modal>
        <div>
          <p>No users found.</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setOpenModal(true);
              /* logic to navigate to user creation form */
            }}
          >
            Create Your First User
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 h-screen">
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        <AddUserForm setOpenModal={setOpenModal} fetchUsers={fetchUsers} />
      </Modal>
      <div className="sticky top-0 z-50">
        <Header
          title="Users"
          description="Below is a list of all users currently registered in our system."
          buttonText="Create new user"
          onClick={() => setOpenModal(true)}
          backButton={true}
          goBack={() => navigate("/")}
        />
      </div>

      <div className="max-h-[90%] overflow-y-auto">
        <UserList users={users} />
      </div>
    </div>
  );
}
