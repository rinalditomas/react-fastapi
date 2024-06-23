import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../common/loading";
import Error from "../common/error";
import { formatDistanceToNow} from "date-fns";

export default function UserStats() {
  const navigate = useNavigate();

  const navigateToUsersPage = () => {
    navigate("/users");
  };

  const [stats, setStats] = useState({
    user_count: 0,
    connection_count: 0,
    average_connections_per_user: 0,
    last_connection: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noData, setNoData] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8001/stats");
      
      const allZeros = Object.values(response.data).every(
        (val) => val === 0 || val === "0" || val === null
      );
      if (allZeros) {
        setNoData(true);
      }
      setStats(response.data);
    } catch (error) {
      setError("An error occurred while fetching users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) return <Loading />;

  if (error) return <Error message={error} />;

  const statsDisplay = [
    { name: "User Count", value: stats.user_count },
    { name: "Connection Count", value: stats.connection_count },
    {
      name: "Average Connections Per User",
      value: stats.average_connections_per_user.toFixed(1),
    },
    {
      name: "Last Connection was made",
      value: stats.last_connection
        ? formatDistanceToNow(new Date(stats.last_connection))
        : "-",
    },
  ];


  if (noData) {
    return (
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Ups, it seems that we have no records
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">
                Go ahead and add some users and create some connections to see
                some statistics
              </p>
              <button
                onClick={navigateToUsersPage}
                className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
              >
                View Users
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {noData
                ? "Ups, it seems that we have no records"
                : "Insights into our platform's engagement."}
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              {noData
                ? "Go ahead and add some users and create some connections to see some statistics"
                : "Dive deep into the metrics that define our platform's user engagement and connectivity. Explore the dynamics of user interactions, the growth of connections, and the trends that shape our community."}
            </p>
            <button
              onClick={navigateToUsersPage}
              className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700"
            >
              View Users
            </button>
          </div>
          {!noData && (
            <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-4">
              {statsDisplay.map((stat) => (
                <div
                  key={stat.name}
                  className="flex flex-col bg-blue-900/5 p-8"
                >
                  <dt className="text-sm font-semibold leading-6 text-gray-600">
                    {stat.name}
                  </dt>
                  <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>
    </div>
  );
}
