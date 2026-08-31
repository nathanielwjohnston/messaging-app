import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import Users from "./Users";
import { getUsers, createChat } from "../../api";
import { useNavigate } from "react-router";
import userEvent from "@testing-library/user-event";

vi.mock("../../api", () => ({
        getUsers: vi.fn(),
        createChat: vi.fn(),
}));

vi.mock("../navbar/Navbar", () => {
        return {
                default: vi.fn(() => "Navbar"),
        };
});

vi.mock("../user/User", () => {
        return { default: vi.fn(() => <div data-testid="user"></div>) };
});

vi.mock("react-router", async (importOriginal) => {
        const actual = await importOriginal();

        return { ...actual, useNavigate: vi.fn() };
});

describe("Users component", () => {
        it("displays users", async () => {
                getUsers.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () =>
                                Promise.resolve([
                                        {
                                                id: 2,
                                                username: "user1",
                                                profile: { avatarUrl: "" },
                                        },
                                        {
                                                id: 3,
                                                username: "user2",
                                                profile: { avatarUrl: "" },
                                        },
                                        {
                                                id: 4,
                                                username: "user3",
                                                profile: { avatarUrl: "" },
                                        },
                                ]),
                });

                render(
                        <MemoryRouter>
                                <Users />
                        </MemoryRouter>,
                );

                const user = await screen.findAllByTestId("user");

                expect(user.length).toBe(3);
        });

        it("follows user to chat window", async () => {
                const userId = 2;
                getUsers.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () =>
                                Promise.resolve([
                                        {
                                                id: userId,
                                                username: "user1",
                                                profile: { avatarUrl: "" },
                                        },
                                ]),
                });

                const chatId = 1;
                createChat.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve({ id: chatId }),
                });

                const navigate = vi.fn();
                useNavigate.mockReturnValue(navigate);

                const user = userEvent.setup();

                render(<Users />);

                const otherUser = await screen.findByTestId("user");
                await user.click(otherUser);

                expect(navigate).toHaveBeenCalledWith(`/chats/${chatId}`);
        });

        it("displays a loading message on pending users fetch", async () => {
                getUsers.mockImplementation(() => new Promise(() => {}));

                render(<Users />);

                expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });
        it("displays an error message on failed users fetch", async () => {
                getUsers.mockRejectedValue(new Error("Failed to get users"));

                render(<Users />);

                const error = await screen.findByText(/Failed to get users/i);

                expect(error).toBeInTheDocument();
        });

        it("displays a loading message on pending chat creation", async () => {
                getUsers.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () =>
                                Promise.resolve([
                                        {
                                                id: 2,
                                                username: "user1",
                                                profile: { avatarUrl: "" },
                                        },
                                ]),
                });

                createChat.mockImplementation(() => new Promise(() => {}));

                const user = userEvent.setup();

                render(<Users />);

                const otherUser = await screen.findByTestId("user");
                await user.click(otherUser);

                expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });

        it("displays an error message on failed chat creation", async () => {
                getUsers.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () =>
                                Promise.resolve([
                                        {
                                                id: 2,
                                                username: "user1",
                                                profile: { avatarUrl: "" },
                                        },
                                ]),
                });

                createChat.mockRejectedValue(
                        new Error("Failed to create or get chat"),
                );

                const user = userEvent.setup();

                render(<Users />);

                const otherUser = await screen.findByTestId("user");
                await user.click(otherUser);

                const error = await screen.findByText(
                        /Failed to create or get chat/i,
                );

                expect(error).toBeInTheDocument();
        });
});
