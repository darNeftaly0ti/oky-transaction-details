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
import type { Launch } from "../types/api";

const mockLaunch: Launch = {
  id: "109",
  mission_name: "Starlink-15",
  launch_date_local: "2020-10-24T11:31:00-04:00",
  launch_success: true,
  details: "This mission launched 60 Starlink satellites.",
  launch_site: { site_name_long: "Kennedy Space Center Launch Complex 39A" },
  links: {
    mission_patch_small: "https://example.com/patch.png",
    mission_patch: "https://example.com/patch-large.png",
    article_link: "https://example.com/article",
    video_link: "https://youtube.com/watch?v=123",
    flickr_images: ["https://example.com/img1.jpg"],
  },
  rocket: {
    rocket_name: "Falcon 9",
    rocket_type: "FT",
    rocket: {
      description: "A two-stage rocket",
      first_flight: "2010-06-04",
      cost_per_launch: 50000000,
    },
  },
};

const mockFailedLaunch: Launch = {
  ...mockLaunch,
  id: "110",
  mission_name: "CRS-7",
  launch_success: false,
  details: "Launch failed due to overpressure in helium tank.",
};

const mockLaunches: Launch[] = [mockLaunch, mockFailedLaunch];

describe("TransactionList", () => {
  describe("renders list of items correctly", () => {
    it("renders one card per launch", () => {
      render(<TransactionList launches={mockLaunches} onCardClick={vi.fn()} />);
      const items = screen.getAllByRole("listitem");
      expect(items).toHaveLength(2);
    });

    it("displays the mission name of each launch", () => {
      render(<TransactionList launches={mockLaunches} onCardClick={vi.fn()} />);
      expect(screen.getByText("Starlink-15")).toBeInTheDocument();
      expect(screen.getByText("CRS-7")).toBeInTheDocument();
    });

    it("has an accessible list role", () => {
      render(<TransactionList launches={mockLaunches} onCardClick={vi.fn()} />);
      const list = screen.getByRole("list");
      expect(list).toBeInTheDocument();
    });

    it("passes onCardClick to each card", () => {
      const handleCardClick = vi.fn();
      render(
        <TransactionList launches={mockLaunches} onCardClick={handleCardClick} />
      );

      const items = screen.getAllByRole("listitem");
      fireEvent.click(items[0]);

      expect(handleCardClick).toHaveBeenCalledTimes(1);
      expect(handleCardClick).toHaveBeenCalledWith("109");
    });
  });

  describe("empty list", () => {
    it("renders no items when launches array is empty", () => {
      render(<TransactionList launches={[]} onCardClick={vi.fn()} />);
      expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    });

    it("still renders the list container", () => {
      render(<TransactionList launches={[]} onCardClick={vi.fn()} />);
      expect(screen.getByRole("list")).toBeInTheDocument();
    });
  });
});
