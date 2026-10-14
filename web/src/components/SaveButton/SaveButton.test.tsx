import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TEXT } from "../../common";
import { SaveButton } from "./SaveButton";

describe("SaveButton", () => {
  it("says save and calls onClick", async () => {
    const onClick = vi.fn();
    render(<SaveButton saving={false} isRetry={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole("button", { name: TEXT.SAVE_RESULT }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("says retry after a failed save", () => {
    render(<SaveButton saving={false} isRetry onClick={() => {}} />);
    expect(screen.getByRole("button", { name: TEXT.RETRY })).toBeEnabled();
  });

  it("is disabled while saving", () => {
    render(<SaveButton saving isRetry={false} onClick={() => {}} />);
    expect(screen.getByRole("button", { name: TEXT.SAVING })).toBeDisabled();
  });
});
