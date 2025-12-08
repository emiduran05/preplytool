import "./dashboard.css";
import Header from "../../layouts/header/Header";
import Aside from "../../layouts/aside/Aside";

export default function Dashboard(){

    return(
        <>
        
            <Header />

            <main className="main">

                <div className="aside">
                    <Aside />

                </div>


                <div className="dashboard_content">
                    <h2>Tablero</h2>

                    <img style={{width: "100%", objectFit: "cover", objectPosition: "end", maxHeight: "150px"}} src="https://st4.depositphotos.com/2627021/20490/i/1600/depositphotos_204904516-stock-photo-school-supplies-colorful-paper-background.jpg" alt="" />

                </div>

            </main>

        </>
    )
}