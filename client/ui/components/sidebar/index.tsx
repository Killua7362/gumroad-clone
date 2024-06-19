import browserHistory from '@/lib/browser_history';
import { setLogOut } from '@/react-query/mutations';
import '@/ui/styles/sidebar.css';
import {
  LinkProps,
  getRouteApi,
  rootRouteId,
  useLocation,
} from '@tanstack/react-router';
import { motion } from 'framer-motion';
import _ from 'lodash';
import { useEffect, useLayoutEffect, useState } from 'react';
import { BsFillBackpack4Fill } from 'react-icons/bs';
import { CgLogOut } from 'react-icons/cg';
import { IoMdCart } from 'react-icons/io';
import { IoBagRemove, IoSettingsSharp } from 'react-icons/io5';
import { MdAccountCircle, MdOutlineKeyboardArrowLeft } from 'react-icons/md';
import { SiAboutdotme } from 'react-icons/si';
import SideBarCard from './card';

const route = getRouteApi(rootRouteId);

const SideBar = ({ ...sideBarProps }: SideBarProps) => {
  const {
    sideBarOpen: isOpen,
    windowWidth,
    setSideBarOpen: setIsOpen,
    setWindowWidth,
  } = sideBarProps;

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const location = useLocation();

  const divDesktopVariants = {
    initial: {
      width: '4rem',
      height: 'calc(100% - 2rem)',
    },
    animate: {
      width: isOpen ? '18rem' : '5rem',
      height: 'calc(100% - 2rem)',
      transition: {
        duration: 0.2,
      },
    },
  };

  const divMobileVariants = {
    initial: {
      width: 'calc(100% - 3.9rem)',
      height: '3.9rem',
    },
    animate: {
      width: 'calc(100% - 2rem)',
      height: isOpen ? 'calc(100% - 2rem)' : '3.9rem',
      transition: {
        duration: 0.2,
      },
    },
  };

  useEffect(() => {
    const width = window.innerWidth;
    const onResize = () => {
      if (width != window.innerWidth) {
        setWindowWidth(window.innerWidth);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const [rendered, setRendered] = useState(false);
  useLayoutEffect(() => {
    setWindowWidth(window.innerWidth);
    setRendered(true);
  }, []);

  useEffect(() => {
    browserHistory.setURL({
      to: location.pathname as any,
      search: location.search,
    });
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (windowWidth < 640 && isOpen) {
      document.body.classList.add('do-not-scroll');
    } else {
      document.body.classList.remove('do-not-scroll');
    }
  }, [windowWidth, isOpen]);

  const loginStatus = route.useLoaderData() as authSchema;
  const { mutate: loginStatusSetter, isPending } = setLogOut();

  return (
    rendered && (
      <motion.div
        initial="initial"
        animate="animate"
        exit="initial"
        variants={windowWidth! < 640 ? divMobileVariants : divDesktopVariants}
        className="fixed flex bg-background flex-col font-medium rounded-xl border-[0.1px] border-white/30 m-4 overflow-hidden"
        style={{
          zIndex: 30,
        }}>
        <div className="uppercase flex items-center text-xl sm:text-2xl py-4 sm:py-8 px-6 justify-between border-white/30 border-b-[0.1px]">
          <div className="">
            {isOpen && <div className="hidden sm:block">Gumroad</div>}
            <div className="block sm:hidden">
              {_.capitalize(location.pathname.split('/')[1])}
            </div>
          </div>
          <div
            className="relative top-0 sm:top-1 cursor-pointer"
            onClick={() => {
              setIsOpen(!isOpen);
            }}>
            <motion.div
              animate={{
                rotate: isOpen ? 0 : 180,
                transition: {
                  duration: 0.1,
                  delay: 0.1,
                },
              }}>
              <div className="rotate-[90deg] sm:rotate-0">
                <MdOutlineKeyboardArrowLeft />
              </div>
            </motion.div>
          </div>
        </div>
        <div
          className="flex flex-col overflow-y-scroll overflow-x-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-[#2c2c31] flex-1"
          style={{
            direction: 'rtl',
          }}>
          <SideBarCard
            title="Home"
            sideBarProps={sideBarProps}
            icon={<BsFillBackpack4Fill />}
            extraClasses="!px-6"
            isOpen={isOpen}
            windowWidth={windowWidth}
            {...(browserHistory.getURL('/home') as LinkProps)}
          />
          <SideBarCard
            title="Products"
            sideBarProps={sideBarProps}
            extraClasses="!px-6"
            icon={<IoBagRemove />}
            isOpen={isOpen}
            windowWidth={windowWidth}
            {...(browserHistory.getURL('/products/home') as LinkProps)}
          />
          <SideBarCard
            title="Checkout"
            sideBarProps={sideBarProps}
            extraClasses="!px-6"
            icon={<IoMdCart />}
            isOpen={isOpen}
            windowWidth={windowWidth}
            {...(browserHistory.getURL('/checkout/form') as LinkProps)}
          />
        </div>
        <motion.div
          initial={{
            height: '0',
            opacity: 0,
          }}
          animate={{
            height: isAccountOpen ? '16.1rem' : '5rem',
            opacity: 1,
            transition: {
              duration: 0.2,
            },
          }}
          exit={{
            height: '0',
            opacity: 0,
          }}
          className={`${isAccountOpen && 'border-[0.1px]'} overflow-hidden relative border-white/30 rounded-xl p-2 flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-white scrollbar-track-[#2c2c31]`}
          style={{
            direction: 'rtl',
          }}>
          {isAccountOpen && (
            <>
              <SideBarCard
                title="Settings"
                sideBarProps={sideBarProps}
                icon={<IoSettingsSharp />}
                isOpen={isOpen}
                disableLink={true}
                windowWidth={windowWidth}
                params={{ id: loginStatus.user_id! }}
                target="_blank"
                to="/"
              />
              <SideBarCard
                title="Profile"
                sideBarProps={sideBarProps}
                icon={<SiAboutdotme />}
                isOpen={isOpen}
                windowWidth={windowWidth}
                params={{ id: loginStatus.user_id! }}
                target="_blank"
                to="/profile/$id"
              />
              <SideBarCard
                title="Logout"
                onClickHandler={() => {
                  loginStatusSetter();
                }}
                disableLink={true}
                sideBarProps={sideBarProps}
                icon={<CgLogOut />}
                isOpen={isOpen}
                windowWidth={windowWidth}
                to="/"
              />
            </>
          )}
          <SideBarCard
            title="Account"
            onClickHandler={() => {
              setIsAccountOpen(!isAccountOpen);
            }}
            closeSideBar={false}
            disableLink={true}
            extraClasses={`${!isAccountOpen && 'border-[1px]'} rounded-xl`}
            sideBarProps={sideBarProps}
            icon={<MdAccountCircle />}
            isOpen={isOpen}
            windowWidth={windowWidth}
            to="/"
          />
        </motion.div>
      </motion.div>
    )
  );
};

export default SideBar;
