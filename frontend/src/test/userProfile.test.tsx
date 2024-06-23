import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import UserProfile from "../components/users/userProfile";

jest.mock("axios");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ userId: "1" }),
}));

const mockNavigate = jest.fn();
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockUserData = {
  data: {
    name: "John Doe",
    email: "john@example.com",
    created_at: "2021-01-01",
  },
};

const mockConnectionsData = {
  data: [{ id: "2", name: "Jane Doe" }],
};

describe("UserProfile Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders with loading state", async () => {
    mockedAxios.get.mockReturnValue(new Promise(() => {}));
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  test("renders error state", async () => {
    mockedAxios.get.mockRejectedValue(new Error("An error occurred"));
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
    await waitFor(() =>
      expect(screen.getByText(/There was an error/i)).toBeInTheDocument()
    );
  });

  test("renders user data successfully", async () => {
    mockedAxios.get
      .mockResolvedValueOnce(mockUserData)
      .mockResolvedValueOnce(mockConnectionsData);
    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );
    await waitFor(() => screen.getAllByTestId("header-title"));
    const headerTitles = screen.getAllByTestId("header-title");
    expect(headerTitles[0]).toHaveTextContent("John Doe's Profile");
    expect(headerTitles[1]).toHaveTextContent("John Doe's connections");
    expect(screen.getByTestId("user-name").textContent).toBe("John Doe");
    expect(screen.getByTestId("user-email").textContent).toBe(
      "john@example.com"
    );
    expect(screen.getByTestId("user-connections-number").textContent).toBe("1");
  });

  test("delete connection", async () => {
    mockedAxios.get
      .mockResolvedValueOnce(mockUserData) // Initial load
      .mockResolvedValueOnce(mockConnectionsData) // Initial connections load
      .mockResolvedValueOnce(mockConnectionsData); // Refreshed connections load after delete

    mockedAxios.delete.mockResolvedValue({}); // Simulate successful delete

    render(
      <BrowserRouter>
        <UserProfile />
      </BrowserRouter>
    );

    await waitFor(() =>
      expect(screen.getByText(/jane doe/i)).toBeInTheDocument()
    );

    fireEvent.click(screen.getByText(/delete/i));

    // Optionally, wait for a specific UI change that indicates the refresh has occurred
    // For example, if a loading spinner is shown during refresh, wait for it to disappear
    // await waitForElementToBeRemoved(screen.getByTestId('loading-spinner'));

    await waitFor(() =>
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining("/connections/1/2")
      )
    );

    // This assertion checks if axios.get was called three times
    expect(mockedAxios.delete).toHaveBeenCalledTimes(1);
  });
});
