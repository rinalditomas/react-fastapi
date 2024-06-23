import axios from "axios";
import { useEffect, useState } from "react";
import Loading from "../common/loading";
import Error from "../common/error";

export interface PossibleConnectionsProps {
  userId: string;
  fetchUserData: () => void;
}

export default function PossibleConnections({
  userId,
  fetchUserData,
}: PossibleConnectionsProps) {
  const [possibleConnections, setPossibleConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `http://localhost:8001/users/${userId}/possible_connections`
        );
        setPossibleConnections(response.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
          console.error("Error fetching data:", error);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const connectWithUser = async (userIdToConnect: string) => {
    try {
      const response = await axios.post(`http://localhost:8001/users/connect`, {
        user_id: userId,
        connected_user_id: userIdToConnect,
      });
      fetchUserData();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error connecting with user:", error.message);
      } else {
        console.error("An unexpected error occurred");
      }
    }
  };

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  if (possibleConnections.length < 1) {
    return (
      <div className=" w-full h-full flex items-center justify-center">
        <p className="text-gray-700 font-semibold">
          No possible connections found
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className=" font-semibold text-gray-600 text-xl">
        Connect with the following users
      </h1>
      <div className="divide-y divide-gray-200 space-y-6">
        {possibleConnections.map((user: any) => (
          <div className="flex justify-between pt-4 ">
            <span className="text-gray-700 font-medium">{user.name}</span>
            <button
              onClick={() => {
                connectWithUser(user.id);
              }}
              className="text-blue-600 hover:text-blue-900"
            >
              Connect
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
