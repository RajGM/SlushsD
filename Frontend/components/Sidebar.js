// components/Sidebar.js
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const sidebarItems = [
  { icon: '🧙‍♂️', text: 'Magic Tools', href: '/tools' },
  { icon: '📜', text: 'Output History', href: '/tools/history' },
  { icon: '👥', text: 'Group', href: '/group' },
  { icon: '📝', text: 'Exams', href: '/exams' },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow-lg h-screen p-4 flex flex-col">
      <div className="text-2xl font-bold text-orange-400 mb-8"><a href="/" >Super Tutor AI</a></div>
      <nav className="flex-grow">
        {sidebarItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <div className="flex items-center mb-4 text-gray-700 hover:text-purple-600 cursor-pointer">
              <span className="mr-2">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="text-center text-cyan-400 font-bold mb-4">
          TEACHERS ARE MAGIC
        </div>
        <LogoutButton />
      </div>
    </div>
  );
}