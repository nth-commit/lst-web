import { DateUtils } from './DateUtils'
import { LocalSunTimeAdjustmentsOptions, LocalSunTimeV2 } from './LocalSunTimeV2'

const sampleGeolocation = {
  latitude: -43.5330136,
  longitude: 172.6413054,
}

test('getCurrentUtcOffset', () => {
  // Arrange
  const options: LocalSunTimeAdjustmentsOptions = {
    ...sampleGeolocation,
    lstOffsetResolution: '5 minutes',
    adjustmentTimeOffset: -(4 * 60 * 60 * 1000), // 8pm the day before (~4 hours before sunrise)
    useLstPlus24: true,
  }

  // Act
  const result = LocalSunTimeV2.calculateCurrentUtcOffset({ ...options, timestamp: Date.UTC(2023, 2, 13, 0, 0, 0, 0) })

  // Assert
  expect(DateUtils.formatOffset(result)).toMatchInlineSnapshot(`"+05:40"`)
})
