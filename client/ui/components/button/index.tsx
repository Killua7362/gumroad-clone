import { cx } from '@emotion/css';
import { motion } from 'framer-motion';
import Loader from '../loader';

type ButtonTypes = 'button' | 'submit' | 'reset' | undefined;

interface ButtonSchema {
    buttonName: string;
    extraClasses?: string[];
    type?: ButtonTypes;
    onClickHandler?: () => void;
    children?: React.ReactNode;
    isActive?: boolean;
    isLoading?: boolean;
    variant?: 'normal' | 'destructive';
    title?: string;
    formID?: string;
}

const Button = ({
    buttonName,
    extraClasses = [''],
    type = 'button',
    onClickHandler,
    children,
    isActive = false,
    isLoading = false,
    variant = 'normal',
    title,
    formID = '',
}: ButtonSchema) => {
    const variants = {
        normal: 'border-white/30 text-white',
        destructive: 'border-red-500 text-red-500',
    };

    return (
        <motion.button
            title={title || ''}
            type={type}
            form={formID}
            onClick={async (e) => {
                if (onClickHandler) {
                    await onClickHandler();
                }
            }}
            whileHover={{
                ...(!isActive && {
                    transform: 'translate(-4px,-4px)',
                    boxShadow: '4px 4px 0px -1px',
                }),
                transition: {
                    type: 'ease-out',
                    duration: 0.1,
                },
            }}
            whileTap={{
                ...(!isActive && {
                    transform: 'translate(2px,2px)',
                    boxShadow: '0px 0px 0px 0px',
                }),
                transition: {
                    type: 'ease-in',
                    duration: 0.1,
                },
            }}
            className={cx(
                `save-button px-4 py-2 flex justify-center gap-x-3 items-center ${isActive && '!border-white !cursor-normal'} cursor-pointer rounded-md border-[0.1px] bg-background text-lg w-fit`,
                variants[variant],
                ...extraClasses
            )}>
            {isLoading && <Loader />}
            {buttonName !== '' && (
                <span className={`${isLoading && 'invisible'} `}>
                    {buttonName}
                </span>
            )}
            {children}
        </motion.button>
    );
};

export default Button;
