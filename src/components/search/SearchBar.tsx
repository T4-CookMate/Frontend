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

  // ✅ 추가: SearchPage에서 내려주는 접근성 텍스트
  inputAriaLabel?: string
  inputAriaDescribedBy?: string
}

export function SearchBar({
  value,
  onChange,
  onSubmit,
  onVoiceClick,
  onFocusInput,
  inputAriaLabel = '레시피 검색 입력창',
  inputAriaDescribedBy,
}: Props) {
  return (
    <SearchForm
      onSubmit={e => {
        e.preventDefault()
        onSubmit()
      }}
      aria-label="레시피 검색"
    >
      <SearchBarWrap>
        {/* 아이콘은 화면용이니까 스크린리더에선 숨기는 게 깔끔 */}
        <Icon src={searchIcon} alt="" aria-hidden="true" />

        <SearchInput
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={onFocusInput}
          aria-label={inputAriaLabel}
          aria-describedby={inputAriaDescribedBy}
        />

        <VoiceButton type="button" onClick={onVoiceClick} aria-label="음성으로 검색">
          <Icon src={voiceIcon} alt="" aria-hidden="true" />
        </VoiceButton>
      </SearchBarWrap>
    </SearchForm>
  )
}
