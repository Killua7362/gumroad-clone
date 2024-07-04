import Button from '@/ui/components/button';
import * as Modal from '@/ui/components/modal';
import { useCommands } from '@remirror/react';
import { IoTrashBin } from 'react-icons/io5';

interface DeleteContentItemModal {
    pos: number;
}
const DeleteContentItemModal = ({ pos }: DeleteContentItemModal) => {
    const { deleteFile } = useCommands();

    return (
        <Modal.Root>
            <Modal.Base>
                <article className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg grid gap-y-6 text-center  m-[2rem]">
                    <h2 className="text-xl">Confirm Delete?</h2>
                    <section className="flex gap-x-4">
                        <Modal.Close>
                            <Button buttonName="Cancel" />
                        </Modal.Close>
                        <Modal.Close>
                            <Button
                                buttonName="Confirm"
                                onClickHandler={() => {
                                    deleteFile(pos);
                                }}
                                variant="destructive"
                            />
                        </Modal.Close>
                    </section>
                </article>
            </Modal.Base>
            <Modal.Open>
                <Button
                    buttonName=""
                    variant="destructive"
                    extraClasses={[`!p-4`]}>
                    <IoTrashBin />
                </Button>
            </Modal.Open>
        </Modal.Root>
    );
};

export default DeleteContentItemModal;
