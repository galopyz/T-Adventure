interface PlotType {
  id: number;
  order: number;
  title: string;
  story: string;
}

export function sortPlots(plots: Array<PlotType>) {
  return plots.filter((t) => t.order !== -1).sort((a, b) => a.order - b.order);
}
