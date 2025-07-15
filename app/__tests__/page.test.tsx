import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import ProductGrid from "../page";
import React from "react";

// Mock product data
const mockProducts = [
  {
    id: "1",
    image: "/Images/product-1.jpeg",
    title: "Test Earbud 1",
    type: "Noise Cancelling",
    quantity: "1 Pair",
    options: "Black",
    rating: 4.5,
    reviewCount: 100,
    purchaseStats: "10K+ bought",
    price: 99.99,
    originalPrice: 129.99,
    subscriptionPrice: 89.99,
    subscriptionDiscount: "Subscribe & Save",
    delivery: "FREE delivery",
    fastestDelivery: "Tomorrow",
    moreOptions: "$90 (2 new offers)",
    eligibility: "FSA eligible",
    isTopRated: true,
  },
  {
    id: "2",
    image: "/Images/product-2.jpeg",
    title: "Test Earbud 2",
    type: "Sport",
    quantity: "1 Pair",
    options: "White",
    rating: 4.2,
    reviewCount: 50,
    purchaseStats: "5K+ bought",
    price: 59.99,
    originalPrice: 79.99,
    subscriptionPrice: 54.99,
    subscriptionDiscount: "Subscribe & Save",
    delivery: "FREE delivery",
    fastestDelivery: "Tomorrow",
    moreOptions: "$55 (1 new offer)",
    eligibility: "FSA eligible",
    isTopRated: false,
  },
];

// Mock fetch for products
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockProducts),
    }),
  ) as jest.Mock;
});

afterAll(() => {
  jest.resetAllMocks();
});

describe("ProductGrid", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders product card correctly", async () => {
    render(<ProductGrid />);
    expect(await screen.findByText("Test Earbud 1")).toBeInTheDocument();
    // Check for price split across elements
    expect(screen.getAllByText("$").length).toBeGreaterThan(0);
    expect(screen.getByText("99")).toBeInTheDocument();
    expect(screen.getAllByText(".99").length).toBeGreaterThan(0);
    expect(
      screen.getByRole("img", { name: /Test Earbud 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /add .* to cart/i })[0],
    ).toBeInTheDocument();
  });

  it("add-to-cart button updates cart count", async () => {
    render(<ProductGrid />);
    const addButton = await screen.findAllByRole("button", {
      name: /add .* to cart/i,
    });
    fireEvent.click(addButton[0]);
    expect(await screen.findByText("1")).toBeInTheDocument(); // badge
  });

  it("cart persists after reload (localStorage)", async () => {
    render(<ProductGrid />);
    const addButton = await screen.findAllByRole("button", {
      name: /add .* to cart/i,
    });
    fireEvent.click(addButton[0]);
    await waitFor(() => expect(screen.getByText("1")).toBeInTheDocument());
    // Simulate reload
    render(<ProductGrid />);
    expect(await screen.findByText("1")).toBeInTheDocument();
  });

  it("cart drawer displays correct product and quantity", async () => {
    render(<ProductGrid />);
    const addButton = await screen.findAllByRole("button", {
      name: /add .* to cart/i,
    });
    fireEvent.click(addButton[0]);
    // Open cart drawer
    const cartButton = screen.getByLabelText(/open cart/i);
    fireEvent.click(cartButton);
    // Find all elements with the product title
    const allTitles = await screen.findAllByText("Test Earbud 1");
    // Find the one inside a <li> (cart item)
    const cartItem = allTitles
      .map((el) => el.closest("li"))
      .find((li) => li !== null);
    expect(cartItem).not.toBeNull();
    expect(within(cartItem!).getByText("1")).toBeInTheDocument();
  });

  it("filters products by type", async () => {
    render(<ProductGrid />);
    // Select "Sport" from filter
    const filterSelect = await screen.findByLabelText(/filter by type/i);
    fireEvent.change(filterSelect, { target: { value: "Sport" } });
    expect(await screen.findByText("Test Earbud 2")).toBeInTheDocument();
    expect(screen.queryByText("Test Earbud 1")).not.toBeInTheDocument();
  });
});
