import { vi, describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, Outlet } from "react-router";
import userEvent from "@testing-library/user-event";
import Navbar from "./Navbar";
import { logout } from "../../api";

const userId = 1;

vi.mock("../../api", () => ({
        logout: vi.fn(),
}));

const changeAuth = vi.fn();

const Parent = () => {
        return <Outlet context={{ changeAuth, userId }} />;
};

function renderNavbar() {
        render(
                <MemoryRouter initialEntries={["/"]}>
                        <Routes>
                                <Route element={<Parent />}>
                                        <Route
                                                path="/"
                                                element={<Navbar />}
                                        ></Route>
                                </Route>
                        </Routes>
                </MemoryRouter>,
        );
}

describe("Navbar component", () => {
        it("displays basic links", () => {
                renderNavbar();

                const homeLink = screen.getByRole("link", { name: /home/i });

                expect(homeLink).toBeInTheDocument();
                expect(homeLink).toHaveAttribute("href", "/");

                const usersLink = screen.getByRole("link", { name: /users/i });

                expect(usersLink).toBeInTheDocument();
                expect(usersLink).toHaveAttribute("href", "/users");

                const profileLink = screen.getByRole("link", {
                        name: /profile/i,
                });

                expect(profileLink).toBeInTheDocument();
                expect(profileLink).toHaveAttribute(
                        "href",
                        `/users/${userId}/profile`,
                );

                const logOutButton = screen.getByRole("button", {
                        name: /log out/i,
                });

                expect(logOutButton).toBeInTheDocument();
        });

        it("logs out the user", async () => {
                logout.mockResolvedValue({
                        ok: true,
                        status: 200,
                        json: () => Promise.resolve({ message: "success" }),
                });

                const user = userEvent.setup();

                renderNavbar();

                await user.click(
                        screen.getByRole("button", { name: /log out/i }),
                );

                expect(changeAuth).toHaveBeenCalled();
        });
});
