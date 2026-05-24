import { Moon, Sun, LogOut, FileText } from 'lucide-react';
import useThemeStore from '../../store/themeStore';
import useAuthStore from '../../store/authStore';
import Button from '../ui/Button';

export default function Navbar() {
  const { theme, toggle } = useThemeStore();
  const { user, logout } = useAuthStore();

  return (
    <nav className="h-14 border-b border-border bg-card px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2">
        {/* <FileText className="h-5 w-5 text-primary" />
        <span className="font-semibold text-foreground">DocuMind</span> */}
        <img src="https://res.cloudinary.com/datflmfl4/image/upload/v1779567136/ChatGPT_Image_May_24_2026_01_41_54_AM_wrbeql.png" alt="DocuMind logo" className="w-52 h-34" />
      </div>

      <div className="flex items-center gap-3">
        {user && (
          <span className="text-sm text-muted-foreground hidden sm:block">
            {user.name}
          </span>
        )}
        <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        {user && (
          <Button variant="ghost" size="icon" onClick={logout} aria-label="Logout">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </nav>
  );
}