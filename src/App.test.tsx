import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import MapAddressComponent from "./components/molecules/sample";

// test("renders learn react link", () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

test("renders map address detail", () => {
  render(<MapAddressComponent />);
  const linkElement = screen.getByRole(/button/i);
  expect(linkElement).toHaveTextContent(/경로보기/i);
});
