import { vi, describe, it, expect, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { useOutletContext, useLocation, MemoryRouter } from "react-router";
import Profile from "./Profile";
import { getProfile, updateProfile } from "../../api";
import userEvent from "@testing-library/user-event";

vi.mock("../../api", () => ({
        getProfile: vi.fn(),
        updateProfile: vi.fn(),
}));

vi.mock("react-router", async (importOriginal) => {
        const actual = await importOriginal();

        return { ...actual, useOutletContext: vi.fn(), useLocation: vi.fn() };
});

vi.mock("../navbar/Navbar", () => {
        return {
                default: vi.fn(() => "Navbar"),
        };
});

const user1 = {
        username: "user1",
        bio: "User 1's bio",
        age: 23,
        avaturUrl: "user1",
};
const user2 = {
        username: "user2",
        bio: "User 2's bio",
        age: 24,
        avaturUrl: "user2",
};

getProfile.mockImplementation((userId) => {
        let userData;
        const id = parseInt(userId);
        if (id === 1) {
                userData = user1;
        } else if (id === 2) {
                userData = user2;
        }

        return {
                ok: true,
                status: 200,
                json: () => Promise.resolve(userData),
        };
});

describe("Profile component", () => {
        beforeEach(() => {
                useOutletContext.mockReturnValue({ userId: "1" });
                useLocation.mockReturnValue({ pathname: "/users/1/profile" });
        });

        it("displays own profile data", async () => {
                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );

                await screen.findByText("user1");
                await screen.findByText("User 1's bio");
                await screen.findByText("23");
                await screen.findByAltText(/user1/i);
        });
        it("displays others profile data", async () => {
                useLocation.mockReturnValue({ pathname: "/users/2/profile" });

                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );

                await screen.findByText("user2");
                await screen.findByText("User 2's bio");
                await screen.findByText("24");
                await screen.findByAltText(/user2/i);
        });
        it("allows editing of own profile", async () => {
                updateProfile.mockImplementation((newProfileData) => {
                        newProfileData = {
                                ...newProfileData,
                                avatarUrl: newProfileData.avatar.name,
                        };
                        // Should replace existing data, if partial data is changed
                        const profileData = { ...user1, ...newProfileData };
                        return {
                                ok: true,
                                status: 200,
                                json: () => Promise.resolve(profileData),
                        };
                });

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );

                const editButton = await screen.findByRole("button", {
                        name: /edit/i,
                });
                await user.click(editButton);

                const username = screen.getByLabelText(/username/i);
                await user.clear(username);
                await user.type(username, "New username");

                const bio = screen.getByLabelText(/bio/i);
                await user.clear(bio);
                await user.type(bio, "New bio");

                const age = screen.getByLabelText(/age/i);
                await user.clear(age);
                await user.type(age, "24");

                const fileInput = await screen.getByLabelText(
                        /change profile picture/i,
                );

                const image = new File(["avatar"], "avatar.png", {
                        type: "image/png",
                });

                await user.upload(fileInput, image);

                const updateButton = screen.getByRole("button", {
                        name: /update/i,
                });

                await user.click(updateButton);

                await screen.findByText("New username");
                await screen.findByText("New bio");
                await screen.findByText("24");
                const newImage = await screen.findByAltText(
                        /new username's profile picture/i,
                );
                expect(newImage.src).toBe("http://localhost:3000/avatar.png");
        });
        it("cancels an attempted edit", async () => {
                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );

                const editButton = await screen.findByRole("button", {
                        name: /edit/i,
                });
                await user.click(editButton);
                const cancelButton = await screen.findByRole("button", {
                        name: /cancel/i,
                });
                await user.click(cancelButton);

                await screen.findByRole("button", {
                        name: /edit/i,
                });
        });
        it("prevents editing of other profiles", async () => {
                useLocation.mockReturnValue({ pathname: "/users/2/profile" });

                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );

                // Make sure page is loaded before checking further
                await waitFor(() => {
                        expect(
                                screen.queryByText("Loading..."),
                        ).not.toBeInTheDocument();
                });

                expect(
                        screen.queryByRole("button", {
                                name: /edit/i,
                        }),
                ).not.toBeInTheDocument();
        });
        it("displays a loading message on pending profile fetch", async () => {
                getProfile.mockImplementation(() => new Promise(() => {}));
                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );
                const loading = await screen.findByText(/loading/i);
                expect(loading).toBeInTheDocument();
        });
        it("displays an error message on failed profile fetch", async () => {
                getProfile.mockRejectedValue(
                        new Error("Failed to get profile"),
                );
                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );
                const error = await screen.findByText(/failed to get profile/i);
                expect(error).toBeInTheDocument();
        });
        it("displays a loading message on pending profile update", async () => {
                getProfile.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(user1),
                });

                updateProfile.mockImplementation(() => new Promise(() => {}));

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );

                const editButton = await screen.findByRole("button", {
                        name: /edit/i,
                });

                await user.click(editButton);
                await user.click(
                        screen.getByRole("button", { name: /update/i }),
                );

                const loading = await screen.findByText(/updating profile.../i);
                expect(loading).toBeInTheDocument();
        });
        it("displays an error message on failed profile update", async () => {
                getProfile.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve(user1),
                });

                updateProfile.mockRejectedValue(
                        new Error("Failed to update profile"),
                );

                const user = userEvent.setup();

                render(
                        <MemoryRouter>
                                <Profile />
                        </MemoryRouter>,
                );

                const editButton = await screen.findByRole("button", {
                        name: /edit/i,
                });

                await user.click(editButton);
                await user.click(
                        screen.getByRole("button", { name: /update/i }),
                );

                const error = await screen.findByText(
                        /failed to update profile/i,
                );
                expect(error).toBeInTheDocument();
        });
});
