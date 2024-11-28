import Logo from '../assets/undraw_vintage_414k.svg';

interface NavbarComponentProps {
  page: string;
  text: string;
}

export const NavbarComponent: React.FC<NavbarComponentProps> = ({
  page,
  text,
}) => {
  return (
    <nav className="w-full bg-emerald-600 text-white p-3 top-0">
      <div className="container mx-auto flex justify-between items-center">
        <div className="size-14 flex w-34">
          <img src={Logo} alt="Logo de Taxi" />
          <p className="min-w-14 ml-2 font-bold text-lg">Taxi App</p>
        </div>

        <div className="flex "></div>

        <ul className="flex font-bold space-x-6">
          <li className="hover:bg-emerald-700 px-4 py-2 rounded">
            <a href={page} className="transition duration-200">
              {text}
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
