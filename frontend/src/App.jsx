import { useState } from 'react';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { ResearchListing } from './pages/ResearchListing';
import { ResearchDetail } from './pages/ResearchDetail';
import { Login } from './pages/Login';
import { Upload } from './pages/Upload';
import { Admin } from './pages/Admin';
import { Categories } from './pages/Categories';
import { About } from './pages/About';
import './App.css';

function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [currentResearchId, setCurrentResearchId] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [user, setUser] = useState(null);

    const handleNavigate = (page, researchId = null, category = null) => {
        // Check if page requires authentication
        if ((page === 'upload' || page === 'admin') && !user) {
            setCurrentPage('login');
            return;
        }
        // Check if page requires admin role
        if (page === 'admin' && user?.role !== 'admin') {
            return;
        }
        setCurrentPage(page);
        if (researchId) {
            setCurrentResearchId(researchId);
        }
        if (category) {
            setSelectedCategory(category);
        } else if (page === 'research' && !category) {
            setSelectedCategory('All');
        }
    };

    const handleLogin = (userData) => {
        setUser(userData);
        setCurrentPage('home');
    };

    const handleLogout = () => {
        setUser(null);
        setCurrentPage('home');
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <Home onNavigate={handleNavigate} />;
            case 'research':
                return <ResearchListing onNavigate={handleNavigate} initialCategory={selectedCategory} />;
            case 'categories':
                return <Categories onNavigate={handleNavigate} />;
            case 'about':
                return <About onNavigate={handleNavigate} />;
            case 'detail':
                return <ResearchDetail onNavigate={handleNavigate} researchId={currentResearchId || 'genome_cost'} />;
            case 'login':
                return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
            case 'upload':
                return user ? <Upload onNavigate={handleNavigate} user={user} /> : <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
            case 'admin':
                return user?.role === 'admin' ? <Admin onNavigate={handleNavigate} user={user} /> : <Home onNavigate={handleNavigate} />;
            default:
                return <Home onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                currentPage={currentPage}
                onNavigate={handleNavigate}
                user={user}
                onLogout={handleLogout}
            />
            <main>
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
