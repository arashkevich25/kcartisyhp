import { render } from "@testing-library/react";
import { TEXT } from "../../common";
import { Duration } from "./Duration";

describe("Duration", () => {
  it("renders seconds with the unit", () => {
    const { container } = render(<Duration seconds={36.3} />);
    expect(container).toHaveTextContent(`36.3${TEXT.SECONDS_UNIT}`);
  });
});
