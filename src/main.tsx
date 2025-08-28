import {StrictMode} from 'react'
import './index.css'
import {createRoot} from 'react-dom/client'
import HomePage from './HomePage.tsx'
import '@mantine/core/styles.css'
import {MantineProvider} from "@mantine/core";
import {HelmetProvider} from "react-helmet-async";

createRoot(document.getElementById('root')!).render(
    <div className='font-orbitron'>
        <StrictMode>
            <MantineProvider defaultColorScheme="dark">
                <HelmetProvider>
                    <HomePage/>
                </HelmetProvider>
            </MantineProvider>
        </StrictMode>
    </div>
,
)
