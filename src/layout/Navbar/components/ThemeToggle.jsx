import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../../features/theme/themeSlice';
import { Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { themes } = useSelector((state) => state.theme);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <div className="dropdown dropdown-end">
      <button className="btn btn-ghost" onClick={handleToggleTheme}>
        {theme === themes.dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default ThemeToggle;
