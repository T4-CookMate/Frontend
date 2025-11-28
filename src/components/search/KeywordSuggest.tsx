// src/components/search/KeywordSuggest.tsx
import styled from 'styled-components'

const SuggestBox = styled.ul`
  list-style: none;
  margin: 8px 0 0;
  padding: 8px 10px;
  border-radius: 20px;
  border: 1px solid #222;
  color: #000;
  background: #F3C11B;

  width: 100%;
  max-width: 349px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  li {
    padding: 8px 6px;
    cursor: pointer;
    border-radius: 12px;
    font-size: 14px;
  }
`

type Props = {
  query: string
  keywords: string[]
  visible: boolean 
  onSelect: (keyword: string) => void
}

export function KeywordSuggest({ query, keywords, onSelect, visible }: Props) {
  // 검색 확정되면 숨기기
  if (!visible) return null

  if (!query || keywords.length === 0) return null

  return (
    <SuggestBox role="listbox" aria-label="키워드 제안">
      {keywords.map(k => (
        <li key={k} onClick={() => onSelect(k)}>
          {k}
        </li>
      ))}
    </SuggestBox>
  )
}
