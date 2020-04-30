export enum BoardNumber {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Eleven,
  Twelve,
  Thirteen,
  Fourteen,
  Fifteen,
  Sixteen,
  Seventeen,
  Eighteen,
  Nineteen,
  Twenty,
}

type TargetKind = 'number' | 'bullseye' | 'miss';

interface BoardValue {
  value: number;
  kind: TargetKind;
  /**
   * Turn board value to string representation
   */
  toValueString(): string;
}

export enum BoardNumberMultiplier {
  Single = 1,
  Double,
  Treble,
}

export class NumberTarget implements BoardValue {
  kind: 'number' = 'number';
  private constructor(
    public number: BoardNumber,
    public multiplier: BoardNumberMultiplier,
  ) {}

  get value() {
    return this.number * this.multiplier;
  }

  get double() {
    return this.multiplier === BoardNumberMultiplier.Double;
  }

  /**
   * Nu
   */
  toValueString() {
    return this.multiplierString + this.number.toString();
  }

  private get multiplierString() {
    switch (this.multiplier) {
      case BoardNumberMultiplier.Double:
        return 'D';
      case BoardNumberMultiplier.Treble:
        return 'T';
      default:
        return 'S';
    }
  }

  static of(number: BoardNumber, multiplier: BoardNumberMultiplier) {
    return new NumberTarget(number, multiplier);
  }
}

export class Miss implements BoardValue {
  kind: 'miss' = 'miss';
  number = 0;
  multiplier = 0;
  value = 0;

  toValueString() {
    return 'Miss';
  }
}

enum BullseyeValue {
  Outer = 25,
  Inner = 50,
}
export class BullseyeTarget implements BoardValue {
  kind: 'bullseye' = 'bullseye';
  private constructor(public type: BullseyeValue) {}

  get value() {
    return this.type.valueOf();
  }

  get inner() {
    return this.type === BullseyeValue.Inner;
  }

  static inner() {
    return new BullseyeTarget(BullseyeValue.Inner);
  }

  static outter() {
    return new BullseyeTarget(BullseyeValue.Outer);
  }

  /**
   * Vs
   */
  toValueString() {
    return this.inner ? 'Bull' : 'Outer Bull';
  }
}

export type BoardPosition = BullseyeTarget | NumberTarget | Miss;
