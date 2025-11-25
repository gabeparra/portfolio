/* global process */
export default async function handler(req, res) {
  // This runs on Vercel's server - GITHUB_TOKEN is never exposed to the browser
  const token = process.env.GITHUB_TOKEN || ''

  if (!token) {
    // Fallback to public API if no token
    try {
      const response = await fetch('https://api.github.com/users/gabeparra/repos?sort=updated&per_page=12')
      
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      return res.status(200).json(data)
    } catch (error) {
      console.error('Error fetching repos:', error)
      return res.status(500).json({ error: error.message || 'Failed to fetch repositories' })
    }
  }

  // Use authenticated endpoint if token is available
  try {
    const response = await fetch(
      'https://api.github.com/user/repos?sort=updated&per_page=12&affiliation=owner',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching repos:', error)
    return res.status(500).json({ error: error.message || 'Failed to fetch repositories' })
  }
}

