import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <Calendar className="h-16 w-16 text-primary-600 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Página não encontrada</h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
        Desculpe, a página que você está procurando não existe ou foi movida.
      </p>
      <Link to="/">
        <Button size="large">
          Voltar para o início
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;