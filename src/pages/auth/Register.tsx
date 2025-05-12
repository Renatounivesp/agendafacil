import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

type RegisterFormData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterFormData>();
  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { error } = await signUp(data.email, data.password, data.username);
      
      if (error) {
        toast.error('Falha ao criar conta. Verifique seus dados e tente novamente.');
        console.error('Registration error:', error);
        return;
      }
      
      toast.success('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      console.error('Unexpected error during registration:', error);
      toast.error('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Calendar className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            entre em sua conta existente
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <Input
              id="username"
              label="Nome de usuário"
              type="text"
              autoComplete="username"
              icon={<User className="h-5 w-5" />}
              error={errors.username?.message}
              {...register('username', { 
                required: 'Nome de usuário é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Nome de usuário deve ter no mínimo 3 caracteres'
                },
                pattern: {
                  value: /^[a-zA-Z0-9_-]+$/,
                  message: 'Nome de usuário deve conter apenas letras, números, _ e -'
                }
              })}
            />

            <Input
              id="email"
              label="Email"
              type="email"
              autoComplete="email"
              icon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Email inválido'
                }
              })}
            />

            <Input
              id="password"
              label="Senha"
              type="password"
              autoComplete="new-password"
              icon={<Lock className="h-5 w-5" />}
              error={errors.password?.message}
              {...register('password', { 
                required: 'Senha é obrigatória',
                minLength: {
                  value: 6,
                  message: 'Senha deve ter no mínimo 6 caracteres'
                }
              })}
            />

            <Input
              id="confirmPassword"
              label="Confirme a senha"
              type="password"
              icon={<Lock className="h-5 w-5" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { 
                required: 'Confirme sua senha',
                validate: value => value === password || 'As senhas não conferem'
              })}
            />

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="justify-center"
              >
                Criar conta
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;