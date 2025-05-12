import { Link, useParams } from 'react-router-dom';
import { Check, Calendar } from 'lucide-react';
import Button from '../../components/ui/Button';

const SuccessPage = () => {
  const { username } = useParams<{ username: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center">
        <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-success-100 mb-6">
          <Check className="h-12 w-12 text-success-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Agendamento confirmado!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Seu agendamento foi realizado com sucesso. Você receberá um email de confirmação em breve.
        </p>
        <div className="flex flex-col space-y-4">
          <Link to={`/agenda/${username}`}>
            <Button variant="outline" className="w-full" icon={<Calendar className="h-5 w-5" />}>
              Fazer outro agendamento
            </Button>
          </Link>
          <Link to="/">
            <Button className="w-full">
              Voltar para o início
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;