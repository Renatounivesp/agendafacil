import { Outlet } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Calendar className="w-6 h-6 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">AgendaFácil</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700">
              Entrar
            </Link>
            <Link to="/registrar" className="text-sm font-medium text-white bg-primary-600 py-2 px-4 rounded-md hover:bg-primary-700">
              Criar Conta
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} AgendaFácil. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;