import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FILE_INPUT_ACCEPT, JSON_CONTENT_TYPE, TEXT } from "../../common";
import { SessionFileInput } from "./SessionFileInput";

describe("SessionFileInput", () => {
  it("accepts JSON files", () => {
    render(<SessionFileInput onFile={() => {}} />);
    expect(screen.getByLabelText(TEXT.SESSION_FILE_LABEL)).toHaveAttribute("accept", FILE_INPUT_ACCEPT);
  });

  it("passes the chosen file to the callback", async () => {
    const onFile = vi.fn();
    const file = new File(["{}"], "session.json", { type: JSON_CONTENT_TYPE });
    render(<SessionFileInput onFile={onFile} />);
    await userEvent.upload(screen.getByLabelText(TEXT.SESSION_FILE_LABEL), file);
    expect(onFile).toHaveBeenCalledWith(file);
  });
});
