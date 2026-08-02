import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "./Register";
import { register } from "../../api";
import { useNavigate } from "react-router";

vi.mock("../../api", () => ({
        register: vi.fn(),
}));

vi.mock("react-router", () => ({
        ...vi.importActual("react-router"),
        useNavigate: vi.fn(),
}));

describe("Register component", () => {
        it("displays form", () => {
                render(<Register />);

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

                render(<Register />);

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

                render(<Register />);

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

                render(<Register />);

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
});
