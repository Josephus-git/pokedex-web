import { useEffect, useState } from "react"
import { getFullPokedexNumber, getPokedexNumber } from "../utils"
import TypeCard from "./TypeCard"
import Modal from "./Modal"

type pokeCardProp = {
    selectedPokemon: number
}

type Skill = {
    name: string;
    description: string;
}

export default function PokeCard(props: pokeCardProp) {
    const { selectedPokemon } = props
    const [ data, setData ] = useState(null)
    const [loading, setLoading] = useState(false)
    const [skill, setSkill] = useState<Skill | null>(null)
    const [loadingSkill, setLoadingSkill] = useState(false)

    const { name, stats, types, moves, sprites} = (data as any) || {}

    const imgList = Object.keys(sprites || {}).filter(val => {
        if (!sprites[val]) { return false }
        if (['versions', 'other'].includes(val)) { return false }
        return true

    })

    async function fetchMoveData(move:any, moveUrl:string) {
        //if loading, exit logic
        if (loadingSkill || !localStorage || !moveUrl) { return }

        //check cache for move
        let c: Record<string, any> = {}
        if (localStorage.getItem('pokemon-moves')){
            c = JSON.parse(localStorage.getItem('pokemon-moves') as string)
        }

        if (move in c) {
            setSkill(c[move])
            console.log('found move in cache')
            return
        }

        try {
            setLoadingSkill(true)
            const res = await fetch(moveUrl)
            const moveData:any = await res.json()
            console.log('Fetched move from API', moveData)
            const description = moveData?.flavor_text_entries.find((val: any) => val.language.name === 'en' && val.version_group.name === 'firered-leafgreen')?.flavor_text

            const skillData: Skill = {
                name: move, description
            }
            setSkill(skillData)
            c[move] = skillData
            localStorage.setItem('pokemon-moves', JSON.stringify(c))

        } catch (error: any) {
            console.log(error)
        } finally {
            setLoadingSkill(false)
        }

    }

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) { return }

        // check if the selected pokemon information is availale in the cache
        // 1. define the cache
        let cache: Record<string, any> = {}
        if (localStorage.getItem('pokedex')) {
            cache = JSON.parse(localStorage.getItem('pokedex') as string)
        }

        // 2. check if the selected pokemon is in the cache otherwise fetch from api

        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon])
            console.log('Found pokemon in cache')
            return
        }

        // we passed all the cache stuff to no avail and now we need to fetch from api

        async function fetchPokemonData() {
            try {
                const baseUrl = 'https://pokeapi.co/api/v2/'
                const suffix = 'pokemon/' + getPokedexNumber(selectedPokemon)
                const finalUrl = baseUrl + suffix
                const res = await fetch(finalUrl)
                const pokemonData = await res.json()
                setData(pokemonData)
                console.log('fetched pokemon data')

                cache[selectedPokemon] = pokemonData
                localStorage.setItem('pokedex', JSON.stringify(cache))
            } catch (error: any) {
                console.log(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchPokemonData()

        // if we fetch from api, save information to the cache for next time

    }, [selectedPokemon])

    if (loading || !data) {
        return <div> 
            <h4>Loading...</h4>
        </div>
    }

    return(
        <div className="poke-card">
            {skill && (
                <Modal handleCloseModal={() => { setSkill(null)}}>
                <div>
                    <h6>Name</h6>
                    <h2 className='skill-name'>{skill.name.replaceAll('-', ' ')}</h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>{skill.description}</p>
                </div>
            </Modal>
            )}
            <div> 
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj: any, typeIndex:number) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    )
                })}
            </div>
            <img className='default-img' src={'/pokemon/' + getFullPokedexNumber(selectedPokemon) + '.png'} alt={`${name}-large-img`} />
            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl]
                    return (
                        <img key={spriteIndex} src={imgUrl} alt={`${name}-img-${spriteUrl}`} />
                    )
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj:any, statIndex:number)=> {
                    const { stat, base_stat } = statObj
                    return (
                        <div key={statIndex} className='stat-item'>
                            <p>{stat?.name.replaceAll('-', ' ')}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    )
                })}
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj:any, moveIndex:number) => {
                    return (
                        <button className="pokemon-move" key={moveIndex} onClick={() => { fetchMoveData(moveObj?.move?.name, moveObj?.move.url) }}>
                            <p>{moveObj?.move?.name.replaceAll('-', ' ')}</p>
                        </button>
                    )
                })}
            </div>
            
        </div>
    )
}