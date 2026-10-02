import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "./Register";
import { register } from "../../api";
import { useNavigate, useOutletContext, MemoryRouter } from "react-router";

vi.mock("../../api", () => ({
        register: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
        const actual = await importOriginal();

        return { ...actual, useOutletContext: vi.fn(), useNavigate: vi.fn() };
});

describe("Register component", () => {
        beforeEach(() => {
                useOutletContext.mockReturnValue({ changeAuth: vi.fn() });
        });
        it("displays form", () => {
                render(
                        <MemoryRouter>
                                <Register />
                        </MemoryRouter>,
                );

                const username = screen.getByLabelText("Username");
                expect(username).toBeInTheDocument();

                const password = screen.getByLabelText("Password");
                expect(password).toBeInTheDocument();

                const passwordConfirm =
                        screen.getByLabelText("Confirm password");
                expect(passwordConfirm).toBeInTheDocument();

                const submit = screen.getByRole("button", {
                        name: /register/i,
                });
                expect(submit).toBeInTheDocument();
        });

        it("will not submit without all required fields", async () => {
                const navigate = vi.fn();
                useNavigate.mockReturnValue(navigate);

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Register />
                        </MemoryRouter>,
                );

                await user.click(
                        screen.getByRole("button", { name: /register/i }),
                );

                const errorMessage = await screen.findByText(
                        /Please fill the required fields/i,
                );
                expect(errorMessage).toBeInTheDocument();
        });

        it("will not submit if password not confirmed", async () => {
                const navigate = vi.fn();
                useNavigate.mockReturnValue(navigate);

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Register />
                        </MemoryRouter>,
                );

                await user.type(screen.getByLabelText("Username"), "Username");
                await user.type(screen.getByLabelText("Password"), "Password");
                await user.type(
                        screen.getByLabelText("Confirm password"),
                        "DifferentPassword",
                );

                await user.click(
                        screen.getByRole("button", { name: /register/i }),
                );

                const errorMessage =
                        await screen.findByText(/Passwords must match/i);
                expect(errorMessage).toBeInTheDocument();
        });

        it("submits successfully", async () => {
                const navigate = vi.fn();
                useNavigate.mockReturnValue(navigate);

                register.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve({ message: "success" }),
                });

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Register />
                        </MemoryRouter>,
                );

                await user.type(screen.getByLabelText("Username"), "Username");
                await user.type(screen.getByLabelText("Password"), "Password");
                await user.type(
                        screen.getByLabelText("Confirm password"),
                        "Password",
                );

                await user.click(
                        screen.getByRole("button", { name: /register/i }),
                );

                expect(navigate).toHaveBeenCalledWith("/");
        });

        it("displays an error on register fetch fail", async () => {
                register.mockRejectedValue(
                        new Error("Failed to register user"),
                );

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Register />
                        </MemoryRouter>,
                );

                await user.type(screen.getByLabelText("Username"), "Username");
                await user.type(screen.getByLabelText("Password"), "Password");
                await user.type(
                        screen.getByLabelText("Confirm password"),
                        "Password",
                );

                await user.click(
                        screen.getByRole("button", { name: /register/i }),
                );

                const errorMessage = await screen.findByText(
                        /failed to register user/i,
                );
                expect(errorMessage).toBeInTheDocument();
        });
});
