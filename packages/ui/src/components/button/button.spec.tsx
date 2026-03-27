// button.spec.tsx
import { render, screen } from "@testing-library/react";
import { Button } from ".";

describe("Button", () => {
  it("renders button", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("Should render text", () => {
    render(<Button>Click</Button>);
    expect(screen.getByText('Click')).toBeInTheDocument()
  });
});
