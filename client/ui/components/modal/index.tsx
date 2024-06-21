import { cx } from '@emotion/css';
import { AnimatePresence, motion } from 'framer-motion';
import { createContext, useContext, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const mountElement = document.getElementById('modals');

interface ModalContextContent {
  active?: boolean;
  setActive?: React.Dispatch<React.SetStateAction<boolean>>;
  listeners?: boolean;
}

export const modalContext = createContext<ModalContextContent>({});

const ModalRoot = ({
  children,
  listeners = true,
}: {
  children: React.ReactNode;
  listeners?: boolean;
}) => {
  const [active, setActive] = useState(!listeners);

  const contextValue = {
    active,
    setActive,
    listeners,
  };

  return (
    <modalContext.Provider value={contextValue}>
      {children}
    </modalContext.Provider>
  );
};

const ModalBase = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const { active, setActive, listeners } = useContext(modalContext);

  useEffect(() => {
    if (active) {
      document.body.classList.add('do-not-scroll');
    } else {
      document.body.classList.remove('do-not-scroll');
    }
  }, [active]);

  return createPortal(
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          exit={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 0.3,
            },
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (listeners) setActive!(false);
            onClick && onClick();
          }}
          className={cx(
            'top-0 fixed flex justify-center items-center z-50 w-screen min-h-screen bg-background/30 backdrop-blur-sm text-white'
          )}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    mountElement!
  );
};

const ModalClose = ({
  children,
  onClickHandler,
  className = 'h-full',
}: {
  children: React.ReactNode;
  onClickHandler?: () => Promise<boolean>;
  className?: string;
}) => {
  const { active, setActive, listeners } = useContext(modalContext);

  return (
    <div
      className={className}
      onClick={async (e) => {
        if (onClickHandler) {
          const status = await onClickHandler();
          if (status && listeners) {
            setActive!(false);
          }
        } else if (listeners) {
          setActive!(false);
        }
      }}>
      {children}
    </div>
  );
};

const ModalOpen = ({
  children,
  className = 'h-full',
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { active, setActive, listeners } = useContext(modalContext);

  return (
    <div
      className={className}
      onClick={(e) => {
        if (listeners) setActive!(true);
      }}>
      {children}
    </div>
  );
};

export {
  ModalBase as Base,
  ModalClose as Close,
  ModalOpen as Open,
  ModalRoot as Root,
};
