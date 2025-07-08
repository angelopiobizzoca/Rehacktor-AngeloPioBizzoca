import { useState } from "react";
import { useNavigate } from "react-router";

export default function Searchbar() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [ariaInvalid, setAriaInvalid] = useState(null);

    const handleSearch = (event) => {
        event.preventDefault();
        if (typeof search === 'string' && search.trim().length !== 0) {
            navigate(`/search?query=${search}`);
            setSearch("");
        } else {
            setAriaInvalid(true);
        }
    };

    return (
        <div className="searchbar-wrapper-cyber">
            <form onSubmit={handleSearch} className="searchbar-cyber">
                <fieldset role="group" className="searchbar-group">
                    <input
                        type="text"
                        name="search"
                        className={`searchbar-input ${ariaInvalid ? "searchbar-error" : ""}`}
                        placeholder={ariaInvalid ? "Devi cercare qualcosa" : "Scrivi qui per cercare un gioco"}
                        onChange={(event) => setSearch(event.target.value)}
                        value={search}
                        aria-invalid={ariaInvalid}
                    />
                    <input
                        type="submit"
                        value="Cerca"
                        className="searchbar-submit"
                    />
                </fieldset>
            </form>
        </div>
    );
}
