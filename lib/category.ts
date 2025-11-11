export function getCategoryIcon(category: string): string {
  switch (category) {
    case "Economics":
      return "📊";
    case "Politics":
      return "🗳️";
    case "Cryptocurrency":
      return "₿";
    case "Technology":
      return "🤖";
    case "Stocks":
      return "📈";
    case "World Events":
      return "🌍";
    default:
      return "❓";
  }
}
