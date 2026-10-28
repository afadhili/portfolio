import { stack } from '../content/data'
import { ToolLogo } from './ToolLogo'

export function Marquee() {
  return (
    <div className="marquee" aria-label={`Technologies: ${stack.join(', ')}`}>
      <div className="marquee__track" aria-hidden="true">
        {[0, 1].map((copy) => (
          <div className="marquee__set" key={copy}>
            {stack.map((name) => (
              <span className="marquee__item" key={name}>
                <ToolLogo name={name} />
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
