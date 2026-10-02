import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ChatPreview from "./ChatPreview";

const chat = {
        users: [
                {
                        id: 1,
                        username: "Nathaniel",
                        profile: { avatarUrl: "testurl" },
                },
                {
                        id: 2,
                        username: "Yusuf",
                        profile: { avatarUrl: "testurl2" },
                },
        ],
        messages: [
                { content: "Right on dude!", userId: 1 },
                { content: "That is great man!", userId: 1 },
                { content: "Thanks man! It makes me happy", userId: 2 },
                { content: "No problem :)", userId: 1 },
        ],
};
const userId = 1;

describe("Chat Preview component", () => {
        it("shows the other user's username and profile picture", () => {
                render(<ChatPreview chat={chat} userId={userId} />);

                const username = screen.getByText("Yusuf");
                expect(username).toBeInTheDocument();

                const picture = screen.getByRole("img");
                expect(picture).toBeInTheDocument();
                expect(picture.src).toBe("http://localhost:3000/testurl2");
        });
        it("shows part of the last message sent", () => {
                render(<ChatPreview chat={chat} userId={userId} />);

                const message = screen.getByText("You: No problem ...");

                expect(message).toBeInTheDocument();
        });
});
