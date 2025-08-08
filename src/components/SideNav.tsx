import { first151Pokemon, getPokedexNumber } from "../utils"

type sideNavProps = {
    selectedPokemon: number
    setSelectedPokemon: any
}

export default function SideNav(props: sideNavProps) {
    return (
        <nav>
            <div className="header">
                <h1 className="text-gradient">Pokedex</h1>
            </div>
            <input />
            {first151Pokemon.map((pokemon, pokemonIndex) => {
                return (
                    <button key={pokemonIndex} className={'nav-card '}>
                        <p>{getPokedexNumber(pokemonIndex)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}