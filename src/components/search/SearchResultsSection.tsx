// src/components/search/SearchResultsSection.tsx
import styled from 'styled-components'
import { Button } from '@components/SelectButton'
import { RecipeCard } from '@components/RecipeCard'
import type { Recipe } from 'data/recipes'

const SummaryWrap = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const MainText = styled.p`
  margin: 0;
  color: #fff;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 18px;
  font-style: normal;
  font-weight: 700;
  line-height: 150%; /* 27px */
  letter-spacing: -0.36px;
`

const SubText = styled.p`
  margin: 0;
  color: #fff;
  text-align: center;
  font-family: "KoddiUD OnGothic";
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 24px */
  letter-spacing: -0.32px;
`

const ResetRow = styled.div`
  margin-top: 8px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 8px;
`

const MoreWrap = styled.div`
  margin-top: 12px;
`

type Props = {
  confirmed: string
  totalCount: number
  pagedRecipes: Recipe[]
  hasMore: boolean
  onMore: () => void
  onReset: () => void
  onSelectRecipe: (recipe: Recipe) => void
}

export function SearchResultsSection({
  confirmed,
  totalCount,
  pagedRecipes,
  hasMore,
  onMore,
  onReset,
  onSelectRecipe,
}: Props) {
  if (!confirmed) return null

  return (
    <>
      <SummaryWrap>
        <MainText>현재 {totalCount}개의 검색 결과가 있어요!</MainText>
        <SubText>쿡짝꿍이 4개씩 보여줄게요</SubText>
      </SummaryWrap>

      <ResetRow>
        <Button size="sm" onClick={onReset}>
          초기화
        </Button>
      </ResetRow>

      <Grid>
        {pagedRecipes.map(r => (
          <RecipeCard key={r.id} onClick={() => onSelectRecipe(r)}>
            {r.name}
          </RecipeCard>
        ))}
      </Grid>

      {hasMore && (
        <MoreWrap>
          <Button size="md" fullWidth onClick={onMore}>
            더보기
          </Button>
        </MoreWrap>
      )}
    </>
  )
}
