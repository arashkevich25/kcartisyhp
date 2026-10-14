import { render, screen } from "@testing-library/react";
import { SaveStatusMessage } from "./SaveStatusMessage";

describe("SaveStatusMessage", () => {
  it("styles a success", () => {
    render(<SaveStatusMessage status={{ ok: true, text: "Saved" }} />);
    expect(screen.getByText("Saved")).toHaveClass("ok");
  });

  it("styles a failure", () => {
    render(<SaveStatusMessage status={{ ok: false, text: "Save failed" }} />);
    expect(screen.getByText("Save failed")).toHaveClass("error");
  });
});
