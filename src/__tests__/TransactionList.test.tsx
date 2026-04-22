/**
 * TransactionList — Unit Tests
 *
 * WHY THIS COMPONENT IS CRITICAL:
 * TransactionList is the main view that users interact with. It orchestrates
 * the rendering of all transaction cards. If this component fails, users see
 * nothing. Testing it ensures the list correctly renders data and passes
 * interaction handlers down to cards.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionList from "../components/TransactionList";
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

const mockCharacters: Character[] = [mockCharacter, mockDeadCharacter];

describe("TransactionList", () => {
  describe("renders list of items correctly", () => {
    it("renders one card per character", () => {
      render(
        <TransactionList characters={mockCharacters} onCardClick={vi.fn()} />
      );
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2);
    });

    it("displays the name of each character", () => {
      render(
        <TransactionList characters={mockCharacters} onCardClick={vi.fn()} />
      );
      expect(screen.getByText("Rick Sanchez")).toBeInTheDocument();
      expect(screen.getByText("Morty Smith")).toBeInTheDocument();
    });

    it("has an accessible list role", () => {
      render(
        <TransactionList characters={mockCharacters} onCardClick={vi.fn()} />
      );
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
    });

    it("passes onCardClick to each card", () => {
      const handleCardClick = vi.fn();
      render(
        <TransactionList
          characters={mockCharacters}
          onCardClick={handleCardClick}
        />
      );

      const items = screen.getAllByRole("listitem");
      fireEvent.click(items[0]);

      expect(handleCardClick).toHaveBeenCalledTimes(1);
      expect(handleCardClick).toHaveBeenCalledWith("1");
    });
  });

  describe("empty list", () => {
    it("renders no items when characters array is empty", () => {
      render(<TransactionList characters={[]} onCardClick={vi.fn()} />);
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });

    it("still renders the list container", () => {
      render(<TransactionList characters={[]} onCardClick={vi.fn()} />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
  });
});
