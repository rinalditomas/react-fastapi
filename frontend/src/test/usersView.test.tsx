import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import UsersView from "../components/users/usersView";

// At the top of your test file, after imports
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Use actual for all non-overridden methods
  useNavigate: () => mockNavigate, // Override useNavigate
}));
jest.mock("axios");

// Define mockNavigate before your tests
const mockNavigate = jest.fn();
const mockedAxios = axios as jest.Mocked<typeof axios>;

beforeEach(() => {
  mockNavigate.mockReset();
});

describe("UsersView Component", () => {
  it("displays loading initially", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] }); // Mock axios call
    render(<UsersView />, { wrapper: BrowserRouter });
    const loadingElement = await screen.findByTestId("loading");
    expect(loadingElement).toBeInTheDocument();
  });

  it("displays error message when fetch fails", async () => {
    mockedAxios.get.mockRejectedValue(new Error("An error occurred"));
    render(<UsersView />, { wrapper: BrowserRouter });
    await waitFor(() => {
      const errorElement = screen.getByText(
        /an error occurred while fetching users/i
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('displays "No users found." when there are no users', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] }); // Mock axios call with empty array
    render(<UsersView />, { wrapper: BrowserRouter });
    await waitFor(() => {
      const noUsersElement = screen.getByText(/no users found/i);
      expect(noUsersElement).toBeInTheDocument();
    });
  });

  it("displays user list when users are fetched successfully", async () => {
    const users = [
      { id: 1, name: "John Doe", created_at: "2024-06-23T06:25:35" },
      { id: 2, name: "Jane Doe", created_at: "2024-06-23T06:25:35" },
    ];
    mockedAxios.get.mockResolvedValue({ data: users });
    render(<UsersView />, { wrapper: BrowserRouter });
    await waitFor(() => {
      const userListElement = screen.getByText(/john doe/i);
      expect(userListElement).toBeInTheDocument();
    });
  });

  it('opens modal when "Create Your First User" button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] }); // Mock axios call with empty array
    render(<UsersView />, { wrapper: BrowserRouter });
    await waitFor(() => {
      const buttonElement = screen.getByTestId("create-first-user");
    });
    const buttonElement = screen.getByTestId("create-first-user");
    fireEvent.click(buttonElement); // Using fireEvent for simulating user actions

    const modalElement = await screen.findByTestId("addUserForm"); // This waits for the element to appear
    expect(modalElement).toBeInTheDocument();
  });
  it("redirects to user detail page when a user is clicked", async () => {
    const users = [
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        created_at: "2021-01-01T00:00:00Z",
        last_updated_at: "2021-01-01T00:00:00Z",
      },
    ];
    mockedAxios.get.mockResolvedValue({ data: users }); // Mock axios call with users array
    render(<UsersView />, { wrapper: BrowserRouter });
    await waitFor(() => {
      const userElement = screen.getByText(/john doe/i);
      expect(userElement).toBeInTheDocument();
    });

    const userElement = screen.getByText(/john doe/i);
    fireEvent.click(userElement); // Simulate user click

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/users/1"); // Assuming mockNavigate is a jest mock function of useNavigate
    });
  });
  it("opens modal when the header button is clicked", async () => {
    const users = [
      { id: 1, name: "John Doe", created_at: "2024-06-23T06:25:35" },
      { id: 2, name: "Jane Doe", created_at: "2024-06-23T06:25:35" },
    ];
    mockedAxios.get.mockResolvedValue({ data: users });
    render(<UsersView />, { wrapper: BrowserRouter });
    await waitFor(() => {
      const buttonElement = screen.getByTestId("header-action-button");
    });
    const buttonElement = screen.getByTestId("header-action-button");
    fireEvent.click(buttonElement); // Using fireEvent for simulating user actions

    const modalElement = await screen.findByTestId("addUserForm"); // This waits for the element to appear
    expect(modalElement).toBeInTheDocument();
  });
  it("Back button is visible", async () => {
    const users = [
      { id: 1, name: "John Doe", created_at: "2024-06-23T06:25:35" },
      { id: 2, name: "Jane Doe", created_at: "2024-06-23T06:25:35" },
    ];
    mockedAxios.get.mockResolvedValue({ data: users });
    render(<UsersView />, { wrapper: BrowserRouter });
    await waitFor(() => {
      const buttonElement = screen.getByTestId("header-back-button");
    });
    const buttonElement = screen.getByTestId("header-back-button");
    fireEvent.click(buttonElement); // Using fireEvent for simulating user actions

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/"); // Assuming mockNavigate is a jest mock function of useNavigate
    });
  });
});
