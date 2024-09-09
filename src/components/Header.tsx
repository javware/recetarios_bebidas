import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'


export default function Header() {
    const [searchFilters, setSearchFilter] = useState({
        ingredient: '',
        category: '',
    })
    const { pathname } = useLocation()
    const isHome = useMemo(() => pathname === '/', [pathname])
    const isActiveLink = ({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-500 uppercase font-bold' : 'text-white uppercase font-bold'
    const fetchCategories = useAppStore((state) => state.fetchCategories)
    const showNotification = useAppStore((state) => state.showNotification)
    const categories = useAppStore((state) => state.categories)
    const searchRecipes = useAppStore((state) => state.searchRecipes)

    useEffect(() => {
        fetchCategories()
    }, [])

    const handleChange = (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
        setSearchFilter({
            ...searchFilters,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        //validar
        if (Object.values(searchFilters).includes('')) {
            showNotification({
                text: 'Todos los campos son obligatorios.',
                error: true
            })
            return
        }
        //Consultar resetas
        searchRecipes(searchFilters)
    }

    return (
        <header className={isHome ? 'bg-header bg-center bg-cover' : 'bg-slate-800'}>
            <div className="mx-auto container px-5 py-16">
                <div className="flex justify-between items-center">
                    <div>
                        <img className="w-32" src="/logo.svg" alt="logotipo" />
                    </div>
                    <nav className='flex gap-4'>
                        <NavLink to="/" className={isActiveLink}>Inicio</NavLink>
                        <NavLink to="/favoritos" className={isActiveLink}>Favoritos</NavLink>
                    </nav>
                </div>
                {isHome && (
                    <form className='md:w-1/2 2xl:w-1/3 bg-orange-400 my-32 p-10 rounded-lg shadow space-y-6' onSubmit={handleSubmit}>
                        <div className='space-y-4'>
                            <label
                                htmlFor="ingredient"
                                className='block text-white uppercase font-extrabold text-lg'
                            >Nombre o Ingredientes</label>
                            <input
                                type="text"
                                id='ingredient'
                                name='ingredient'
                                className='p-3 w-full rounded-lg focus:outline-none'
                                onChange={handleChange}
                                value={searchFilters.ingredient}
                                placeholder='Nombre o Ingrediente. Ej. Vodka, Tequila, Café'
                            />
                        </div>
                        <div className='space-y-4'>
                            <label
                                htmlFor="category"
                                className='block text-white uppercase font-extrabold text-lg'
                            >Categoría</label>
                            <select
                                id='category'
                                name='category'
                                className='p-3 w-full rounded-lg focus:outline-none'
                                onChange={handleChange}
                                value={searchFilters.category}
                            >
                                <option value="">-- Seleccione --</option>
                                {categories.drinks.map(category => (
                                    <option
                                        key={category.strCategory}
                                        value={category.strCategory}
                                    >{category.strCategory}</option>
                                ))}
                            </select>
                        </div>
                        <input type="submit" value='Buscar Recetas'
                            className='cursor-pointer bg-orange-800 hover:bg-orange-900 text-white font-extrabold w-full p-2 rounded-lg uppercase'
                        />
                    </form>


                )}
            </div>
        </header>
    )
}
