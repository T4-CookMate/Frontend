// src/components/search/RecipeDetailModal.tsx
import { Modal } from '@components/Modal'
import type { Recipe } from 'data/recipes'

type Props = {
  recipe: Recipe | null
  related: Recipe[]
  onClose: () => void
}

export function RecipeDetailModal({ recipe, related, onClose }: Props) {
  if (!recipe) return null

  return (
    <Modal onClose={onClose}>
      <h3 style={{ marginTop: 0 }}>{recipe.name}</h3>
      <p style={{ opacity: 0.8, marginTop: 4 }}>
        관련 태그: {recipe.tags.join(', ')}
      </p>

      <div
        style={{
          display: 'flex',
          gap: 8,
          flexWrap: 'wrap',
          marginTop: 8,
        }}
      >
        {related.slice(0, 4).map(r => (
          <div
            key={r.id}
            style={{
              padding: '6px 10px',
              border: '1px solid #333',
              borderRadius: 12,
              background: '#0f0f0f',
            }}
          >
            {r.name}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <button onClick={onClose}>닫기</button>
      </div>
    </Modal>
  )
}
