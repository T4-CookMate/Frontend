// src/pages/SearchPage.tsx
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { RECIPES, type Recipe } from 'data/recipes'
import { SearchBar } from '@components/search/SearchBar'
import { KeywordSuggest } from '@components/search/KeywordSuggest'
import { SearchResultsSection } from '@components/search/SearchResultsSection'
import { RecipeDetailModal } from '@components/search/RecipeDetailModal'

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

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [confirmed, setConfirmed] = useState('')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<Recipe | null>(null)

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

  const submit = () => {
    if (!q.trim()) return
    setConfirmed(q.trim())
    setPage(1)
  }

  const reset = () => {
    setQ('')
    setConfirmed('')
    setPage(1)
  }

  const handleSelectKeyword = (k: string) => {
    setQ(k)
    setConfirmed(k)
    setPage(1)
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
        <SearchArea>
          <SearchBar
            value={q}
            onChange={setQ}
            onSubmit={submit}
            onVoiceClick={handleVoiceClick}
          />
          <KeywordSuggest
            query={q}
            keywords={keywords}
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
