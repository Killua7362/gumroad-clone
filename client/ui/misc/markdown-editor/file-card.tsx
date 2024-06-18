import Button from '@/ui/components/button';
import DeleteContentItemModal from '@/ui/components/modal/DeleteContentItemsModal';
import { useCommands } from '@remirror/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const FileCard = ({ ...props }: any) => {
  const { deleteFile, updateFile } = useCommands();
  const [isExpanded, setIsExpanded] = useState(false);

  const slicedFileName = props.node.attrs.fileName.split('.');
  const file_name = slicedFileName.slice(0, -1).join('.');
  const extension = slicedFileName[slicedFileName.length - 1];

  const [renameValue, setRenameValue] = useState<string>(file_name);
  const [descriptionValue, setDescriptionValue] = useState<string>(
    props.node.attrs.description
  );
  const [editFields, setEditFields] = useState(false);

  return (
    <motion.div
      initial={{
        height: '6rem',
        borderColor: 'rgba(255,255,255,0.3)',
      }}
      exit={{
        height: '6rem',
        borderColor: 'rgba(255,255,255,0.3)',
      }}
      animate={{
        height: isExpanded ? (editFields ? '23.5rem' : '18.4rem') : '6rem',
        borderColor: isExpanded
          ? 'rgba(255,255,255,1)'
          : 'rgba(255,255,255,0.3)',
        transition: {
          duration: 0.1,
        },
      }}
      layout
      className={`px-6 pt-2 pb-4 flex flex-col gap-y-4 border-[0.1px] overflow-hidden`}
      style={{
        boxShadow: isExpanded ? '' : '0px 4px 0px 2px',
      }}>
      <div className={`flex justify-between items-center gap-x-4`}>
        <div className="w-[calc(100%-4rem)] my-1">
          <div className="text-3xl">{file_name}</div>
          <div className="flex justify-between w-full text-base text-white/70">
            <div>{props.node.attrs.fileSize} MB</div>
            <div>{props.node.attrs.fileType}</div>
          </div>
        </div>
        <div className="flex gap-x-4">
          {!editFields && (
            <Button
              buttonName=""
              isActive={isExpanded}
              extraClasses={[`!p-4 !rounded-none`]}
              onClickHandler={() => {
                !editFields && setIsExpanded(!isExpanded);
              }}>
              <IoIosArrowDown />
            </Button>
          )}
          <DeleteContentItemModal pos={props.getPosition()} />
        </div>
      </div>
      {isExpanded && (
        <div className="flex flex-col items-end gap-y-3">
          {editFields && (
            <fieldset className="w-full focus-within:border-white/80 border-white/30 border-[0.1px]">
              <legend className="text-sm">Name</legend>
              <input
                type="text"
                className="w-full h-full text-white bg-background outline-none text-lg px-2"
                value={renameValue}
                onChange={(e) => {
                  e.preventDefault();
                  setRenameValue(e.currentTarget.value);
                }}
                disabled={!editFields}
              />
            </fieldset>
          )}
          <fieldset className="w-full border-white/30 focus-within:border-white/80 border-[0.1px] min-h-[8rem]">
            <legend className="text-sm">Description</legend>
            <textarea
              className="w-full h-full text-white bg-background outline-none px-1 text-lg resize-none"
              style={{
                fontFamily: 'inherit',
              }}
              value={descriptionValue}
              onChange={(e) => {
                e.preventDefault();
                setDescriptionValue(e.currentTarget.value);
              }}
              disabled={!editFields}
            />
          </fieldset>
          <div className="flex gap-x-4">
            {editFields && (
              <Button
                buttonName="Cancel"
                onClickHandler={() => {
                  setEditFields(false);
                  setRenameValue(props.node.attrs.fileName);
                  setDescriptionValue(props.node.attrs.description);
                }}
              />
            )}
            <Button
              buttonName={editFields ? 'Save' : 'Edit'}
              onClickHandler={() => {
                setEditFields(!editFields);
                if (editFields) {
                  updateFile(props.getPosition(), {
                    ...props.node.attrs,
                    description: descriptionValue,
                    fileName: renameValue + '.' + extension,
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default FileCard;
