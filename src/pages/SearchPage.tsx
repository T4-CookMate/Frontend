// src/pages/SearchPage.tsx
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { RECIPES, type Recipe } from 'data/recipes'
import { SearchBar } from '@components/search/SearchBar'
import { KeywordSuggest } from '@components/search/KeywordSuggest'
import { SearchResultsSection } from '@components/search/SearchResultsSection'
import { RecipeDetailModal } from '@components/search/RecipeDetailModal'
import { BackButton } from '@components/search/BackButton'
import { useNavigate } from 'react-router-dom'

const BackArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`

const Wrap = styled.main`
  flex: 1;
  padding: 24px 0px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

// 검색바 + 제안만 가운데 정렬
const SearchArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Title = styled.div`
  color: #FFF;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 36px */
  letter-spacing: -0.48px;
`

export default function SearchPage() {
  const navigate = useNavigate()

  const [q, setQ] = useState('')
  const [confirmed, setConfirmed] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Recipe | null>(null)

  const [showSuggest, setShowSuggest] = useState(false)

  // 자동완성 키워드
  const keywords = useMemo(() => {
    if (!q.trim()) return []
    const pool = new Set<string>()
    RECIPES.forEach(r => {
      if (r.name.includes(q)) pool.add(r.name)
      r.tags.forEach(t => t.includes(q) && pool.add(t))
    })
    return Array.from(pool).slice(0, 6)
  }, [q])

  // 검색 결과
  const results = useMemo(() => {
    const term = confirmed.trim()
    if (!term) return []
    return RECIPES.filter(
      r => r.name.includes(term) || r.tags.some(t => t.includes(term)),
    )
  }, [confirmed])

  const paged = results.slice(0, page * 4)
  const hasMore = results.length > paged.length

  // 입력할 때 자동완성 열기
  const handleChangeQ = (value: string) => {
    setQ(value)
    setShowSuggest(true)
  }

  const submit = () => {
    if (!q.trim()) return
    setConfirmed(q.trim())
    setPage(1)
    setShowSuggest(false) 
  }

  const reset = () => {
    setQ('')
    setConfirmed('')
    setPage(1)
    setShowSuggest(false)
  }

  const handleSelectKeyword = (k: string) => {
    setQ(k)
    setConfirmed(k)
    setPage(1)
    setShowSuggest(false)
  }

  const handleVoiceClick = () => {
    // TODO: 여기서 STT 시작 로직 연결
    console.log('voice search click')
  }

  const openModal = (r: Recipe) => setSelected(r)
  const closeModal = () => setSelected(null)

  const related = useMemo(() => {
    if (!selected) return []
    return RECIPES.filter(
      r =>
        r.id !== selected.id &&
        r.tags.some(t => selected.tags.includes(t)),
    )
  }, [selected])

  return (
    <Wrap>
      <BackArea>
        <BackButton onClick={() => navigate('/')} />
      </BackArea>

      <Title>레시피 검색</Title>
        <SearchArea>
          <SearchBar
            value={q}
            onChange={handleChangeQ}
            onSubmit={submit}
            onVoiceClick={handleVoiceClick}
            onFocusInput={() => setShowSuggest(true)} 
          />
          <KeywordSuggest
            query={q}
            keywords={keywords}
            visible={showSuggest}   
            onSelect={handleSelectKeyword}
          />
        </SearchArea>

        <SearchResultsSection
          confirmed={confirmed}
          totalCount={results.length}
          pagedRecipes={paged}
          hasMore={hasMore}
          onMore={() => setPage(p => p + 1)}
          onReset={reset}
          onSelectRecipe={openModal}
        />

        <RecipeDetailModal
          recipe={selected}
          related={related}
          onClose={closeModal}
        />
    </Wrap>  
  )
}
