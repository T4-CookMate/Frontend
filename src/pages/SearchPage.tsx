// src/pages/SearchPage.tsx
import { useEffect, useMemo, useRef, useState } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import { RECIPES, type Recipe } from 'data/recipes'
import { SearchBar } from '@components/search/SearchBar'
import { KeywordSuggest } from '@components/search/KeywordSuggest'
import { SearchResultsSection } from '@components/search/SearchResultsSection'
// import { RecipeDetailModal } from '@components/search/RecipeDetailModal'
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

const Title = styled.h1`
  margin: 0;
  color: #fff;
  text-align: center;
  font-family: 'KoddiUD OnGothic';
  font-size: 24px;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: -0.48px;
`

const SrOnly = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
`;

export default function SearchPage() {
  const navigate = useNavigate()
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const t = window.setTimeout(() => {
      titleRef.current?.focus()
    }, 0)
    return () => window.clearTimeout(t)
  }, [])

  const [q, setQ] = useState('')
  const [confirmed, setConfirmed] = useState('')

  // 🔥 서버에서 받은 검색 결과
  const [results, setResults] = useState<Recipe[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0) // 백엔드 page는 0부터 시작
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  // const [selected, setSelected] = useState<Recipe | null>(null)
  const [showSuggest, setShowSuggest] = useState(false)

  // 자동완성 키워드 -> 로컬 더미 데이터 계속 사용
  const keywords = useMemo(() => {
    if (!q.trim()) return []
    const pool = new Set<string>()
    RECIPES.forEach(r => {
      if (r.name.includes(q)) pool.add(r.name)
      r.tags.forEach(t => t.includes(q) && pool.add(t))
    })
    return Array.from(pool).slice(0, 6)
  }, [q])

  // 백엔드에서 레시피 검색
  const fetchRecipes = async (
    pageToLoad: number,
    keyword: string,
    append: boolean,
  ) => {
    const trimmed = keyword.trim()
    if (!trimmed) return

    const token = localStorage.getItem('accessToken')
    if (!token) {
      alert('로그인이 필요합니다. 먼저 구글 로그인을 해주세요.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.get(
        'https://43.200.235.175.nip.io/recipes/search',
        {
          params: {
            keyword: trimmed,
            page: pageToLoad,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (!res.data.isSuccess) {
        console.error('레시피 검색 실패:', res.data)
        alert(res.data.message ?? '레시피 검색에 실패했습니다.')
        return
      }

      const result = res.data.result
      const recipesFromServer = result.recipe ?? []

      // 백엔드 응답 -> 프론트 Recipe 타입으로 매핑
      const mapped: Recipe[] = recipesFromServer.map((r: any) => ({
        id: r.recipeId,
        name: r.name,
        time: r.totalMinutes,
        level: r.level,
        tags: r.tags,
        // isPrefer 같은 값이 필요하면 Recipe 타입에 필드 추가해서 같이 저장 가능
      }))

      setResults(prev => (append ? [...prev, ...mapped] : mapped))
      setTotalCount(prev =>
        append ? prev + mapped.length : mapped.length,
      )
      setPage(pageToLoad)
      setHasMore(!result.isLast) // isLast = true면 더보기 없음
    } catch (err: any) {
      console.error('레시피 검색 중 오류 발생:', err)
      const msg =
        err.response?.data?.message ??
        '레시피 검색 중 오류가 발생했습니다.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  // 입력할 때 자동완성 열기
  const handleChangeQ = (value: string) => {
    setQ(value)
    setShowSuggest(true)
  }

  const submit = () => {
    if (!q.trim()) return
    const term = q.trim()
    setConfirmed(term)
    setShowSuggest(false)
    // 🔥 1페이지(0번 페이지) 새로 로드
    fetchRecipes(0, term, false)
  }

  const reset = () => {
    setQ('')
    setConfirmed('')
    setResults([])
    setTotalCount(0)
    setPage(0)
    setHasMore(false)
    setShowSuggest(false)
  }

  const handleSelectKeyword = (k: string) => {
    setQ(k)
    setConfirmed(k)
    setShowSuggest(false)
    fetchRecipes(0, k, false)
  }

  const handleVoiceClick = () => {
    console.log('voice search click')
  }

  // const openModal = (r: Recipe) => setSelected(r)
  // const closeModal = () => setSelected(null)

  // const related = useMemo(() => {
  //   if (!selected) return []
  //   return RECIPES.filter(
  //     r =>
  //       r.id !== selected.id &&
  //       r.tags.some(t => selected.tags.includes(t)),
  //   )
  // }, [selected])

  const handleSelectRecipe = (recipe: Recipe) => {
    navigate(`/recipes/${recipe.id}`, {
      state: {
        name: recipe.name,
        time: recipe.time,
        level: recipe.level,
      },
    })
  }

  const liveMsg =
    loading
      ? '검색 중입니다.'
      : confirmed
        ? `${confirmed} 검색 결과 ${totalCount}개입니다.`
        : '검색어를 입력해 레시피를 검색하세요.'


  return (
    <Wrap aria-labelledby="search-title">
      <SrOnly aria-live="polite">{liveMsg}</SrOnly>
      <BackArea>
        <BackButton onClick={() => navigate('/home')} />
      </BackArea>

      <Title id="search-title" ref={titleRef} tabIndex={-1}>레시피 검색</Title>

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

      {/* 검색 결과 섹션 */}
      {/* <SearchResultsSection
        confirmed={confirmed}
        totalCount={totalCount}
        pagedRecipes={results} // 서버에서 받은 전체 리스트
        hasMore={hasMore}
        onMore={() => fetchRecipes(page + 1, confirmed, true)}
        onReset={reset}
        onSelectRecipe={openModal}
      /> */}

      <SearchResultsSection
        confirmed={confirmed}
        totalCount={totalCount}
        pagedRecipes={results}
        hasMore={hasMore}
        onMore={() => fetchRecipes(page + 1, confirmed, true)}
        onReset={reset}
        onSelectRecipe={handleSelectRecipe}
      />

      {/* <RecipeDetailModal
        recipe={selected}
        related={related}
        onClose={closeModal}
        onStartCooking={recipe => {
          // 이 부분은 기존에 만들었던 handleStartCooking 로직 그대로 넣으면 됨
          navigate('/cook', {
            state: {
              recipeId: recipe.id,
              recipeName: recipe.name,
            },
          })
        }}
      /> */}

      {loading && (
        <p style={{ color: '#fff', textAlign: 'center', marginTop: 8 }}>
          검색 중...
        </p>
      )}
    </Wrap>
  )
}
