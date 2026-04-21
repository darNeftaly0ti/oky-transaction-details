/**
 * TransactionCard — Unit Tests
 *
 * WHY THIS COMPONENT IS CRITICAL:
 * TransactionCard is the primary data display unit. Every launch ("transaction")
 * the user sees is rendered through this component. If cards fail to render data,
 * display the wrong status, or break click/keyboard interactions, the application
 * is effectively unusable.
 */

import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TransactionCard from "../components/TransactionCard";
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

const mockPendingLaunch: Launch = {
  ...mockLaunch,
  id: "111",
  mission_name: "Pending Mission",
  launch_success: null,
  details: null,
};

describe("TransactionCard", () => {
  describe("renders correctly with data", () => {
    it("displays the mission name", () => {
      render(<TransactionCard launch={mockLaunch} onClick={vi.fn()} />);
      expect(screen.getByText("Starlink-15")).toBeInTheDocument();
    });

    it("displays the rocket name", () => {
      render(<TransactionCard launch={mockLaunch} onClick={vi.fn()} />);
      expect(screen.getByText(/Falcon 9/)).toBeInTheDocument();
    });

    it("displays the details text", () => {
      render(<TransactionCard launch={mockLaunch} onClick={vi.fn()} />);
      expect(
        screen.getByText("This mission launched 60 Starlink satellites.")
      ).toBeInTheDocument();
    });

    it("renders the mission patch image", () => {
      render(<TransactionCard launch={mockLaunch} onClick={vi.fn()} />);
      const img = screen.getByAltText("Starlink-15 patch");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", "https://example.com/patch.png");
    });
  });

  describe("status badge", () => {
    it("shows 'Success' for a successful launch", () => {
      render(<TransactionCard launch={mockLaunch} onClick={vi.fn()} />);
      expect(screen.getByText("Success")).toBeInTheDocument();
    });

    it("shows 'Failed' for a failed launch", () => {
      render(<TransactionCard launch={mockFailedLaunch} onClick={vi.fn()} />);
      expect(screen.getByText("Failed")).toBeInTheDocument();
    });

    it("shows 'Pending' when launch_success is null", () => {
      render(<TransactionCard launch={mockPendingLaunch} onClick={vi.fn()} />);
      expect(screen.getByText("Pending")).toBeInTheDocument();
    });
  });

  describe("click interaction", () => {
    it("calls onClick with the correct launch ID when clicked", () => {
      const handleClick = vi.fn();
      render(<TransactionCard launch={mockLaunch} onClick={handleClick} />);

      const card = screen.getByRole("listitem");
      fireEvent.click(card);

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith("109");
    });
  });

  describe("keyboard accessibility", () => {
    it("triggers onClick when Enter key is pressed", () => {
      const handleClick = vi.fn();
      render(<TransactionCard launch={mockLaunch} onClick={handleClick} />);

      const card = screen.getByRole("listitem");
      fireEvent.keyDown(card, { key: "Enter", code: "Enter" });

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith("109");
    });

    it("triggers onClick when Space key is pressed", () => {
      const handleClick = vi.fn();
      render(<TransactionCard launch={mockLaunch} onClick={handleClick} />);

      const card = screen.getByRole("listitem");
      fireEvent.keyDown(card, { key: " ", code: "Space" });

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("has tabIndex=0 for focusability", () => {
      render(<TransactionCard launch={mockLaunch} onClick={vi.fn()} />);
      const card = screen.getByRole("listitem");
      expect(card).toHaveAttribute("tabindex", "0");
    });
  });
});
