// src/components/layout/AppLayout.tsx
import styled from 'styled-components'
import type { PropsWithChildren } from 'react'

const Layout = styled.div`
    width: 375px;
    margin: 0 auto;               /* 화면 가운데 정렬 */
    min-height: 100vh;

    padding-top: max(30px, env(safe-area-inset-top));
    padding-left: 20px;
    padding-right: 20px;
    
    background: ${({ theme }) => theme.color.bg};
    color: ${({ theme }) => theme.color.text};
    display: flex;
    flex-direction: column;
    align-items: center;
`

export function AppLayout({ children }: PropsWithChildren) {
    return <Layout>{children}</Layout>
}
