import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { useOutletContext, MemoryRouter } from "react-router";
import Chat from "./Chat";
import { getChat, sendMessage } from "../../api";
import userEvent from "@testing-library/user-event";

vi.mock("../../api", () => ({
        getChat: vi.fn(),
        sendMessage: vi.fn(),
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

vi.mock("../message/Message", () => {
        return {
                default: vi.fn(({ message }) => (
                        <div data-testid="message">{message.content}</div>
                )),
        };
});

const chat = {
        id: 1,
        users: [
                { id: 1, username: "user1" },
                { id: 2, username: "user2" },
        ],
        messages: [
                {
                        id: 1,
                        content: "Message 1",
                        createdAt: "2026-09-02T14:38:00.000Z",
                        user: { id: 1, username: "user1" },
                },
                {
                        id: 3,
                        content: "Message 3",
                        createdAt: "2026-09-02T14:40:00.000Z",
                        user: { id: 2, username: "user2" },
                },
                {
                        id: 2,
                        content: "Message 2",
                        createdAt: "2026-09-02T14:39:00.000Z",
                        user: { id: 2, username: "user2" },
                },
        ],
};

describe("Chat component", () => {
        beforeEach(() => {
                useOutletContext.mockReturnValue({ userId: 1 });
        });

        it("populates messages", async () => {
                getChat.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(chat),
                });

                render(
                        <MemoryRouter>
                                <Chat />
                        </MemoryRouter>,
                );

                const message = await screen.findAllByTestId("message");

                expect(message.length).toBe(3);

                expect(message[0].textContent).toBe("Message 1");
                expect(message[1].textContent).toBe("Message 2");
                expect(message[2].textContent).toBe("Message 3");

                const chatTitle = screen.getByRole("heading", {
                        level: 1,
                        name: "user2",
                });
                expect(chatTitle).toBeInTheDocument();
        });
        it("updates messages on message send", async () => {
                getChat.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(chat),
                });

                sendMessage.mockImplementation((message) => {
                        return {
                                ok: true,
                                status: 200,
                                json: () =>
                                        Promise.resolve({
                                                id: 999,
                                                content: message,
                                                createdAt: "2026-09-02T14:41:00.000Z",
                                                user: {
                                                        id: 1,
                                                        username: "user1",
                                                },
                                        }),
                        };
                });

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Chat />
                        </MemoryRouter>,
                );

                await user.type(screen.getByRole("textbox"), "Typed message");
                await user.click(screen.getByRole("button"));
                const newMessage = await screen.findByText(/Typed message/i);
                expect(newMessage).toBeInTheDocument();
        });
        it("displays a loading message on pending chat fetch", async () => {
                getChat.mockImplementation(() => new Promise(() => {}));

                render(
                        <MemoryRouter>
                                <Chat />
                        </MemoryRouter>,
                );

                const loading = await screen.findByText(/loading/i);

                expect(loading).toBeInTheDocument();
        });
        it("displays an error message on failed chat fetch", async () => {
                getChat.mockRejectedValue(new Error("Failed to get chat"));

                render(
                        <MemoryRouter>
                                <Chat />
                        </MemoryRouter>,
                );

                const error = await screen.findByText(/Failed to get chat/i);
                expect(error).toBeInTheDocument();
        });
        it("displays a loading message on pending message send", async () => {
                getChat.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(chat),
                });

                sendMessage.mockImplementation(() => new Promise(() => {}));

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Chat />
                        </MemoryRouter>,
                );

                await user.type(screen.getByRole("textbox"), "Typed message");
                await user.click(screen.getByRole("button"));

                const loading = await screen.findByText(/Sending message.../i);
                expect(loading).toBeInTheDocument();
        });
        it("displays an error message on failed message send", async () => {
                getChat.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(chat),
                });

                sendMessage.mockRejectedValue(
                        new Error("Failed to send message"),
                );

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Chat />
                        </MemoryRouter>,
                );

                await user.type(screen.getByRole("textbox"), "Typed message");
                await user.click(screen.getByRole("button"));

                const error = await screen.findByText(
                        /Failed to send message/i,
                );
                expect(error).toBeInTheDocument();
        });
});
