import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import AddUserForm from "../components/users/addUserForm";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("AddUserForm Component", () => {
  const mockSetOpenModal = jest.fn();
  const mockFetchUsers = jest.fn();

  beforeEach(() => {
    render(
      <AddUserForm
        setOpenModal={mockSetOpenModal}
        fetchUsers={mockFetchUsers}
      />
    );
  });
  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers(); 
  });

  it("renders the form", () => {
    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/example@gmail.com/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("allows input for name and email", () => {
    fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), {
      target: { value: "jane@example.com" },
    });

    expect(screen.getByPlaceholderText(/john doe/i)).toHaveValue("Jane Doe");
    expect(screen.getByPlaceholderText(/example@gmail.com/i)).toHaveValue(
      "jane@example.com"
    );
  });

  it("submits the form and calls API", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "123", name: "Jane Doe", email: "jane@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), {
      target: { value: "jane@example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), {
        name: "Jane Doe",
        email: "jane@example.com",
      });
    });
  });

  it("displays success message and closes modal on successful submission", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: { id: "123", name: "Jane Doe", email: "jane@example.com" },
    });

    fireEvent.submit(screen.getByRole("button", { name: /create/i }));
    jest.runAllTimers();

    await waitFor(() => {
      expect(screen.getByTestId("successful-message")).toBeInTheDocument();
      expect(mockSetOpenModal).toHaveBeenCalledWith(false);
    });
  });

  it("displays error message on submission failure", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Failed to create user"));

    fireEvent.submit(screen.getByRole("button", { name: /create/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/an unexpected error occurred/i)
      ).toBeInTheDocument();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
