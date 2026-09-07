import { describe, it, expect, afterEach } from 'vitest'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import { getDrone, getActiveDrones, postSettings } from '../api'

const mock = new AxiosMockAdapter(axios)

const drone_response = {
  sender_id: 'drone-1',
  serial_number: 'drone-1-serial',
  position: { lat: 46.94809, lng: 7.44744 },
  pilot_position: { lat: 46.9, lng: 7.4 },
  home_position: { lat: 46.8, lng: 7.3 },
}

afterEach(() => mock.reset())

describe('getDrone', () => {
  it('maps the lat/lng payload onto [lng, lat] tuples', async () => {
    mock.onGet('/api/drones/drone-1').reply(200, drone_response)

    const drone = await getDrone('drone-1')

    expect(drone.position).toEqual([7.44744, 46.94809])
    expect(drone.pilot_position).toEqual([7.4, 46.9])
    expect(drone.home_position).toEqual([7.3, 46.8])
  })

  it('keeps the payload fields and defaults the display flags', async () => {
    mock.onGet('/api/drones/drone-1').reply(200, drone_response)

    const drone = await getDrone('drone-1')

    expect(drone.serial_number).toBe('drone-1-serial')
    expect(drone.show_path).toBe(false)
    expect(drone.show_pilot).toBe(false)
    expect(drone.show_home).toBe(false)
    expect(drone.flights).toBeUndefined()
  })

  it('encodes the sender id into the request path', async () => {
    mock.onGet('/api/drones/drone 1').reply(200, drone_response)

    await getDrone('drone 1')

    expect(mock.history.get[0].url).toBe('/api/drones/drone 1')
  })
})

describe('getActiveDrones', () => {
  it('returns the response body unwrapped', async () => {
    mock.onGet('/api/drones/active').reply(200, [{ sender_id: 'drone-1' }])

    await expect(getActiveDrones()).resolves.toEqual([{ sender_id: 'drone-1' }])
  })
})

describe('postSettings', () => {
  it('returns the updated settings on success', async () => {
    mock.onPost('/api/settings').reply(200, { drone_size_in_rem: 3 })

    await expect(postSettings({ drone_size_in_rem: 3 })).resolves.toEqual({
      drone_size_in_rem: 3,
    })
  })

  it('throws when the backend rejects the update', async () => {
    mock.onPost('/api/settings').reply(500)

    await expect(postSettings({})).rejects.toThrow()
  })
})
