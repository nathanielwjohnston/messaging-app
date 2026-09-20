import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Message from "./Message";

const message = {
        content: "Message content",
        createdAt: "2026-09-02T14:38:00.000Z",
};

const userId = 1;

describe("Message component", () => {
        it("displays message attributes for current user", () => {
                render(
                        <Message
                                message={{
                                        ...message,
                                        user: { id: 1, username: "user1" },
                                }}
                                userId={userId}
                        />,
                );

                const content = screen.getByText("Message content");
                expect(content).toBeInTheDocument();

                // Time zone set in test-setup
                const date = screen.getByText("14:38 02/09/26");
                expect(date).toBeInTheDocument();

                const user = screen.getByText("You");
                expect(user).toBeInTheDocument();
        });

        it("displays message attributes for other user", () => {
                render(
                        <Message
                                message={{
                                        ...message,
                                        user: { id: 2, username: "user2" },
                                }}
                                userId={userId}
                        />,
                );

                const user = screen.getByText("user2");
                expect(user).toBeInTheDocument();
        });
});
