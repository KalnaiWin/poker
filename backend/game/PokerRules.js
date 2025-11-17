export const createTable = () => {
  const suits = ["spade", "hearts", "diamond", "clubs"];
  const ranks = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "j",
    "q",
    "k",
    "1",
  ];
  const table = [];
  for (let suit of suits) {
    for (let rank of ranks) {
      table.push(suit + "_" + rank);
    }
  }
  return table;
};

export const shuffleCards = (table) => {
  for (let i = table.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [table[i], table[j]] = [table[j], table[i]];
  }
  return table;
};

export const dealCards = (table, count) => {
  if (table.length < count) throw new Error("Not enough cards in the deck");

  const dealt = [];
  for (let i = 0; i < count; i++) {
    dealt.push(table.pop());
  }

  return dealt;
};
