let time: any = {};
let situation = 'end';

export function start(label: string) {
  time[label] = time[label]
    ? window.performance.now() - time[label]
    : window.performance.now();
  situation = 'pengding';
}

export function pause(label: string) {
  time[label] = window.performance.now() - time[label];
  situation = 'paused';
}

export function end() {
  return time;
}

export function clear() {
  time = {};
}

(window as any).end = end;
(window as any).clear = clear;

setInterval(() => {
  if (Object.keys(time).length !== 0) {
    console.table(end());
    clear();
  }
},1000);
