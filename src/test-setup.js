import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import process from "node:process";

expect.extend(matchers);

process.env.TZ = "Etc/UTC";

afterEach(() => {
        cleanup();
});
