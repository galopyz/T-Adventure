import { writable } from 'svelte/store';

let uid = 1;

export const plots = writable([
  { id: uid++, ordered: false, title: 'Eat banana', story: 'I ate a banana. `(choice (Eat apple) (Drink milk))' },
  { id: uid++, ordered: false, title: 'Eat apple', story: 'I ate an apple' },
  { id: uid++, ordered: true, title: 'Drink milk', story: 'I drank milk' },
  {
    id: uid++,
    ordered: false,
    title: 'Drink orange juice',
    story: 'I drank OJ',
  },
  { id: uid++, ordered: false, title: 'Go outside', story: 'I went outside' },
  {
    id: uid++,
    ordered: false,
    title: 'Stay home',
    story: 'I stayed at home',
  },
]);

interface PlotType {
  id: number;
  ordered: boolean;
  title: string;
  story: string;
}

export function add() {
  const plot = {
    id: uid++,
    ordered: false,
    title: '',
    story: '',
  };

  plots.update(plots => [plot, ...plots]);
}

export function remove(plot: PlotType) {
  plots.update(plots => plots.filter((t) => t !== plot))
}

export function mark(plot: PlotType, ordered: boolean) {
  plot.ordered = ordered;
  remove(plot);
  plots.update(plots => plots.concat(plot));
}
