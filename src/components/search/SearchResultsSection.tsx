// src/components/search/SearchResultsSection.tsx
import styled from 'styled-components'
import { Button } from '@components/SelectButton'
import { RecipeCard } from '@components/RecipeCard'
import type { Recipe } from 'data/recipes'

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
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
      <TopRow>
        <span>
          검색어: <strong>{confirmed}</strong> · {totalCount}건
        </span>
        <Button size="sm" onClick={onReset}>
          초기화
        </Button>
      </TopRow>

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
