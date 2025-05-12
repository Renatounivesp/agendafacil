import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Check } from 'lucide-react';
import Button from '../components/ui/Button';

const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            Simplifique seu agendamento
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mb-8">
            Compartilhe seu link de agendamento. Deixe seus clientes escolherem um horário. Receba confirmações por e-mail.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/registrar">
              <Button size="large" variant="primary" className="bg-white text-primary-700 hover:bg-gray-100">
                Crie sua agenda
              </Button>
            </Link>
            <Link to="/login">
              <Button size="large" variant="outline" className="border-white text-white hover:bg-primary-700">
                Faça login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Como funciona</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              AgendaFácil simplifica todo o processo de agendamento para você e seus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Configure sua disponibilidade</h3>
              <p className="text-gray-600">
                Defina os dias e horários em que você está disponível para receber agendamentos.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Compartilhe seu link</h3>
              <p className="text-gray-600">
                Envie seu link personalizado para seus clientes ou adicione-o ao seu site ou redes sociais.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Receba agendamentos</h3>
              <p className="text-gray-600">
                Seus clientes escolhem um horário disponível e vocês recebem confirmações por e-mail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Por que usar o AgendaFácil?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Nossa plataforma foi criada para simplificar sua vida e melhorar a experiência dos seus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Check className="w-5 h-5 text-success-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Economize tempo</h3>
                <p className="mt-1 text-gray-600">
                  Elimine as idas e vindas de e-mails e mensagens para coordenar agendamentos.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Check className="w-5 h-5 text-success-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Reduza ausências</h3>
                <p className="mt-1 text-gray-600">
                  Com confirmações automáticas, seus clientes não esquecem seus compromissos.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Check className="w-5 h-5 text-success-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Acesso a qualquer hora</h3>
                <p className="mt-1 text-gray-600">
                  Seus clientes podem agendar 24 horas por dia, 7 dias por semana, mesmo quando você não está disponível.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Check className="w-5 h-5 text-success-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Interface intuitiva</h3>
                <p className="mt-1 text-gray-600">
                  Nosso sistema é fácil de usar tanto para você quanto para seus clientes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para começar?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Crie sua conta gratuita agora e comece a receber agendamentos de forma simples e profissional.
          </p>
          <Link to="/registrar">
            <Button size="large" variant="primary" className="bg-white text-primary-700 hover:bg-gray-100">
              Criar conta gratuita
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;