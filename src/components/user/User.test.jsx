import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import User from "./User";

describe("User component", () => {
        it("shows the username and profile picture", () => {
                const user = {
                        username: "user1",
                        profile: { avatarUrl: "url" },
                };

                render(<User user={user} />);

                const username = screen.getByText("user1");
                expect(username).toBeInTheDocument();

                const picture = screen.getByRole("img");
                expect(picture).toBeInTheDocument();
        });
});
