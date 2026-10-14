import { render, screen } from "@testing-library/react";
import { Section } from "./Section";

describe("Section", () => {
  it("renders the title as a heading with its children", () => {
    render(
      <Section title="History">
        <p>content</p>
      </Section>,
    );
    expect(screen.getByRole("heading", { name: "History" })).toBeInTheDocument();
    expect(screen.getByText("content")).toBeInTheDocument();
  });
});
