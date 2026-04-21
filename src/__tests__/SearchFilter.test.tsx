/**
 * SearchFilter — Unit Tests
 *
 * WHY THIS COMPONENT IS CRITICAL:
 * SearchFilter drives every query sent to GraphQL. A broken search or filter
 * means users can never narrow down transactions — the core UX of the explorer.
 * Testing it verifies the debounced input and status filter buttons fire the
 * correct callbacks with the right values.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchFilter from "../components/SearchFilter";

describe("SearchFilter", () => {
  describe("search input", () => {
    it("renders the search input with correct placeholder", () => {
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={vi.fn()} currentFilter={null} />
      );
      expect(
        screen.getByPlaceholderText("Search by mission name...")
      ).toBeInTheDocument();
    });

    it("calls onSearch after typing in the input", async () => {
      vi.useFakeTimers();
      const handleSearch = vi.fn();
      render(
        <SearchFilter onSearch={handleSearch} onFilterSuccess={vi.fn()} currentFilter={null} />
      );

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Starlink" } });

      await act(async () => {
        vi.advanceTimersByTime(350);
      });

      expect(handleSearch).toHaveBeenCalledWith("Starlink");
      vi.useRealTimers();
    });

    it("has an accessible label for the search input", () => {
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={vi.fn()} currentFilter={null} />
      );
      const input = screen.getByLabelText("Search transactions");
      expect(input).toBeInTheDocument();
    });
  });

  describe("status filter buttons", () => {
    it("renders All, Success, and Failed filter buttons", () => {
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={vi.fn()} currentFilter={null} />
      );
      expect(screen.getByText("All")).toBeInTheDocument();
      expect(screen.getByText("Success")).toBeInTheDocument();
      expect(screen.getByText("Failed")).toBeInTheDocument();
    });

    it("calls onFilterSuccess with true when Success is clicked", () => {
      const handleFilter = vi.fn();
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={handleFilter} currentFilter={null} />
      );
      fireEvent.click(screen.getByText("Success"));
      expect(handleFilter).toHaveBeenCalledWith(true);
    });

    it("calls onFilterSuccess with false when Failed is clicked", () => {
      const handleFilter = vi.fn();
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={handleFilter} currentFilter={null} />
      );
      fireEvent.click(screen.getByText("Failed"));
      expect(handleFilter).toHaveBeenCalledWith(false);
    });

    it("calls onFilterSuccess with null when All is clicked", () => {
      const handleFilter = vi.fn();
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={handleFilter} currentFilter={true} />
      );
      fireEvent.click(screen.getByText("All"));
      expect(handleFilter).toHaveBeenCalledWith(null);
    });

    it("marks the active filter button with aria-pressed=true", () => {
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={vi.fn()} currentFilter={true} />
      );
      const successBtn = screen.getByText("Success");
      expect(successBtn).toHaveAttribute("aria-pressed", "true");
    });

    it("marks inactive filter buttons with aria-pressed=false", () => {
      render(
        <SearchFilter onSearch={vi.fn()} onFilterSuccess={vi.fn()} currentFilter={true} />
      );
      const allBtn = screen.getByText("All");
      expect(allBtn).toHaveAttribute("aria-pressed", "false");
    });
  });
});
