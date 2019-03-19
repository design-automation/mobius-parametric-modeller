export function approx(n1: number, n2: number, t: number) {
    return Math.abs(n1 - n2) < t;
}

