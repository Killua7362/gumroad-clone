import browserHistory from '@/lib/browser_history';
import { SideBarProps } from '@/ui/pages/__root';
import { cx } from '@emotion/css';
import { Link, LinkProps } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';

interface SideBarCardProps {
    title: string;
    sideBarProps: SideBarProps;
    icon: React.ReactNode;
    isOpen: boolean;
    extraClasses?: string;
    closeSideBar?: boolean;
    onClickHandler?: () => void;
    windowWidth: number;
    disableLink?: boolean;
}

const SideBarCard = ({
    title,
    sideBarProps,
    icon,
    isOpen,
    extraClasses = '',
    closeSideBar = true,
    onClickHandler,
    windowWidth,
    disableLink = false,
    ...props
}: SideBarCardProps & LinkProps & React.RefAttributes<HTMLAnchorElement>) => {
    return (
        <Link
            onClick={(event) => {
                if (disableLink) event.preventDefault();
                if (closeSideBar && windowWidth < 640)
                    sideBarProps.setSideBarOpen(false);
                onClickHandler && onClickHandler();
            }}
            style={{
                textDecoration: 'none',
                color: 'white',
            }}
            {...props}>
            <motion.li
                className={cx(
                    `flex flex-row-reverse items-center p-4 border-white/30 gap-x-4 ${browserHistory.isActive(props.to as string) ? '!bg-white text-gray-800' : 'cursor-pointer hover:text-white/80 '}`,
                    extraClasses
                )}
                whileHover={{
                    backgroundColor: browserHistory.isActive(props.to as string)
                        ? '#ffff'
                        : '#2c2c31',
                }}>
                <span className="text-lg">{icon}</span>
                <AnimatePresence>
                    {isOpen && (
                        <motion.span className="overflow-hidden">
                            {title}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.li>
        </Link>
    );
};

export default SideBarCard;
