import * as Modal from '@/ui/components/modal';
import { useCommands } from '@remirror/react';
import { IoTrashBin } from 'react-icons/io5';
import Button from '../button';

const DeleteContentItemModal = ({ pos }: { pos: number }) => {
  const { deleteFile } = useCommands();

  return (
    <Modal.Root>
      <Modal.Base>
        <div className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center">
          <div className="text-xl">Confirm Delete?</div>
          <div className="flex gap-x-4">
            <Modal.Close>
              <Button buttonName="Cancel" type="button" />
            </Modal.Close>
            <Modal.Close>
              <Button
                buttonName="Confirm"
                type="button"
                onClickHandler={() => {
                  deleteFile(pos);
                }}
                extraClasses={[
                  '!border-red-400/70 !text-red-400 hover:text-red-400/70',
                ]}
              />
            </Modal.Close>
          </div>
        </div>
      </Modal.Base>
      <Modal.Open>
        <Button
          buttonName=""
          extraClasses={[`!p-4 !text-red-400 !border-red-400`]}>
          <IoTrashBin />
        </Button>
      </Modal.Open>
    </Modal.Root>
  );
};

export default DeleteContentItemModal;
