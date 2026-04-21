import React from "react";
import type { Launch } from "../types/api";
import TransactionCard from "./TransactionCard";

interface TransactionListProps {
  launches: Launch[];
  onCardClick: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  launches,
  onCardClick,
}) => {
  return (
    <div
      role="list"
      aria-label="Transaction list"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {launches.map((launch) => (
        <TransactionCard
          key={launch.id}
          launch={launch}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default TransactionList;
