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

export const parseCard = (str) => {
  const [suit, rankStr] = str.split("_");
  const rankMap = { j: 11, q: 12, k: 13, a: 14 };
  const rank = rankMap[rankStr] || parseInt(rankStr);
  return { suit, rank };
};

export const getAll5CardCombos = (cards) => {
  const result = [];
  const n = cards.length;

  function pick(start, combo) {
    if (combo.length === 5) {
      result.push([...combo]);
      return;
    }
    for (let i = start; i < n; i++) {
      combo.push(cards[i]);
      pick(i + 1, combo);
      combo.pop();
    }
  }

  pick(0, []);
  return result;
};

export const scoreHand = (cards) => {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);

  const rankCount = {};
  ranks.forEach((r) => (rankCount[r] = (rankCount[r] || 0) + 1));

  const isFlush = suits.every((s) => s === suits[0]);

  const isStraight = (() => {
    const unique = [...new Set(ranks)];
    if (unique.length < 5) return false;
    for (let i = 0; i < 4; i++) {
      if (unique[i] - 1 !== unique[i + 1]) return false;
    }
    return true;
  })();

  if (isFlush && isStraight) {
    if (ranks[0] === 14) {
      return { value: 9000000, handName: "Royal Flush", cards };
    }
    return { value: 8000000 + ranks[0], handName: "Straight Flush", cards };
  }

  const four = Object.keys(rankCount).find((r) => rankCount[r] === 4);
  if (four) {
    return {
      value: 7000000 + parseInt(four),
      handName: "Four of a Kind",
      cards,
    };
  }

  const three = Object.keys(rankCount).find((r) => rankCount[r] === 3);
  const pair = Object.keys(rankCount).find((r) => rankCount[r] === 2);
  if (three && pair) {
    return {
      value: 6000000 + parseInt(three) * 100 + parseInt(pair),
      handName: "Full House",
      cards,
    };
  }

  if (isFlush) {
    return { value: 5000000 + ranks[0], handName: "Flush", cards };
  }

  if (isStraight) {
    return { value: 4000000 + ranks[0], handName: "Straight", cards };
  }

  if (three) {
    return {
      value: 3000000 + parseInt(three),
      handName: "Three of a Kind",
      cards,
    };
  }

  const pairs = Object.keys(rankCount).filter((r) => rankCount[r] === 2);
  if (pairs.length === 2) {
    const high = Math.max(...pairs.map(Number));
    return { value: 2000000 + high, handName: "Two Pair", cards };
  }

  if (pair) {
    return { value: 1000000 + parseInt(pair), handName: "One Pair", cards };
  }

  return { value: ranks[0], handName: "High Card", cards };
};

export const rankResults = (results) => {
  results.sort((a, b) => b.score - a.score);

  let currentRank = 1;
  let lastScore = null;
  const topScore = results[0]?.score ?? 0;

  const final = [];

  results.forEach((res, idx) => {
    if (res.score !== lastScore) {
      currentRank = idx + 1;
      lastScore = res.score;
    }

    const status = res.score === topScore ? "win" : "lose";

    final.push({
      ...res,
      position: currentRank,
      status,
    });
  });

  return final;
};

export const ResultTable = (tableCards, playersCards) => {
  const table = tableCards.map(parseCard);

  const results = [];

  for (const playerId in playersCards) {
    const { players, cards } = playersCards[playerId];
    const hand = cards.map(parseCard);

    const all7 = [...table, ...hand];
    const combos = getAll5CardCombos(all7);

    let best = null;

    for (const five of combos) {
      const score = scoreHand(five);
      if (!best || score.value > best.value) {
        best = score;
      }
    }

    results.push({
      player: players,
      bestHand: best.handName,
      score: best.value,
      bestCards: tableCards,
      playerCards: cards,
    });
  }
  const final = rankResults(results);

  return final;
};
