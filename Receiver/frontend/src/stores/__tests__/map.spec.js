import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useMapStore } from '../map'

describe('map store live drone updates', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds newly observed drones to the active list', () => {
    const store = useMapStore()

    store.updateDroneLocation('drone-1', [7.44744, 46.94809])

    expect(store.activeDrones).toHaveLength(1)
    expect(store.activeDrones[0].sender_id).toBe('drone-1')
    expect(store.getVisualizationStrategy().getDroneFeatures().features).toHaveLength(1)
  })

  it('does not duplicate active drones on repeated location updates', () => {
    const store = useMapStore()

    store.updateDroneLocation('drone-1', [7.44744, 46.94809])
    store.updateDroneLocation('drone-1', [7.44745, 46.9481])

    expect(store.activeDrones).toHaveLength(1)
    expect(store.getFocusedDroneLocation()).toBeNull()
  })
})
