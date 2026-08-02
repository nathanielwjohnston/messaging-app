import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { login } from "../../api";
import { useNavigate } from "react-router";

vi.mock("../../api", () => ({
        login: vi.fn(),
}));

vi.mock("react-router", () => ({
        ...vi.importActual("react-router"),
        useNavigate: vi.fn(),
}));

describe("Login component", () => {
        it("displays form", () => {
                render(<Login />);

                const username = screen.getByLabelText("Username");
                expect(username).toBeInTheDocument();

                const password = screen.getByLabelText("Password");
                expect(password).toBeInTheDocument();

                const submit = screen.getByRole("button", {
                        name: /log in/i,
                });
                expect(submit).toBeInTheDocument();
        });

        it("will not submit without all required fields", async () => {
                const navigate = vi.fn();
                useNavigate.mockReturnValue(navigate);

                const user = userEvent.setup();

                render(<Login />);

                await user.click(
                        screen.getByRole("button", { name: /log in/i }),
                );

                const errorMessage = await screen.findByText(
                        /Please fill the required fields/i,
                );
                expect(errorMessage).toBeInTheDocument();
        });

        it("submits successfully", async () => {
                const navigate = vi.fn();
                useNavigate.mockReturnValue(navigate);

                login.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve({ message: "success" }),
                });

                const user = userEvent.setup();

                render(<Login />);

                await user.type(screen.getByLabelText("Username"), "Username");
                await user.type(screen.getByLabelText("Password"), "Password");

                await user.click(
                        screen.getByRole("button", { name: /log in/i }),
                );

                expect(navigate).toHaveBeenCalledWith("/");
        });
});
