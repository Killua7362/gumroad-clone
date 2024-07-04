import * as Modal from '@/ui/components/modal';
import Button from '../button';

interface NavigationBlocker {
    listeners: boolean;
    proceed: () => void;
    reset: () => void;
}

const NavigationBlocker = ({
    listeners,
    proceed,
    reset,
}: NavigationBlocker) => {
    return (
        <Modal.Root listeners={listeners}>
            <Modal.Base>
                <article
                    className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg grid text-center gap-y-6 items-center m-[2rem]"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}>
                    <h2 className="text-xl">Unsaved Changes</h2>
                    <section className="flex gap-x-4">
                        <Modal.Close>
                            <Button
                                buttonName="Stay"
                                onClickHandler={async () => {
                                    await reset();
                                }}
                            />
                        </Modal.Close>
                        <Modal.Close>
                            <Button
                                buttonName="Proceed"
                                onClickHandler={async () => {
                                    await proceed();
                                }}
                                extraClasses={[
                                    '!border-red-400/70 !text-red-400 hover:text-red-400/70',
                                ]}
                            />
                        </Modal.Close>
                    </section>
                </article>
            </Modal.Base>
        </Modal.Root>
    );
};

export default NavigationBlocker;
