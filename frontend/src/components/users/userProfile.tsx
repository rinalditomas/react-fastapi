import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User } from "../types/userTypes";
import Header from "../common/header";
import Modal from "../common/modal";
import PossibleConnections from "./possibleConnectionList";
import ConnectionsTable from "./connectionsTable";
import Loading from "../common/loading";
import Error from "../common/error";

function UserProfile() {
  let { userId } = useParams();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [userConnections, setUserConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const fetchUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRequest = axios.get(
        `http://localhost:8001/users/${userId}/`
      );
      const connectionsRequest = axios.get(
        `http://localhost:8001/users/${userId}/connections`
      );

      const [profileResponse, connectionsResponse] = await Promise.all([
        profileRequest,
        connectionsRequest,
      ]);

      setUserProfile(profileResponse.data);
      setUserConnections(connectionsResponse.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const deleteConnection = async (selectedUserIdToRemoveConnection: string) => {
    try {
      const url = `http://localhost:8001/users/connections/${userId}/${selectedUserIdToRemoveConnection}`;

      await axios.delete(url);

      fetchUserData();
    } catch (error) {
      console.error("Failed to delete connection", error);
    }
  };

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  return (
    <div className=" bg-gray-50 h-screen">
      <Modal openModal={openModal} setOpenModal={setOpenModal}>
        {userId && openModal && (
          <PossibleConnections userId={userId} fetchUserData={fetchUserData} />
        )}
      </Modal>
      <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
        <div>
          <Header
            title={`${userProfile?.name}'s Profile`}
            description="This information will be displayed publicly so be careful what you
            share."
            backButton={true}
            goBack={() => navigate("/users")}
          />

          <dl className="mt-6 space-y-6 divide-y divide-gray-100  text-sm leading-6 px-6">
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Full name
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{userProfile?.name}</div>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Email address
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{userProfile?.email}</div>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Profile created
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{userProfile?.created_at}</div>
              </dd>
            </div>
            <div className="pt-6 sm:flex">
              <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                Number of Connections
              </dt>
              <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                <div className="text-gray-900">{userConnections.length}</div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-12">
        <Header
          title={`${userProfile?.name}'s connections`}
          description="A list of all the connections the user has made"
          onClick={() => setOpenModal(true)}
          buttonText="Add Connection"
        />

        <dl className="mt-6 space-y-6 divide-y divide-gray-100  border-gray-200 text-sm leading-6 px-6">
          {(userConnections.length ?? 0) < 1 ? (
            <span className=" text-gray-700 font-semibold ">
              No connections found
            </span>
          ) : (
            <div className=" max-h-80 overflow-y-auto">
              <ConnectionsTable
                connections={userConnections}
                deleteConnection={deleteConnection}
              />
            </div>
          )}
        </dl>
      </div>
    </div>
  );
}

export default UserProfile;
