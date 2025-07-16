import { getTimestamp } from 'virtual:vite-info';

export const logSomething = () => {
    console.log(`The time is ${getTimestamp()}`);
}