import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

const getContext = (): {
  queryClient: QueryClient
} => {
  return {
    queryClient,
  }
}

const Provider = ({
  children,
}: {
  children: React.ReactNode
}): React.JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export { getContext, Provider, queryClient }
