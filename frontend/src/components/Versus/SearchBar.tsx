import React from 'react'
import { useState } from 'react'
import "../../styles/SearchBar.css"

function SearchBar(props:any) {
    const [, setInputValue] = useState('')
    
    return (
        <div>
            <input type="text" className="searchbar" placeholder="Enter friend's code..." onChange={(e) => setInputValue(e.target.value)} />
        </div>
    )	
}

export default SearchBar