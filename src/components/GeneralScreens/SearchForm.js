import React, { useState } from 'react'
import {BiSearchAlt2} from 'react-icons/bi'
import {  useNavigate } from "react-router-dom";
const SearchForm = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate =useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault() ; 
        if(searchTerm){
            navigate(`/?search=${searchTerm}`)
        }

        setSearchTerm("")
    }

  
    return (
     <div>
        



<form className="d-flex" onSubmit={handleSubmit}>
<input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}/>
<button className={searchTerm.trim() ? 'searchBtn' : 'disBtn'} type="submit">Chercher</button>
</form>

</div>
    )
}

export default SearchForm