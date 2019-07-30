class RClass {
  private uselast = true;
  private nextGaussian = 0.0;

  public get flip(): boolean {
    return this.pct(50);
  }

  public roll(n: string | number, d: number = 0, m: number = 0): number {
    if (!m && !d) {
      if (typeof n === "string") {
        let match = n.match(/(\d+)-(\d+)(:.*)?/);
        if (match) {
          n = 1;
          d = Number(match[2]) - Number(match[1]) + 1;
          m = Number(match[1]) - 1;
        } else {
          match = n.match(/(\d+)?d(\d+)(([+-])(\d+))?(:.*)?/);
          if (match) {
            n = Number(match[1]);
            d = Number(match[2]);
            m = match[3] ? Number(match[5]) * (match[4] === "-" ? -1 : 1) : 0;
          } else {
            d = Number(n);
            n = 1;
            m = 0;
          }
        }
      } else {
        d = n;
        n = 1;
        m = 0;
      }
    }
    let tot = 0;
    for (let i = 0; i < n; i++) {
      tot += this._roll(d);
    }
    return tot + m;
  }

  public pick<T>(list: T[], options = { remove: false }): T {
    const index = this._roll(list.length) - 1;
    const val: T = list[index];
    if (options.remove) {
      list.splice(index, 1);
    }
    return val;
  }

  public pickWeighted<T>(list: T[], weightField: string): T | undefined {
    const totalWeight: number = list.reduce(
      (sum: number, o: T) => sum + (o as any)[weightField],
      0
    );
    const roll = this._roll(totalWeight) - 1;
    let cur = 0;

    return list.find((c: T) => {
      cur += (c as any)[weightField];
      return roll <= cur;
    });
  }

  public pct(i: number): boolean {
    return this._roll(100) <= i;
  }

  public pcts(...c: any[]): number {
    let cnt = 0;
    let i = 0;
    while (this.pct(c[i++])) {
      cnt++;
    }
    return cnt;
  }

  public range(p0: number, p1: number): number {
    return this.roll(1, p1 - p0 + 1, p0 - 1);
  }

  public doRandomTimes(dice: string | number, func: (i: number) => void): void {
    const tot: number = this.roll(dice);
    for (let i = 0; i < tot; i++) {
      func(i);
    }
  }

  public BoxMuller(mean?: number, distribution?: number): number {
    if (mean) {
      return mean + Math.abs(this.BoxMuller() * (distribution as number));
    }
    if (this.uselast) {
      this.uselast = false;
      return this.nextGaussian;
    }

    let v1 = 2.0 * Math.random() - 1.0;
    let v2 = 2.0 * Math.random() - 1.0;
    let s = v1 * v1 + v2 * v2;

    while (s >= 1.0 || s === 0) {
      v1 = 2.0 * Math.random() - 1.0;
      v2 = 2.0 * Math.random() - 1.0;
      s = v1 * v1 + v2 * v2;
    }

    s = Math.sqrt((-2.0 * Math.log(s)) / s);

    this.nextGaussian = v2 * s;
    this.uselast = true;

    return v1 * s;
  }

  public rollGaussian(min: number, max: number): number {
    return Math.round(
      this.BoxMuller(min + (max - min) / 2.0, (max - min) / 2.0 / 3.0)
    );
  }

  public rollRarity(
    startSize: number = 60,
    factor: number = 0.5,
    limit: number = 5
  ): number {
    const rarities: number[] = [startSize];
    for (let i = 1; i <= limit; i++) {
      rarities.push(
        Math.max(Math.trunc(Math.ceil(rarities[i - 1] + startSize * factor)), 1)
      );
    }
    const val = R.roll(rarities[limit - 1]);

    for (const i in rarities) {
      if (val <= rarities[i]) {
        return Number(i);
      }
    }
    return limit;
  }

  public chooseByRarity<T>(
    list: { [id: string]: T[] },
    ...rarityOpts: any[]
  ): T {
    let rarity = ["common", "uncommon", "rare", "very rare", "priceless"][
      this.rollRarity(...rarityOpts)
    ];
    while (list[rarity].length === 0) {
      rarity = ["common", "uncommon", "rare", "very rare", "priceless"][
        this.rollRarity(...rarityOpts)
      ];
    }
    return R.pick<T>(list[rarity]);
  }

  private _roll(n: number): number {
    return Math.floor(Math.random() * n) + 1;
  }
}

export const R = new RClass();
