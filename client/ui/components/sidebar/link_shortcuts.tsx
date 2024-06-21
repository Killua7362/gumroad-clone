import { sidebarShortcutLinks } from '@/atoms/states';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoIosLink } from 'react-icons/io';
import { useRecoilState } from 'recoil';
import Button from '../button';

interface panelProps {
  active: boolean;
  name: string;
  link: string;
  absolute: boolean;
  newTab: boolean;
}

const LinkShortCuts = ({ isOpen }: { isOpen: boolean }) => {
  const [links, setLinks] = useRecoilState(sidebarShortcutLinks);
  const [showPanel, setShowPanel] = useState<panelProps>({
    active: false,
    name: '',
    link: '',
    absolute: false,
    newTab: false,
  });
  const [dragging, setDragging] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="border-white/30 border-[0.1px] w-full px-6">
          {links.map((items) => {
            return (
              <a
                href={`${(items.absolute ? '//' : '') + items.link}`}
                target={items.newTab ? '_blank' : '_parent'}
                className={`py-2 flex items-center gap-x-2 text-white hover:text-white/70`}
                style={{ textDecoration: 'none' }}>
                <IoIosLink className="text-lg text-sky-500" />
                <span className="whitespace-nowrap text-ellipsis w-full overflow-hidden">
                  {items.name}
                </span>
              </a>
            );
          })}
        </div>
      )}
      <div
        className="min-h-[2rem] w-full px-6 bg-white/10 text-white"
        onDragOver={(e) => {
          e.preventDefault();
          !dragging && setDragging(true);
        }}
        onDragLeave={(e) => {
          dragging && setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          const href = e.dataTransfer.getData('text/plain');
          setShowPanel((prev) => {
            return {
              active: true,
              name: href,
              link: href,
              absolute: true,
              newTab: false,
            };
          });
          setDragging(false);
        }}>
        <div
          className={`py-3 text-center flex justify-center gap-x-2 items-center  cursor-pointer hover:text-white/80 whitespace-nowrap`}
          onClick={(e) => {
            e.preventDefault();
            setShowPanel((prev) => {
              return { ...prev, name: '', link: '', active: !showPanel.active };
            });
          }}>
          {dragging ? (
            <>
              <IoIosLink className="text-lg" />
              {isOpen && <span>Drag and drop link</span>}
            </>
          ) : (
            <>
              <FaPlus className="text-lg" />
              {isOpen && <span>Add shortcut link</span>}
            </>
          )}
        </div>
      </div>
      <AnimatePresence>
        {showPanel.active && (
          <motion.div
            initial={{
              left: isOpen ? '19rem' : '6rem',
              opacity: 0,
            }}
            exit={{
              left: isOpen ? '19rem' : '6rem',
              opacity: 0,
            }}
            animate={{
              left: isOpen ? '19rem' : '6rem',
              opacity: 1,
              transition: {
                duration: 0.2,
              },
            }}
            className={`min-h-[5rem] min-w-[10rem] border-white border-[0.1px] fixed  bottom-[4.5rem] bg-background z-50 p-4 flex flex-col gap-y-4`}>
            <div className="text-center text-xl">Create Link Shortcut</div>
            <fieldset className="border-white/30 border-[0.1px] rounded-md focus-within:border-white">
              <input
                className="text-white bg-background w-full text-lg"
                value={showPanel.name}
                onChange={(e) => {
                  setShowPanel((prev) => {
                    return { ...prev, name: e.target.value };
                  });
                }}
                style={{
                  outline: '0',
                }}
              />
              <legend>Name</legend>
            </fieldset>
            <fieldset className="border-white/30 border-[0.1px] rounded-md focus-within:border-white">
              <input
                className="text-white bg-background w-full text-lg"
                value={showPanel.link}
                onChange={(e) => {
                  setShowPanel((prev) => {
                    return { ...prev, link: e.target.value };
                  });
                }}
                style={{
                  outline: '0',
                }}
              />
              <legend>Link</legend>
            </fieldset>
            <div className="flex justify-between">
              <span>Link is absolute?</span>
              <input
                type="checkbox"
                defaultChecked={showPanel.absolute}
                onChange={(e) => {
                  setShowPanel((prev) => {
                    return { ...prev, absolute: !showPanel.absolute };
                  });
                }}
              />
            </div>
            <div className="flex justify-between">
              <span>Open in new tab</span>
              <input
                type="checkbox"
                defaultChecked={showPanel.newTab}
                onChange={(e) => {
                  setShowPanel((prev) => {
                    return { ...prev, newTab: !showPanel.newTab };
                  });
                }}
              />
            </div>
            <div className="flex gap-x-2">
              <Button
                buttonName="Cancel"
                extraClasses={[`!w-full`]}
                onClickHandler={() => {
                  setShowPanel((prev) => {
                    return { ...prev, name: '', link: '', active: false };
                  });
                }}
              />
              <Button
                buttonName="Save"
                extraClasses={[`!w-full`]}
                onClickHandler={() => {
                  setLinks((prev: linkShortcutsSchema[]) => {
                    return [
                      ...prev,
                      {
                        name: showPanel.name,
                        link: showPanel.link,
                        absolute: showPanel.absolute,
                        newTab: showPanel.newTab,
                      },
                    ];
                  });
                  setShowPanel((prev) => {
                    return { ...prev, name: '', link: '', active: false };
                  });
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LinkShortCuts;
