/**
 * TransactionCard — Unit Tests
 *
 * WHY THIS COMPONENT IS CRITICAL:
 * TransactionCard is the primary data display unit. Every character
 * ("transaction") the user sees is rendered through this component. If cards
 * fail to render data, display the wrong status, or break click/keyboard
 * interactions, the application is effectively unusable.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionCard from "../components/TransactionCard";
import type { Character } from "../types/api";

const mockCharacter: Character = {
  id: "1",
  name: "Rick Sanchez",
  status: "Alive",
  species: "Human",
  type: "",
  gender: "Male",
  image: "https://example.com/rick.png",
  created: "2017-11-04T18:48:46.250Z",
  origin: { id: "1", name: "Earth (C-137)" },
  location: { id: "3", name: "Citadel of Ricks" },
};

const mockDeadCharacter: Character = {
  ...mockCharacter,
  id: "2",
  name: "Morty Smith",
  status: "Dead",
};

const mockUnknownCharacter: Character = {
  ...mockCharacter,
  id: "3",
  name: "Mystery Person",
  status: "unknown",
};

describe("TransactionCard", () => {
  describe("renders correctly with data", () => {
    it("displays the character name", () => {
      render(<TransactionCard character={mockCharacter} onClick={vi.fn()} />);
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
    });

    it("displays the species", () => {
      render(<TransactionCard character={mockCharacter} onClick={vi.fn()} />);
      expect(screen.getByText(/Human/)).toBeInTheDocument();
    });

    it("displays the origin", () => {
      render(<TransactionCard character={mockCharacter} onClick={vi.fn()} />);
      expect(screen.getByText(/Earth \(C-137\)/)).toBeInTheDocument();
    });

    it("renders the avatar image", () => {
      render(<TransactionCard character={mockCharacter} onClick={vi.fn()} />);
      const img = screen.getByAltText("Rick Sanchez avatar");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/rick.png");
    });
  });

  describe("status badge", () => {
    it("shows 'Alive' for a live character", () => {
      render(<TransactionCard character={mockCharacter} onClick={vi.fn()} />);
      expect(screen.getByText("Alive")).toBeInTheDocument();
    });

    it("shows 'Dead' for a dead character", () => {
      render(
        <TransactionCard character={mockDeadCharacter} onClick={vi.fn()} />
      );
      expect(screen.getByText("Dead")).toBeInTheDocument();
    });

    it("shows 'Unknown' when status is unknown", () => {
      render(
        <TransactionCard character={mockUnknownCharacter} onClick={vi.fn()} />
      );
      expect(screen.getByText("Unknown")).toBeInTheDocument();
    });
  });

  describe("click interaction", () => {
    it("calls onClick with the correct character ID when clicked", () => {
      const handleClick = vi.fn();
      render(<TransactionCard character={mockCharacter} onClick={handleClick} />);

      const card = screen.getByRole("listitem");
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith("1");
    });
  });

  describe("keyboard accessibility", () => {
    it("triggers onClick when Enter key is pressed", () => {
      const handleClick = vi.fn();
      render(<TransactionCard character={mockCharacter} onClick={handleClick} />);

      const card = screen.getByRole("listitem");
      fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith("1");
    });

    it("triggers onClick when Space key is pressed", () => {
      const handleClick = vi.fn();
      render(<TransactionCard character={mockCharacter} onClick={handleClick} />);

      const card = screen.getByRole("listitem");
      fireEvent.keyDown(card, { key: " ", code: "Space" });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("has tabIndex=0 for focusability", () => {
      render(<TransactionCard character={mockCharacter} onClick={vi.fn()} />);
      const card = screen.getByRole("listitem");
      expect(card).toHaveAttribute("tabindex", "0");
    });
  });
});
