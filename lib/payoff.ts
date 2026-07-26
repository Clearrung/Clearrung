export type Debt = {
  id: string
  name: string
  balance: number
  rate: number // annual, e.g. 0.199
  min_payment: number
}

export type SimResult = {
  months: number
  totalInterest: number
  order: string[]
  history: number[]
}

export function simulate(
  debts: Debt[],
  strategy: 'snowball' | 'avalanche',
  extra: number
): SimResult {
  const working = debts.map((d) => ({ ...d }))
  const order =
    strategy === 'snowball'
      ? [...working].sort((a, b) => a.balance - b.balance)
      : [...working].sort((a, b) => b.rate - a.rate)

  let months = 0
  let totalInterest = 0
  const history: number[] = [order.reduce((s, d) => s + d.balance, 0)]
  const maxMonths = 600

  while (order.some((d) => d.balance > 0) && months < maxMonths) {
    months++
    let freedUp = extra

    for (const debt of order) {
      if (debt.balance <= 0) continue
      const interest = debt.balance * (debt.rate / 12)
      totalInterest += interest
      debt.balance += interest
      const pay = Math.min(debt.min_payment, debt.balance)
      debt.balance -= pay
    }

    for (const debt of order) {
      if (freedUp <= 0) break
      if (debt.balance <= 0) continue
      const pay = Math.min(freedUp, debt.balance)
      debt.balance -= pay
      freedUp -= pay
    }

    history.push(Math.max(0, order.reduce((s, d) => s + d.balance, 0)))
  }

  return {
    months,
    totalInterest,
    order: order.map((d) => d.name),
    history,
  }
}
