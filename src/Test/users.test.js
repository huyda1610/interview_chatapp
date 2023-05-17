import React from "react";
import { getByText, render, fireEvent } from "@testing-library/react";
import Users, { validateEmail } from "../Pages/users";

describe("users", () => {
  test("validate function should pass on correct input", () => {
    const text = "huy@gmail.com";
    expect(validateEmail(text)).toBe(true);
  });

  test("validate function should fail on correct input", () => {
    const text = "huy1123";
    expect(validateEmail(text)).not.toBe(true);
  });

  test("form should be in the document", () => {
    const { screen } = render(<Users />);
    const labelNode = screen.getByText("Email");
    expect(labelNode).toBeInTheDocument();
  });

  test("email field should have label", () => {
    const { screen } = render(<Users />);
    const emailInputNode = screen.getByLabelText("Email");
    expect(emailInputNode.getAttribute("name")).toBe("email");
  });

  test("email input should accept text", () => {
    const { screen } = render(<Users />);
    const emailInputNode = screen.getByLabelText("Email");
    expect(emailInputNode.value).toMatch("");
    fireEvent.change(emailInputNode, { target: { value: "testing" } });
    expect(emailInputNode.value).toMatch("testing");
  });
});
