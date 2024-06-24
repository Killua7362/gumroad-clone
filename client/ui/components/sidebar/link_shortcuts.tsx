import { sidebarShortcutLinks } from '@/atoms/states';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaDeleteLeft } from 'react-icons/fa6';
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

const getLink = (panelProps: linkShortcutsSchema): string => {
  return `${(panelProps.absolute ? '//' : '') + panelProps.link}`;
};

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
        <div className="border-white/30 border-[0.1px] px-6">
          {links.map((items, idx) => {
            return (
              <div key={`shortcutLink_${idx}`} className={`py-2 flex gap-x-2`}>
                <a
                  href={getLink(items)}
                  target={items.newTab ? '_blank' : '_parent'}
                  style={{ textDecoration: 'none' }}
                  className="flex gap-x-2 ">
                  <IoIosLink className="text-lg text-sky-500 w-fit" />
                  <span className="text-white hover:text-white/70 w-[11.5rem] whitespace-nowrap text-ellipsis overflow-hidden">
                    {items.name}
                  </span>
                </a>
                <FaDeleteLeft
                  className="text-lg text-red-400 cursor-pointer "
                  onClick={(e) => {
                    e.stopPropagation();
                    setLinks((prev) => {
                      return prev.filter((_, i) => i !== idx);
                    });
                  }}
                />
              </div>
            );
          })}
        </div>
      )}
      <div
        className="min-h-[2rem] border-white w-full px-6 bg-white/10 text-white"
        onDragOver={(e) => {
          e.preventDefault();
          e.currentTarget.style.borderWidth = '0.1px';
          !dragging && setDragging(true);
        }}
        onDragLeave={(e) => {
          dragging && setDragging(false);
          e.currentTarget.style.borderWidth = '0px';
        }}
        onDrop={(e) => {
          e.preventDefault();
          const href = e.dataTransfer.getData('text/plain');
          e.currentTarget.style.borderWidth = '0px';
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
            className={`min-h-[5rem] min-w-[10rem] border-white/30 border-[0.1px] fixed  bottom-[4.5rem] bg-background z-50 p-4 flex flex-col gap-y-4`}>
            <div className="text-center text-xl uppercase">
              Create Link Shortcut
            </div>
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
              <legend className="text-white/80">Name</legend>
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
              <legend className="text-white/80">Link</legend>
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
                        link: showPanel.link.includes('http')
                          ? showPanel.link.split('//')[1]
                          : showPanel.link,
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
