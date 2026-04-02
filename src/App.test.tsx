import { describe, it, expect } from 'bun:test'
import './test/setup'
import { createElement } from 'react'
import { render } from './test/test-utils'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(createElement(App))
    expect(document.body).toBeInTheDocument()
  })
})
