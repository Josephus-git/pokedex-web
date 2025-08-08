import { pokemonTypeColors, type PokemonTypeColor } from "../utils"

type typeCardProps = {
    type: string
}

export default function TypeCard(props: typeCardProps) {
    const { type } = props

    const typeStyle = (pokemonTypeColors as PokemonTypeColor)[type]

    // This check prevents a crash if the type doesn't exist in the color map.
    if (!typeStyle) {
        return null 
    }

    return (
        <div className="type-tile" style={{ color: typeStyle.color, background: typeStyle.background }}>
            <p>{type}</p>
        </div>
    )
}