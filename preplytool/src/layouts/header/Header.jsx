import "./header.css";

export default function Header(){

    return(
        <>
            <header className="site_header">
                <div className="site_header_container">
                    <a href="/dashboard">Tablero</a>
                    <a href="/">Mi aula virtual</a>
                    <a href="">Herramientas</a>
                </div>
            </header>
        
        </>
    )
}