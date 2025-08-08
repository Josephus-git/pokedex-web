import {  useState } from "react"
import { first151Pokemon, getFullPokedexNumber } from "../utils"

type SideNavProps = {
    selectedPokemon: number;
    setSelectedPokemon: any
    handleToggleMenu: () => void;
    showSideMenu: boolean;
}

export default function SideNav(props: SideNavProps) {
    const { selectedPokemon, setSelectedPokemon, handleToggleMenu, showSideMenu } = props

    const [searchValue, setSearchValue] = useState('')

    const filteredPokemon = first151Pokemon.filter((element, elementIndex) => {
        // if full pokedex number includes the current search value, return true
        if (getFullPokedexNumber(elementIndex).includes(searchValue)) {
            return true
        }

        // if full pokedex name includes the current search value, return true
        if (element.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())) { return true }

        // otherwise, exclude value from the array
        return false
    })

    return (
        <nav className={showSideMenu ? "open" : ''}>
            <div className={`header ${showSideMenu ? "open" : ''}`.trim()}>
                <button onClick={handleToggleMenu} className="open-nav-button">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokedex</h1>
            </div>
            <input placeholder="E.g. 001 or Bulba..." value={searchValue} onChange={(e) => { setSearchValue(e.target.value)}} />
            {filteredPokemon.map((pokemon, pokemonIndex) => {
                const truePokedexNumber = first151Pokemon.indexOf(pokemon)
                return (
                    <button onClick={() => {
                        setSelectedPokemon(truePokedexNumber)
                    }} key={pokemonIndex} className={'nav-card ' +  (pokemonIndex === selectedPokemon ? " nav-card-selected " : " ")}>
                        <p>{getFullPokedexNumber(truePokedexNumber)}</p>
                        <p>{pokemon}</p>
                    </button>
                )
            })}
        </nav>
    )
}