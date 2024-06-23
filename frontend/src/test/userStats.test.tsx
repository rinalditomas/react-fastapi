import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import UserStats from "../components/users/userStats";
import { formatDistanceToNow } from "date-fns";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("UserStats Component", () => {
  it("renders loading state initially", () => {
    render(<UserStats />, { wrapper: BrowserRouter });
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders error message when fetch fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("Network error"));
    render(<UserStats />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred while fetching users/i)
      ).toBeInTheDocument();
    });
  });

  it("renders no data message when stats are all zeros", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        user_count: 0,
        connection_count: 0,
        average_connections_per_user: 0,
        last_connection: null,
      },
    });
    render(<UserStats />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(
        screen.getByText(/ups, it seems that we have no records/i)
      ).toBeInTheDocument();
    });
  });

  it("renders stats correctly when data is received", async () => {
    const fakeStats = {
      user_count: 10,
      connection_count: 5,
      average_connections_per_user: 0.6,
      last_connection: "2021-04-23T18:25:43.511Z",
    };
    mockedAxios.get.mockResolvedValue({ data: fakeStats });
    render(<UserStats />, { wrapper: BrowserRouter });

    await waitFor(() => {
      expect(screen.getByText(/10/i)).toBeInTheDocument();
      expect(screen.getByText(/5/i)).toBeInTheDocument();
      expect(screen.getByText(/0.6/i)).toBeInTheDocument();
      expect(
        screen.getByText(formatDistanceToNow(fakeStats.last_connection))
      ).toBeInTheDocument();
    });
  });
});
