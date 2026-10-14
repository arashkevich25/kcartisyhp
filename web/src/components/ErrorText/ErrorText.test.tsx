import { render, screen } from "@testing-library/react";
import { ErrorText } from "./ErrorText";

describe("ErrorText", () => {
  it("shows the message with the error style", () => {
    render(<ErrorText message="Something broke" />);
    expect(screen.getByText("Something broke")).toHaveClass("error");
  });
});
