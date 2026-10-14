import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { ERRORS, JSON_CONTENT_TYPE, TEXT, USERS } from "../../common";
import { NewSessionSection } from "./NewSessionSection";

// vitest runs with cwd = web/
const fixtureFile = (name: string) =>
  new File([readFileSync(resolve(process.cwd(), "../fixtures", name), "utf8")], name, { type: JSON_CONTENT_TYPE });

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () => new Response(JSON.stringify({}), { status: 200 }));
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

const fileInput = () => screen.getByLabelText(TEXT.SESSION_FILE_LABEL);

describe("NewSessionSection", () => {
  it("shows only the file input before a file is chosen", () => {
    render(<NewSessionSection token={USERS[0].token} onSaved={async () => {}} />);
    expect(fileInput()).toBeInTheDocument();
    expect(screen.queryByTestId("reps")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("counts the reps and shows the summary, chart and save button", async () => {
    render(<NewSessionSection token={USERS[0].token} onSaved={async () => {}} />);
    await userEvent.upload(fileInput(), fixtureFile("session-noisy.json"));
    expect(await screen.findByTestId("reps")).toHaveTextContent("8");
    expect(screen.getByRole("img", { name: /knee angle/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: TEXT.SAVE_RESULT })).toBeInTheDocument();
  });

  it("shows an error for an invalid file", async () => {
    render(<NewSessionSection token={USERS[0].token} onSaved={async () => {}} />);
    await userEvent.upload(fileInput(), new File(["{}"], "bad.json", { type: JSON_CONTENT_TYPE }));
    expect(await screen.findByText(ERRORS.INVALID_FIXTURE)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("saves, reports success and notifies the parent", async () => {
    const onSaved = vi.fn(async () => {});
    render(<NewSessionSection token={USERS[0].token} onSaved={onSaved} />);
    await userEvent.upload(fileInput(), fixtureFile("session-clean.json"));
    await userEvent.click(await screen.findByRole("button", { name: TEXT.SAVE_RESULT }));
    expect(await screen.findByText(TEXT.SAVED)).toHaveClass("ok");
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it("offers a retry after a failed save", async () => {
    fetchMock.mockImplementationOnce(async () => new Response(JSON.stringify({ error: "boom" }), { status: 500 }));
    render(<NewSessionSection token={USERS[0].token} onSaved={async () => {}} />);
    await userEvent.upload(fileInput(), fixtureFile("session-clean.json"));
    await userEvent.click(await screen.findByRole("button", { name: TEXT.SAVE_RESULT }));
    expect(await screen.findByText("boom")).toHaveClass("error");
    await waitFor(() => expect(screen.getByRole("button", { name: TEXT.RETRY })).toBeEnabled());
  });
});
