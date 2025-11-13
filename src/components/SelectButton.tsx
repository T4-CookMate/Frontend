// src/components/ui/Button.tsx
import styled, { css } from 'styled-components'

type ButtonVariant = 'primary' | 'secondary' | 'gray'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

export const Button = styled.button<ButtonProps>`
  border: none;
  cursor: pointer;
  font-weight: 600;
  letter-spacing: 0.2px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  user-select: none;

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}

  ${({ size }) => {
    switch (size) {
      case 'sm':
        return css`
          height: 40px;
          font-size: 14px;
          padding: 0 14px;
        `
      case 'lg':
        return css`
            width: 349px;
            height: 64px;
            font-size: 18px;
            padding: 0 24px;
        `
      default:
        return css`
          height: 56px;
          font-size: 16px;
          padding: 0 20px;
        `
    }
  }}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return css`
          background: ${theme.color?.primary ?? '#FFD000'};
          color: #000;
        `
      case 'secondary':
        return css`
          background: transparent;
          color: ${theme.color?.primary ?? '#FFD000'};
          border: 2px solid ${theme.color?.primary ?? '#FFD000'};
        `
      default:
        return css`
          background: #ddd;
          color: #111;
        `
    }
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 3px solid ${({ theme }) => theme.color?.primary ?? '#FFD000'};
    outline-offset: 3px;
  }
`
