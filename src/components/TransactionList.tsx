import React from "react";
import type { Character } from "../types/api";
import TransactionCard from "./TransactionCard";

interface TransactionListProps {
  characters: Character[];
  onCardClick: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  characters,
  onCardClick,
}) => {
  return (
    <div
      role="list"
      aria-label="Transaction list"
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
    >
      {characters.map((character) => (
        <TransactionCard
          key={character.id}
          character={character}
          onClick={onCardClick}
        />
      ))}
    </div>
  );
};

export default TransactionList;
