import { create, from } from '@reactivex/ix-es5-cjs/iterable'
import { DistinctOptions } from 'ix/iterable/operators/distinctoptions'
import { OperatorFunction } from '@reactivex/ix-es5-cjs/interfaces'
import { MonoTypeOperatorFunction } from '@reactivex/ix-es5-cjs/interfaces'
import { map, scan, takeWhile } from '@reactivex/ix-es5-cjs/iterable/operators'

export function groupUntilChanged<TSource, TKey = TSource>(
  options?: DistinctOptions<TSource, TKey>
): OperatorFunction<TSource, TSource[]> {
  const { keySelector }: Required<DistinctOptions<TSource, TKey>> = {
    keySelector: (x: TSource): TKey => x as unknown as TKey,
    comparer: null!,
    ...options,
  }

  return (source) => {
    return create(function* (): Generator<TSource[]> {
      let currentGroup: TSource[] = []

      const NO_PREVIOUS_KEY = Symbol('NO_PREVIOUS_KEY')

      let previousKey: TKey | typeof NO_PREVIOUS_KEY = NO_PREVIOUS_KEY

      for (const item of source) {
        const key = keySelector(item)

        if (previousKey === NO_PREVIOUS_KEY || key === previousKey) {
          currentGroup.push(item)
        } else {
          yield currentGroup
          currentGroup = [item]
        }
        previousKey = key
      }

      if (currentGroup.length > 0) {
        yield currentGroup
      }
    })
  }
}

export function takeUntilFirstRepeated<TSource, TKey = TSource>(
  options?: DistinctOptions<TSource, TKey>
): MonoTypeOperatorFunction<TSource> {
  const { keySelector }: Required<DistinctOptions<TSource, TKey>> = {
    keySelector: (x: TSource): TKey => x as unknown as TKey,
    comparer: null!,
    ...options,
  }

  return (source) =>
    from(source).pipe(
      scan(
        (acc, curr, ix) => ({
          isFirst: ix === 0,
          first: acc.first ?? curr,
          curr: curr,
        }),
        { isFirst: false, first: null! as TSource, curr: null! as TSource }
      ),
      takeWhile((x) => x.isFirst || keySelector(x.first) !== keySelector(x.curr)),
      map((x) => x.curr)
    )
}
