// src/components/ui/Modal.tsx
import styled from 'styled-components'
import type { PropsWithChildren } from 'react'

const Backdrop = styled.div`
  position: fixed; 
  inset: 0; 
  background: rgba(0,0,0,0.5);
  display: grid; 
  place-items: center;
`
const Panel = styled.div`
  
`

export function Modal({ children, onClose }: PropsWithChildren<{ onClose: () => void }>) {
  return (
    <Backdrop onClick={onClose} role="dialog" aria-modal="true">
      <Panel onClick={(e)=>e.stopPropagation()}>{children}</Panel>
    </Backdrop>
  )
}
