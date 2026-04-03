const [{ render }, { default: App }] = await Promise.all([
  import('./test/test-utils'),
  import('./App'),
])

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(document.body).toBeInTheDocument()
  })
})
