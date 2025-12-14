// src/pages/FavoriteRecipesPage.tsx
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { type Recipe } from 'data/recipes'
import { SearchResultsSection } from '@components/search/SearchResultsSection'
import { BackButton } from '@components/search/BackButton'
import { useNavigate } from 'react-router-dom'

const BackArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`

const Wrap = styled.main`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const PageTitle = styled.h1`
  margin: 0;
  color: #ffffff;
  text-align: center;
  font-family: 'KoddiUD OnGothic';
  font-size: 26px;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: -0.52px;
`

const DescriptionArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`

const DescStrong = styled.p`
  margin: 0;
  color: #ffffff;
  font-family: 'KoddiUD OnGothic';
  font-size: 16px;
  font-weight: 700;
  line-height: 150%;
  letter-spacing: -0.32px;
`

const DescSub = styled.p`
  margin: 0;
  color: #ffffff;
  font-family: 'KoddiUD OnGothic';
  font-size: 14px;
  font-weight: 400;
  line-height: 150%;
  letter-spacing: -0.28px;
  opacity: 0.85;
`

export default function FavoriteRecipesPage() {
  const navigate = useNavigate()

  // 서버에서 받은 즐겨찾기 레시피
  const [results, setResults] = useState<Recipe[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  // 즐겨찾기 목록 가져오기
  const fetchFavorites = async (pageToLoad: number, append: boolean) => {
    console.log('[Favorite] fetchFavorites 호출', { pageToLoad, append })

    const token = localStorage.getItem('accessToken')
    console.log('[Favorite] 로컬스토리지 accessToken:', token)

    if (!token) {
      alert('로그인이 필요합니다. 먼저 구글 로그인을 해주세요.')
      return
    }

    try {
      setLoading(true)

      const res = await axios.get(
        'http://43.200.235.175:8080/recipes/prefer',
        {
          params: {
            page: pageToLoad,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )

      console.log('[Favorite] 서버 응답(raw):', res.data)

      if (!res.data.isSuccess) {
        console.warn(
          '[Favorite] 즐겨찾기 레시피 조회 실패 응답:',
          res.data.code,
          res.data.message,
        )
        alert(res.data.message ?? '즐겨찾기 레시피 조회에 실패했습니다.')
        return
      }

      const result = res.data.result
      console.log('[Favorite] result:', result)

      const recipesFromServer = result.recipe ?? []
      console.log(
        '[Favorite] 서버에서 받은 recipe 배열 길이:',
        recipesFromServer.length,
      )
      console.log('[Favorite] 서버 recipe 배열 내용:', recipesFromServer)

      const mapped: Recipe[] = recipesFromServer.map((r: any) => ({
        id: r.recipeId,
        name: r.name,
        time: r.totalMinutes,
        level: r.level,
        tags: r.tags,
        // data/recipes.ts에서 isPrefer?: boolean 으로 추가해 둔 상태라면 사용 가능
        isPrefer: r.isPrefer,
      }))

      console.log('[Favorite] 매핑된 Recipe 배열:', mapped)

      setResults(prev => {
        const next = append ? [...prev, ...mapped] : mapped
        console.log('[Favorite] setResults 이전/다음 길이:', prev.length, '→', next.length)
        console.log('[Favorite] setResults 이후 데이터:', next)
        return next
      })

      setTotalCount(prev => {
        const next = append ? prev + mapped.length : mapped.length
        console.log('[Favorite] totalCount 이전/다음:', prev, '→', next)
        return next
      })

      setPage(pageToLoad)
      console.log('[Favorite] page 상태 변경:', pageToLoad)

      setHasMore(!result.isLast)
      console.log('[Favorite] isLast:', result.isLast, '→ hasMore:', !result.isLast)
    } catch (err: any) {
      console.error('즐겨찾기 레시피 조회 중 오류:', err)
      const msg =
        err?.response?.data?.message ??
        '즐겨찾기 레시피 조회 중 오류가 발생했습니다.'
      alert(msg)
    } finally {
      setLoading(false)
    }
  }

  // 첫 진입 시 0페이지 로드
  useEffect(() => {
    console.log('[Favorite] 컴포넌트 mount, 0페이지 요청')
    fetchFavorites(0, false)
  }, [])

  const reset = () => {
    console.log('[Favorite] reset 호출')
    setResults([])
    setTotalCount(0)
    setPage(0)
    setHasMore(false)
    fetchFavorites(0, false)
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    console.log('[Favorite] 레시피 카드 클릭:', recipe)
    navigate(`/recipes/${recipe.id}`, {
      state: {
        name: recipe.name,
        time: recipe.time,
        level: recipe.level,
      },
    })
  }

  console.log('[Favorite] 렌더링 상태', {
    resultsLength: results.length,
    totalCount,
    page,
    hasMore,
    loading,
  })

  return (
    <Wrap>
      <BackArea>
        {/* 홈으로 가는 뒤로 버튼 */}
        <BackButton onClick={() => navigate('/home')} />
      </BackArea>

      <PageTitle>즐겨찾기 레시피</PageTitle>

      {/* 즐겨찾기 카드 목록 */}
      <SearchResultsSection
        confirmed="즐겨찾기" // 검색어 없음
        totalCount={totalCount}
        pagedRecipes={results}
        hasMore={hasMore}
        onMore={() => fetchFavorites(page + 1, true)}
        onReset={reset}
        onSelectRecipe={handleSelectRecipe}
      />

      {loading && (
        <p style={{ color: '#fff', textAlign: 'center', marginTop: 8 }}>
          불러오는 중...
        </p>
      )}
    </Wrap>
  )
}
