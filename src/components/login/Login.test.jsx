import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { login } from "../../api";
import { useNavigate, useOutletContext, MemoryRouter } from "react-router";

vi.mock("../../api", () => ({
        login: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
        const actual = await importOriginal();

        return { ...actual, useOutletContext: vi.fn(), useNavigate: vi.fn() };
});

describe("Login component", () => {
        beforeEach(() => {
                useOutletContext.mockReturnValue({ changeAuth: vi.fn() });
        });
        it("displays form", () => {
                render(
                        <MemoryRouter>
                                <Login />
                        </MemoryRouter>,
                );

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
                // Probably not even needed because I don't
                // check navigate being called in this test
                const navigate = vi.fn();
                useNavigate.mockReturnValue(navigate);

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Login />
                        </MemoryRouter>,
                );

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

                render(
                        <MemoryRouter>
                                <Login />
                        </MemoryRouter>,
                );

                await user.type(screen.getByLabelText("Username"), "Username");
                await user.type(screen.getByLabelText("Password"), "Password");

                await user.click(
                        screen.getByRole("button", { name: /log in/i }),
                );

                expect(navigate).toHaveBeenCalledWith("/");
        });
        it("displays an error on login fetch fail", async () => {
                login.mockRejectedValue(new Error("Failed to log in user"));

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Login />
                        </MemoryRouter>,
                );

                await user.type(screen.getByLabelText("Username"), "Username");
                await user.type(screen.getByLabelText("Password"), "Password");

                await user.click(
                        screen.getByRole("button", { name: /log in/i }),
                );

                const errorMessage = await screen.findByText(
                        /failed to log in user/i,
                );
                expect(errorMessage).toBeInTheDocument();
        });
});
