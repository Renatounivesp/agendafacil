import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../hooks/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const navigation = [
    { 
      name: 'Agendamentos', 
      href: '/dashboard/agendamentos', 
      icon: Calendar, 
      current: location.pathname === '/dashboard/agendamentos' 
    },
    { 
      name: 'Disponibilidade', 
      href: '/dashboard/disponibilidade', 
      icon: Clock, 
      current: location.pathname === '/dashboard/disponibilidade' 
    },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 pt-16">
      <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-shrink-0 px-4 flex items-center">
            <div className="h-8 w-auto">
              <div className="p-2 bg-primary-100 rounded-md inline-flex">
                <User className="h-5 w-5 text-primary-700" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">
                {user?.user_metadata?.username || 'Usuário'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={twMerge(
                  item.current
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-700',
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors'
                )}
              >
                <item.icon
                  className={twMerge(
                    item.current
                      ? 'text-primary-600'
                      : 'text-gray-400 group-hover:text-primary-600',
                    'mr-3 flex-shrink-0 h-5 w-5'
                  )}
                />
                {item.name}
              </Link>
            ))}

            <div className="pt-5 mt-5 border-t border-gray-200">
              <a
                href={`/agenda/${user?.user_metadata?.username}`}
                className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-primary-600 hover:bg-primary-50"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Calendar className="mr-3 flex-shrink-0 h-5 w-5 text-primary-500" />
                Ver meu link público
              </a>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;