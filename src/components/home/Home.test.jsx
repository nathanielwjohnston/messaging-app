import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useOutletContext } from "react-router";
import { MemoryRouter } from "react-router";
import Home from "./Home";
import { getUsersChats } from "../../api";

vi.mock("../../api", () => ({
        getUsersChats: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
        const actual = await importOriginal();

        return { ...actual, useOutletContext: vi.fn() };
});

vi.mock("../navbar/Navbar", () => {
        return {
                default: vi.fn(() => "Navbar"),
        };
});

vi.mock("../chatPreview/ChatPreview", () => {
        return { default: vi.fn(() => <div data-testid="chat"></div>) };
});

describe("Home component", () => {
        beforeEach(() => {
                useOutletContext.mockReturnValue({ userId: 1 });
        });

        it("displays user's open chats", async () => {
                getUsersChats.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () =>
                                Promise.resolve([
                                        {
                                                id: 1,
                                                users: [{ id: 1 }, { id: 2 }],
                                                messages: [
                                                        {
                                                                content: "Last message",
                                                                userId: 1,
                                                        },
                                                ],
                                        },
                                        {
                                                id: 2,
                                                users: [{ id: 3 }, { id: 4 }],
                                                messages: [
                                                        {
                                                                content: "Last message",
                                                                userId: 3,
                                                        },
                                                ],
                                        },
                                        {
                                                id: 3,
                                                users: [{ id: 5 }, { id: 6 }],
                                                messages: [
                                                        {
                                                                content: "Last message",
                                                                userId: 5,
                                                        },
                                                ],
                                        },
                                ]),
                });

                render(
                        <MemoryRouter>
                                <Home />
                        </MemoryRouter>,
                );

                const chatLink = await screen.findAllByRole("link");

                expect(chatLink.length).toBe(3);
        });
        it("follows chat previews to chat window", async () => {
                const chatId = 1;
                getUsersChats.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () =>
                                Promise.resolve([
                                        {
                                                id: chatId,
                                                users: [{ id: 1 }, { id: 2 }],
                                                messages: [
                                                        {
                                                                content: "Last message",
                                                                userId: 1,
                                                        },
                                                ],
                                        },
                                ]),
                });

                render(
                        <MemoryRouter>
                                <Home />
                        </MemoryRouter>,
                );

                const chatLink = await screen.findByRole("link");
                expect(chatLink).toBeInTheDocument();
                expect(chatLink).toHaveAttribute("href", `/chats/${chatId}`);
        });
        it("displays a loading message on pending fetch", async () => {
                getUsersChats.mockImplementation(() => new Promise(() => {}));

                render(<Home />);

                expect(screen.getByText(/loading/i)).toBeInTheDocument();
        });
        it("displays an error message on failed fetch", async () => {
                getUsersChats.mockRejectedValue(
                        new Error("Failed to get user's chats"),
                );

                render(<Home />);

                const error = await screen.findByText(
                        /Failed to get user's chats/i,
                );

                expect(error).toBeInTheDocument();
        });
});
