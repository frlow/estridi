import React from 'react'

export function PresetButton({
  id,
  presets,
  shapesToChangeTo,
}: {
  id: string
  presets: { iconUrl: string; onPresetPressed: () => void }[] | undefined
  shapesToChangeTo: { iconUrl: string; onSelected: () => void }[] | undefined
}): React.ReactElement | null {
  return (
    <div
      id={id}
      style={{
        top: '-70px',
        left: '50%',
        transform: `translate(-50%, 0) scale(min(calc(1 / var(--tl-zoom)), 2))`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'absolute',
        transformOrigin: '50% 100%',
        pointerEvents: 'all',
      }}
    >
      {shapesToChangeTo && shapesToChangeTo.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {shapesToChangeTo.map((shape) => (
            <button
              key={shape.iconUrl}
              className="shape-switch-menu-button"
              onClick={() => {
                shape.onSelected()
              }}
            >
              <img
                src={shape.iconUrl}
                style={{ padding: '5px' }}
                height="45px"
                width="45px"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
      {shapesToChangeTo &&
        shapesToChangeTo.length > 0 &&
        presets &&
        presets.length > 0 && (
          <p
            style={{
              color: 'rgba(0, 0, 0, 0.7)',
              fontSize: '30px',
              padding: '0 20px',
              margin: '0',
            }}
          >
            |
          </p>
        )}
      {presets && presets.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {presets.map((preset) => (
            <button
              key={preset.iconUrl}
              className="shape-switch-menu-button"
              onClick={() => {
                preset.onPresetPressed()
              }}
            >
              <img
                src={preset.iconUrl}
                style={{ padding: '5px' }}
                height="40px"
                width="40px"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
