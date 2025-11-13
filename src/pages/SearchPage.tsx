// src/pages/SearchPage.tsx
import styled from 'styled-components'
import { useMemo, useState } from 'react'
import { Button } from '@components/SelectButton'
import { RecipeCard } from '@components/RecipeCard'
import { Modal } from '@components/Modal'
import { TextInput } from '@components/TextInput'
import { RECIPES, type Recipe} from 'data/recipes'

const Wrap = styled.main`flex:1; padding: 24px 20px; display:flex; flex-direction:column; gap:16px;`
const SuggestBox = styled.ul`
  list-style:none; margin:0; padding:8px; border-radius:12px; border:1px solid #222; background:#0f0f0f;
  li { padding:8px 6px; cursor:pointer; border-radius:8px; }
  li:hover { background:#171717; }
`
const Grid = styled.div`
  display:grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
`

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [confirmed, setConfirmed] = useState('')      // Enter나 클릭으로 확정된 검색어
  const [page, setPage] = useState(1)                // 1페이지 = 4개
  const [selected, setSelected] = useState<Recipe | null>(null)

  const keywords = useMemo(() => {
    if (!q.trim()) return []
    const pool = new Set<string>()
    RECIPES.forEach(r=>{
      if (r.name.includes(q)) pool.add(r.name)
      r.tags.forEach(t => t.includes(q) && pool.add(t))
    })
    return Array.from(pool).slice(0, 6)
  }, [q])

  const results = useMemo(() => {
    const term = confirmed.trim()
    if (!term) return []
    return RECIPES.filter(r =>
      r.name.includes(term) || r.tags.some(t => t.includes(term))
    )
  }, [confirmed])

  const paged = results.slice(0, page * 4)        // 4개씩
  const hasMore = results.length > paged.length

  const submit = () => {
    if (!q.trim()) return
    setConfirmed(q.trim())
    setPage(1)
  }

  const openModal = (r: Recipe) => setSelected(r)
  const closeModal = () => setSelected(null)

  return (
    <Wrap>
      {/* 검색창 */}
      <form
        onSubmit={(e)=>{e.preventDefault(); submit()}}
        aria-label="레시피 검색"
      >
        <TextInput
          placeholder="요리명 또는 키워드를 입력하세요"
          value={q}
          onChange={(e)=> setQ(e.target.value)}
        />
      </form>

      {/* 키워드 제안 */}
      {q && keywords.length > 0 && (
        <SuggestBox role="listbox" aria-label="키워드 제안">
          {keywords.map(k => (
            <li key={k} onClick={()=>{ setQ(k); setConfirmed(k); setPage(1) }}>{k}</li>
          ))}
        </SuggestBox>
      )}

      {/* 결과 그리드 (확정된 검색어가 있을 때만) */}
      {confirmed && (
        <>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 4 }}>
            <span>검색어: <strong>{confirmed}</strong> · {results.length}건</span>
            <Button size="sm" onClick={()=>{ setQ(''); setConfirmed(''); setPage(1) }}>초기화</Button>
          </div>

          <Grid style={{ marginTop: 8 }}>
            {paged.map(r => (
              <RecipeCard key={r.id} onClick={()=>openModal(r)}>
                {r.name}
              </RecipeCard>
            ))}
          </Grid>

          {hasMore && (
            <div style={{ marginTop: 12 }}>
              <Button size="md" fullWidth onClick={()=> setPage(p=>p+1)}>더보기</Button>
            </div>
          )}
        </>
      )}

      {/* 레시피 모달 */}
      {selected && (
        <Modal onClose={closeModal}>
          <h3 style={{ marginTop: 0 }}>{selected.name}</h3>
          <p style={{ opacity: .8, marginTop: 4 }}>
            관련 태그: {selected.tags.join(', ')}
          </p>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop: 8 }}>
            {RECIPES.filter(r => r.id !== selected.id && r.tags.some(t => selected.tags.includes(t)))
                    .slice(0, 4)
                    .map(r => (
              <div key={r.id} style={{
                padding:'6px 10px', border:'1px solid #333', borderRadius:12, background:'#0f0f0f'
              }}>{r.name}</div>
            ))}
          </div>
          <div style={{ marginTop: 16, display:'flex', justifyContent:'flex-end' }}>
            <Button onClick={closeModal}>닫기</Button>
          </div>
        </Modal>
      )}
    </Wrap>
  )
}
