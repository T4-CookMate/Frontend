// src/components/search/SearchBar.tsx
import styled from 'styled-components'
import searchIcon from '../../assets/search-icon.png'
import voiceIcon from '../../assets/voice-icon.png'

const SearchForm = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
`

const SearchBarWrap = styled.div`
  width: 349px;
  height: 60px;
  border-radius: 28px;
  background: #f3c11b;

  display: flex;
  align-items: center;
  padding: 0 18px;
  gap: 10px;
`

const Icon = styled.img`
  width: 24px;
  height: 24px;
`

const VoiceButton = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  color: #181818;

  &&::placeholder {
    color: #000000;
    opacity: 1;
  }

  &&::-webkit-input-placeholder {
    color: #000000;
  }
`

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onVoiceClick?: () => void
  onFocusInput?: () => void
}

export function SearchBar({ value, onChange, onSubmit, onVoiceClick, onFocusInput }: Props) {
    return (
        <SearchForm
            onSubmit={e => {
                e.preventDefault()
                onSubmit()
            }}
            aria-label="레시피 검색"
        >
            <SearchBarWrap>
                <Icon src={searchIcon} alt="검색" />
                <SearchInput
                    placeholder="요리명 또는 키워드를 입력하세요"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onFocus={onFocusInput}
                />
                <VoiceButton type="button" onClick={onVoiceClick}>
                    <Icon src={voiceIcon} alt="음성 검색" />
                </VoiceButton>
            </SearchBarWrap>
        </SearchForm>
    )
}
