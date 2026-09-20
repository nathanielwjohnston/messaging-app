import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SendBox from "./SendBox";

const sendMessage = vi.fn();
const updateMessage = vi.fn();

describe("Send Box component", () => {
        it("updates text", async () => {
                const user = userEvent.setup();

                render(
                        <SendBox
                                message={""}
                                updateMessage={updateMessage}
                                sendMessage={sendMessage}
                        />,
                );

                const input = screen.getByRole("textbox");

                await user.type(input, "123456");

                expect(updateMessage).toHaveBeenCalledTimes(6);
        });

        it("sends message", async () => {
                const user = userEvent.setup();

                render(
                        <SendBox
                                message={"test send"}
                                updateMessage={updateMessage}
                                sendMessage={sendMessage}
                        />,
                );

                const input = screen.getByRole("textbox");

                await user.click(screen.getByRole("button"));

                expect(sendMessage).toHaveBeenCalled;

                expect(input.textContent).toBe("");
        });
});
