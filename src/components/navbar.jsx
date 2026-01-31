/**
 * Navbar Component
 * Main navigation with scroll behavior and mobile menu
 */

import { useState } from 'react';
import { Dialog, DialogPanel, DialogBackdrop, Transition, TransitionChild } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

import { 
    Logo,
    Bars3Icon, 
    XMarkIcon,
    HomeIcon,
    Squares2X2Icon,
    UserCircleIcon,
    ArrowRightIcon,
} from './ui';
import { useScrollBehavior } from '../hooks';
import { NAVIGATION_ITEMS, AUTH_NAVIGATION, ROUTES } from '../constants';

// Icon mapping
const iconMap = {
    home: HomeIcon,
    collections: Squares2X2Icon,
    user: UserCircleIcon,
};

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { scrolled, hidden } = useScrollBehavior();
    const location = useLocation();

    // Check if link is active
    const isActive = (path) => {
        if (path === ROUTES.HOME) {
            return location.pathname === ROUTES.HOME;
        }
        return location.pathname.startsWith(path);
    };

    return (
        <header 
            className={clsx(
                'sticky top-0 z-50 backdrop-blur-xl border-b transition-all duration-500',
                scrolled 
                    ? 'bg-white/90 border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.05)]' 
                    : 'bg-white/70 border-neutral-100',
                hidden ? '-translate-y-full' : 'translate-y-0'
            )}
        >
            <nav aria-label="Global" className="flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
                {/* Logo / Brand */}
                <div className="flex flex-1 items-center gap-3">
                    <Logo showName className="hidden sm:flex" />
                    <Logo className="sm:hidden" />
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen(true)}
                        className="icon-btn"
                    >
                        <span className="sr-only">Open menu</span>
                        <Bars3Icon aria-hidden="true" className="w-5 h-5" strokeWidth={2} />
                    </button>
                </div>

                {/* Desktop navigation - centered */}
                <div className="hidden lg:flex lg:items-center lg:gap-x-1 absolute left-1/2 -translate-x-1/2">
                    {NAVIGATION_ITEMS.map((item) => {
                        const Icon = iconMap[item.icon];
                        const active = isActive(item.to);
                        return (
                            <Link 
                                key={item.name} 
                                to={item.to} 
                                className={clsx('nav-link group', active && 'nav-link-active')}
                            >
                                {Icon && (
                                    <Icon 
                                        className={clsx(
                                            'nav-link-icon group-hover:text-neutral-600',
                                            active && 'nav-link-icon-active'
                                        )} 
                                        strokeWidth={2} 
                                    />
                                )}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Desktop login link */}
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                    <Link 
                        to={AUTH_NAVIGATION.signIn.to}
                        className={clsx('nav-link group', isActive(ROUTES.LOGIN) && 'nav-link-active')}
                    >
                        <UserCircleIcon 
                            className={clsx(
                                'nav-link-icon group-hover:text-neutral-600',
                                isActive(ROUTES.LOGIN) && 'nav-link-icon-active'
                            )} 
                        />
                        <span>{AUTH_NAVIGATION.signIn.name}</span>
                    </Link>
                </div>
            </nav>

            {/* Mobile menu dialog with smooth transitions */}
            <Transition show={mobileMenuOpen}>
                <Dialog onClose={setMobileMenuOpen} className="lg:hidden relative z-50">
                    {/* Backdrop with fade animation */}
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <DialogBackdrop className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </TransitionChild>

                    {/* Panel with slide animation */}
                    <TransitionChild
                        enter="ease-out duration-300"
                        enterFrom="translate-x-full"
                        enterTo="translate-x-0"
                        leave="ease-in duration-200"
                        leaveFrom="translate-x-0"
                        leaveTo="translate-x-full"
                    >
                        <DialogPanel className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                                <Logo 
                                    showName 
                                    onClick={() => setMobileMenuOpen(false)} 
                                />
                                <button
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="icon-btn"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="w-5 h-5" strokeWidth={2} />
                                </button>
                            </div>

                            {/* Navigation links with stagger animation */}
                            <div className="mt-10">
                                <nav className="space-y-1">
                                    {NAVIGATION_ITEMS.map((item, index) => {
                                        const Icon = iconMap[item.icon];
                                        const active = isActive(item.to);
                                        return (
                                            <Link
                                                key={item.name}
                                                to={item.to}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className={clsx(
                                                    'mobile-nav-link group menu-item-animate',
                                                    `menu-item-delay-${index + 1}`,
                                                    active && 'mobile-nav-link-active'
                                                )}
                                            >
                                                {Icon && (
                                                    <div className={clsx(
                                                        'mobile-nav-icon-wrapper group-hover:bg-neutral-200 group-hover:text-neutral-700',
                                                        active && 'mobile-nav-icon-wrapper-active'
                                                    )}>
                                                        <Icon className="w-5 h-5" strokeWidth={2} />
                                                    </div>
                                                )}
                                                <span className="text-lg font-semibold flex-1">{item.name}</span>
                                                <ArrowRightIcon 
                                                    className={clsx(
                                                        'w-4 h-4 transition-all duration-200',
                                                        active 
                                                            ? 'text-neutral-400' 
                                                            : 'text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-1'
                                                    )} 
                                                    strokeWidth={2} 
                                                />
                                            </Link>
                                        );
                                    })}
                                    
                                    {/* Sign In */}
                                    <Link
                                        to={AUTH_NAVIGATION.signIn.to}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={clsx(
                                            'mobile-nav-link group menu-item-animate',
                                            `menu-item-delay-${NAVIGATION_ITEMS.length + 1}`,
                                            isActive(ROUTES.LOGIN) && 'mobile-nav-link-active'
                                        )}
                                    >
                                        <div className={clsx(
                                            'mobile-nav-icon-wrapper group-hover:bg-neutral-200 group-hover:text-neutral-700',
                                            isActive(ROUTES.LOGIN) && 'mobile-nav-icon-wrapper-active'
                                        )}>
                                            <UserCircleIcon className="w-5 h-5" />
                                        </div>
                                        <span className="text-lg font-semibold flex-1">{AUTH_NAVIGATION.signIn.name}</span>
                                        <ArrowRightIcon 
                                            className={clsx(
                                                'w-4 h-4 transition-all duration-200',
                                                isActive(ROUTES.LOGIN) 
                                                    ? 'text-neutral-400' 
                                                    : 'text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-1'
                                            )} 
                                            strokeWidth={2} 
                                        />
                                    </Link>
                                </nav>
                            </div>

                            {/* Footer hint */}
                            <div className="absolute bottom-8 left-6 right-6">
                                <p className="text-xs text-neutral-400 text-center">
                                    Swipe or tap outside to close
                                </p>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </Dialog>
            </Transition>
        </header>
    );
};

export default Navbar;
