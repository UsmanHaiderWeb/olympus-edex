import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
const App = lazy(() => import('./App.tsx'));
const TokenListing = lazy(() => import('./pages/TokenListing.tsx'));


const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        // children: [
        // ]
    },
    {
        path: '/token-listing',
        element: <TokenListing />,
    },
])

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <main>
                <Suspense fallback={<div></div>}>
                    <RouterProvider router={router} />
                </Suspense>
            </main>
        </QueryClientProvider>
    </StrictMode>,
)
