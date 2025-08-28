import {Tetris} from "./components/Tetris.tsx";
import {Footer} from "./components/Footer.tsx";
import {Helmet} from "react-helmet-async";

export default function HomePage() {
    return <div className="text-xs sm:text-lg">
        <Tetris/>
        <Footer/>

        <Helmet>
            <title> Tetris [Detris] web game by Doktorov A.V. </title>
            <meta name='description' content='Welcome to Doktorov A.V. Tetris Game [Detris] web-page!'/>
            <meta name='keywords' content='react, vite, doktorov, alexander, website, play, tetris, detris'></meta>
        </Helmet>
    </div>
}