/**
 * SearchFilter — Unit Tests
 *
 * WHY THIS COMPONENT IS CRITICAL:
 * SearchFilter drives every query sent to GraphQL. A broken search or filter
 * means users can never narrow down transactions — the core UX of the explorer.
 * Testing it verifies the debounced input and filter buttons fire the correct
 * callbacks with the right values.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchFilter from "../components/SearchFilter";
import type { SortOrder } from "../hooks/useCharacters";

interface PartialProps {
  onSearch?: (v: string) => void;
  onFilterStatus?: (v: string) => void;
  onFilterSpecies?: (v: string) => void;
  onSortChange?: (v: SortOrder) => void;
  currentStatus?: string;
  currentSpecies?: string;
  currentSort?: SortOrder;
}

const renderFilter = (overrides: PartialProps = {}) =>
  render(
    <SearchFilter
      onSearch={overrides.onSearch ?? vi.fn()}
      onFilterStatus={overrides.onFilterStatus ?? vi.fn()}
      onFilterSpecies={overrides.onFilterSpecies ?? vi.fn()}
      onSortChange={overrides.onSortChange ?? vi.fn()}
      currentStatus={overrides.currentStatus ?? ""}
      currentSpecies={overrides.currentSpecies ?? ""}
      currentSort={overrides.currentSort ?? "newest"}
    />
  );

describe("SearchFilter", () => {
  describe("search input", () => {
    it("renders the search input with correct placeholder", () => {
      renderFilter();
      expect(
        screen.getByPlaceholderText("Search by name...")
      ).toBeInTheDocument();
    });

    it("calls onSearch after typing in the input (debounced)", async () => {
      vi.useFakeTimers();
      const handleSearch = vi.fn();
      renderFilter({ onSearch: handleSearch });

      const input = screen.getByRole("textbox");
      fireEvent.change(input, { target: { value: "Rick" } });

      await act(async () => {
        vi.advanceTimersByTime(350);
      });

      expect(handleSearch).toHaveBeenCalledWith("Rick");
      vi.useRealTimers();
    });

    it("has an accessible label for the search input", () => {
      renderFilter();
      const input = screen.getByLabelText("Search transactions");
      expect(input).toBeInTheDocument();
    });
  });

  describe("status filter buttons", () => {
    it("renders All, Alive, Dead and Unknown filter buttons", () => {
      renderFilter();
      expect(screen.getByText("All")).toBeInTheDocument();
      expect(screen.getByText("Alive")).toBeInTheDocument();
      expect(screen.getByText("Dead")).toBeInTheDocument();
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });

    it("calls onFilterStatus with 'alive' when Alive is clicked", () => {
      const handleFilter = vi.fn();
      renderFilter({ onFilterStatus: handleFilter });
      fireEvent.click(screen.getByText("Alive"));
      expect(handleFilter).toHaveBeenCalledWith("alive");
    });

    it("calls onFilterStatus with 'dead' when Dead is clicked", () => {
      const handleFilter = vi.fn();
      renderFilter({ onFilterStatus: handleFilter });
      fireEvent.click(screen.getByText("Dead"));
      expect(handleFilter).toHaveBeenCalledWith("dead");
    });

    it("calls onFilterStatus with empty string when All is clicked", () => {
      const handleFilter = vi.fn();
      renderFilter({ onFilterStatus: handleFilter, currentStatus: "alive" });
      fireEvent.click(screen.getByText("All"));
      expect(handleFilter).toHaveBeenCalledWith("");
    });

    it("marks the active filter button with aria-pressed=true", () => {
      renderFilter({ currentStatus: "alive" });
      expect(screen.getByText("Alive")).toHaveAttribute("aria-pressed", "true");
    });

    it("marks inactive filter buttons with aria-pressed=false", () => {
      renderFilter({ currentStatus: "alive" });
      expect(screen.getByText("All")).toHaveAttribute("aria-pressed", "false");
    });
  });

  describe("species filter", () => {
    it("renders the species dropdown with all options", () => {
      renderFilter();
      expect(screen.getByRole("combobox")).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "All species" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: "Human" })
      ).toBeInTheDocument();
    });

    it("calls onFilterSpecies when a species is selected", () => {
      const handleSpecies = vi.fn();
      renderFilter({ onFilterSpecies: handleSpecies });
      fireEvent.change(screen.getByRole("combobox"), {
        target: { value: "Human" },
      });
      expect(handleSpecies).toHaveBeenCalledWith("Human");
    });
  });

  describe("sort toggle", () => {
    it("shows 'Newest first' when sort order is newest", () => {
      renderFilter({ currentSort: "newest" });
      expect(screen.getByText("Newest first")).toBeInTheDocument();
    });

    it("shows 'Oldest first' when sort order is oldest", () => {
      renderFilter({ currentSort: "oldest" });
      expect(screen.getByText("Oldest first")).toBeInTheDocument();
    });

    it("toggles sort order when clicked", () => {
      const handleSort = vi.fn();
      renderFilter({ onSortChange: handleSort, currentSort: "newest" });
      fireEvent.click(screen.getByText("Newest first"));
      expect(handleSort).toHaveBeenCalledWith("oldest");
    });
  });

  describe("active filter chips", () => {
    it("shows active filter chips when filters are applied", () => {
      renderFilter({ currentStatus: "alive", currentSpecies: "Human" });
      expect(screen.getByText("Active filters:")).toBeInTheDocument();
      expect(screen.getByText("Status: Alive")).toBeInTheDocument();
      expect(screen.getByText("Species: Human")).toBeInTheDocument();
    });

    it("clears all filters when 'Clear all' is clicked", () => {
      const handleStatus = vi.fn();
      const handleSpecies = vi.fn();
      renderFilter({
        onFilterStatus: handleStatus,
        onFilterSpecies: handleSpecies,
        currentStatus: "alive",
        currentSpecies: "Human",
      });
      fireEvent.click(screen.getByText("Clear all"));
      expect(handleStatus).toHaveBeenCalledWith("");
      expect(handleSpecies).toHaveBeenCalledWith("");
    });
  });
});
