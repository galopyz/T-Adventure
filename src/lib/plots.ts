import { writable } from 'svelte/store';

let uid = 1;

export const plots = writable([
  {
    id: uid++,
    order: 0,
    title: 'Welcome',
    story: 'I\'m so hungry, and I\'m gonna eat something!',
  },
  { id: uid++, order: 1, title: 'Eat banana', story: 'I ate a banana. `(choice (Eat apple) (Drink milk))' },
  { id: uid++, order: 2, title: 'Eat apple', story: 'I ate an apple' },
  { id: uid++, order: 3, title: 'Drink milk', story: 'I drank milk' },
  { id: uid++, order: -1, title: 'Go outside', story: 'I went outside' },
  {
    id: uid++,
    order: -1,
    title: 'Stay home',
    story: 'I stayed at home',
  },
]);

interface PlotType {
  id: number;
  order: number;
  title: string;
  story: string;
}

export function add() {
  const plot = {
    id: uid++,
    order: -1,
    title: '',
    story: '',
  };

  plots.update(plots => [...plots, plot]);
}

export function remove(plotId: number) {
  plots.update(plots => plots.filter((t) => t.id !== plotId))
}

export function mark(plotId: number, order: number) {
  plots.update(plots => {
    plots.forEach(plot => {
      if (plot.id === plotId) {
        plot.order = order;
      }
  })
  return plots
});
}

export function reorder(num:number) {
  plots.update(plots => {
    const orderedPlots = plots.filter((t) => t.order !== -1);
    for (let i = num + 1; i < orderedPlots.length; i++) {
      plots.forEach(plot => {
        if (plot.order === i) {
          plot.order--;
        }
      })
    }
    return plots;
  });
}