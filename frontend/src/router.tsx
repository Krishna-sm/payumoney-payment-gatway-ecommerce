import {createBrowserRouter} from 'react-router-dom'
import App from './App'
import HomePage from './pages/HomePage'
import StatusPage from './pages/StatusPage'
export const router =createBrowserRouter([
    {
        path:'/',
        Component:App,
        children:[
            {
                path:'',
                Component:HomePage
            },
            {
                path:'payment/:status/:id',
                Component:StatusPage
            }
        ]
    }
])