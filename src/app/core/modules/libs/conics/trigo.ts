/**
  * Solves exact solutions of the trigonometric equation A + B.cos(t) + C.sin(t) = 0
  * @param A, real number, parameter of the trigonometric equation
  * @param B, real number, parameter of the trigonometric equation
  * @param C, real number, parameter of the trigonometric equation
  * @return a set of 2 real numbers solutions of the equation
  */
export function _solve_trigo(A: number, B: number, C: number): number[] {
    const num1: number = -A;
    const den1: number = Math.sqrt(B*B + C*C);
    const num2: number = B;
    const den2: number = C;
    if(C === 0) {
        if(B === 0) {return null;}
        if(Math.abs(A/B)>1) {return null;}
        return [(-Math.acos(-A/B)) % (2*Math.PI), (Math.acos(-A/B)) % (2*Math.PI)];
    }
    if(Math.abs(num1/den1)>1) {return null;}
    const t1: number = Math.asin(num1/den1) - Math.atan(num2/den2);
    const t2: number = Math.PI - Math.atan(num2/den2) - Math.asin(num1/den1);
    return [t1 % (2*Math.PI),t2 % (2*Math.PI)];
}
