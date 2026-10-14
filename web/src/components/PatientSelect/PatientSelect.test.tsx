import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TEXT, USERS } from "../../common";
import { PatientSelect } from "./PatientSelect";

describe("PatientSelect", () => {
  it("lists every user and selects the current token", () => {
    render(<PatientSelect token={USERS[1].token} onChange={() => {}} />);
    const select = screen.getByLabelText(TEXT.PATIENT_LABEL);
    expect(screen.getAllByRole("option").map((option) => option.textContent)).toEqual(USERS.map((user) => user.name));
    expect(select).toHaveValue(USERS[1].token);
  });

  it("reports the token of the chosen user", async () => {
    const onChange = vi.fn();
    render(<PatientSelect token={USERS[0].token} onChange={onChange} />);
    await userEvent.selectOptions(screen.getByLabelText(TEXT.PATIENT_LABEL), USERS[1].name);
    expect(onChange).toHaveBeenCalledWith(USERS[1].token);
  });
});
