import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  User, 
  LogOut, 
  BookOpen, 
  MessageCircle, 
  Target, 
  Database, 
  Home, 
  Plus, 
  Trophy, 
  Wrench,
  ChevronDown,
  Menu,
  X,
  Calculator,
  PiggyBank,
  CreditCard,
  TrendingUp,
  Award,
  Globe
} from 'lucide-react'
import { PlounixLogo } from './logo'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'

interface NavbarProps {
  currentPage?: string
}

interface NavItem {
  name: string
  href: string
  icon: any
  description?: string
}

interface DropdownSection {
  title: string
  icon: any
  items: NavItem[]
}

export function Navbar({ currentPage }: NavbarProps) {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Main navigation items
  const mainNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Your financial overview' },
    { name: 'AI Assistant', href: '/ai-assistant', icon: MessageCircle, description: 'Get personalized help' }
  ]

  // Dropdown sections
  const dropdownSections: DropdownSection[] = [
    {
      title: 'Learning',
      icon: BookOpen,
      items: [
        { name: 'Learning Hub', href: '/learning', icon: BookOpen, description: 'Financial education' },
        { name: 'Challenges', href: '/challenges', icon: Trophy, description: 'Learn through challenges' },
        { name: 'Money Missions', href: '/money-missions', icon: Award, description: 'Complete financial tasks' }
      ]
    },
    {
      title: 'Tools',
      icon: Wrench,
      items: [
        { name: 'Digital Tools', href: '/digital-tools', icon: Wrench, description: 'Financial calculators' },
        { name: 'Budget Calculator', href: '/tools/budget-calculator', icon: Calculator, description: 'Plan your budget' },
        { name: 'Savings Tracker', href: '/tools/savings-tracker', icon: PiggyBank, description: 'Track your savings' }
      ]
    },
    {
      title: 'Finance',
      icon: TrendingUp,
      items: [
        { name: 'Financial Overview', href: '/transactions', icon: TrendingUp, description: 'View all transactions' },
        { name: 'Goals', href: '/goals', icon: Target, description: 'Set and track goals' },
        { name: 'Expense Log', href: '/add-transaction', icon: Plus, description: 'Record expenses' },
        { name: 'Pricing', href: '/pricing', icon: CreditCard, description: 'Subscription plans' }
      ]
    }
  ]

  const quickActions: NavItem[] = [
    { name: 'Resources', href: '/resource-hub', icon: Database, description: 'Helpful resources' }
  ]

  const handleDropdownClick = (title: string) => {
    setOpenDropdown(openDropdown === title ? null : title)
  }

  const handleLogout = async () => {
    try {
      await signOut()
      // Clear any cached data
      if (typeof window !== 'undefined') {
        localStorage.clear()
        sessionStorage.clear()
      }
      // Redirect to login with success message
      router.push('/auth/login?message=logged-out')
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: force redirect even if signOut fails
      router.push('/auth/login')
    }
  }

  // Don't render user info until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <PlounixLogo 
                  size="md" 
                  className="text-primary"
                />
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
            <p className="mb-6 text-gray-700">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={() => { setShowLogoutModal(false); handleLogout(); }}
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      <nav className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-3">
              <PlounixLogo 
                size="md" 
                className="text-primary"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            {/* Main nav items */}
            {mainNavItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant={currentPage === item.name.toLowerCase() ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2 h-9"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}

            {/* Dropdown sections */}
            {dropdownSections.map((section) => (
              <div key={section.title} className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 h-9"
                  onClick={() => handleDropdownClick(section.title)}
                  onMouseEnter={() => setOpenDropdown(section.title)}
                >
                  <section.icon className="w-4 h-4" />
                  <span>{section.title}</span>
                  <ChevronDown className="w-3 h-3 transition-transform duration-200" 
                    style={{ transform: openDropdown === section.title ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  />
                </Button>

                {/* Dropdown menu */}
                {openDropdown === section.title && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50"
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {section.items.map((item) => (
                      <Link key={item.name} href={item.href} onClick={() => setOpenDropdown(null)}>
                        <div className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                          <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            {item.description && (
                              <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Quick actions */}
            {quickActions.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button 
                  variant={currentPage === item.name.toLowerCase() ? "default" : "ghost"}
                  size="sm"
                  className="flex items-center space-x-2 h-9"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* User Profile/Logout - Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden xl:block">
                  Hi, {user.name || user.email.split('@')[0]}!
                </span>
                <div className="flex items-center space-x-1">
                  <Link href="/profile">
                    <Button 
                      variant={currentPage === "profile" ? "default" : "ghost"} 
                      size="sm"
                      className="h-9"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowLogoutModal(true)}
                    className="text-gray-600 hover:text-red-600 h-9"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="default" size="sm">Log In</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t bg-white py-4 space-y-2">
            {/* Main nav items */}
            {mainNavItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant={currentPage === item.name.toLowerCase() ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start space-x-3"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}

            {/* Dropdown sections - Mobile */}
            {dropdownSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center space-x-2">
                  <section.icon className="w-3 h-3" />
                  <span>{section.title}</span>
                </div>
                {section.items.map((item) => (
                  <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start pl-8 space-x-3"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            ))}

            {/* Quick actions */}
            {quickActions.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                <Button 
                  variant={currentPage === item.name.toLowerCase() ? "default" : "ghost"}
                  size="sm"
                  className="w-full justify-start space-x-3"
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}

            {/* User actions - Mobile */}
            <div className="border-t pt-4 mt-4 space-y-2">
              {user ? (
                <>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    Hi, {user.name || user.email.split('@')[0]}!
                  </div>
                  <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant={currentPage === "profile" ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start space-x-3"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      setShowLogoutModal(true)
                    }}
                    className="w-full justify-start space-x-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </Button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="default" size="sm" className="w-full">Log In</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}
