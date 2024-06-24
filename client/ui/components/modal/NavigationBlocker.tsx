import * as Modal from '@/ui/components/modal';
import Button from '../button';

const NavigationBlocker = ({
  listeners,
  proceed,
  reset,
}: {
  listeners: boolean;
  proceed: () => void;
  reset: () => void;
}) => {
  return (
    <Modal.Root listeners={listeners}>
      <Modal.Base>
        <div
          className="bg-background z-50 border-white/30 rounded-xl min-w-[15rem] border-[0.1px] p-6 text-lg flex flex-col gap-y-6 items-center"
          onClick={(e) => {
            e.stopPropagation();
          }}>
          <div className="text-xl">Unsaved Changes.</div>
          <div className="flex gap-x-4">
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
          </div>
        </div>
      </Modal.Base>
    </Modal.Root>
  );
};

export default NavigationBlocker;
