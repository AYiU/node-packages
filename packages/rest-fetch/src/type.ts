interface NextFetchRequestConfig {
  revalidate?: number | false
  tags?: string[]
}

interface RequestInit {
  next?: NextFetchRequestConfig | undefined
}
