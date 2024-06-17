import Button from '@/ui/components/button';
import DeleteContentItemModal from '@/ui/components/modal/DeleteContentItemsModal';
import { useCommands } from '@remirror/react';
import { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

const FileCard = ({ ...props }: any) => {
  const { deleteFile, renameFile } = useCommands();
  const [isExpanded, setIsExpanded] = useState(false);

  const slicedFileName = props.node.attrs.fileName.split('.');
  const file_name = slicedFileName.slice(0, -1).join('.');
  const extension = slicedFileName[slicedFileName.length - 1];

  const [renameValue, setRenameValue] = useState<string>(file_name);

  return (
    <div
      className={`px-6 pt-2 pb-4  ${isExpanded ? 'border-white' : 'border-white/30'} border-[0.1px] flex flex-col gap-y-4`}>
      <div className={`flex justify-between items-center `}>
        <div className="w-[calc(100%-4rem)] my-1">
          <div className="text-3xl">{file_name}</div>
          <div className="flex justify-between w-full text-base text-white/70">
            <div>{props.node.attrs.fileSize} MB</div>
            <div>{props.node.attrs.fileType}</div>
          </div>
        </div>

        <Button
          buttonName=""
          isActive={isExpanded}
          extraClasses={[`!p-4 !rounded-none`]}
          onClickHandler={() => {
            setIsExpanded(!isExpanded);
          }}>
          <IoIosArrowDown />
        </Button>
      </div>
      {isExpanded && (
        <div className="flex w-full gap-x-4">
          <input
            type="text"
            className="w-full text-white bg-background outline-none border-white/30 border-[0.1px] px-4 text-lg"
            defaultValue={renameValue}
            onChange={(e) => {
              e.preventDefault();
              setRenameValue(e.currentTarget.value + '.' + extension);
            }}
          />
          <Button
            buttonName="Save"
            onClickHandler={() => {
              renameFile(props.getPosition(), renameValue);
            }}
          />
          <DeleteContentItemModal pos={props.getPosition()} />
        </div>
      )}
    </div>
  );
};
export default FileCard;
