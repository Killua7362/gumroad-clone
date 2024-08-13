import { css, cx } from '@emotion/css';
import Select, { GroupBase, Props } from 'react-select';

type SelectProps<
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
> = Props<Option, IsMulti, Group> & {
    placeholder: string;
    width?: string;
    height?: string;
};

export const SelectComponent = <
    Option,
    IsMulti extends boolean = false,
    Group extends GroupBase<Option> = GroupBase<Option>,
>(
    props: SelectProps<Option, IsMulti, Group>
) => {
    return (
        <Select
            {...props}
            styles={{
                control: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: '#3f3f46',
                    borderRadius: '6px',
                    width: props.width || 'auto',
                    minWidth: 'max-content',
                    minHeight: props.height ? props.height : '36px',
                    cursor: 'pointer',
                    padding: '0 8px',
                }),
                singleValue: (baseStyles) => ({
                    ...baseStyles,
                    color: 'white',
                }),

                input: (baseStyles) => ({
                    ...baseStyles,
                    color: 'white',
                }),
                placeholder: (baseStyles) => ({
                    ...baseStyles,
                    color: 'rgba(255, 255, 255, 0.8)',
                }),
                menu: (baseStyles) => ({
                    ...baseStyles,
                    backgroundColor: '#18181b',
                    border: '1px solid #3f3f46',
                    borderRadius: '6px',
                    padding: '4px',
                    width: 'max-content',
                    minWidth: '100%',
                }),
                menuList: (baseStyles) => ({
                    ...baseStyles,
                    whiteSpace: 'nowrap',
                }),
                option: (baseStyles, state) => ({
                    ...baseStyles,
                    backgroundColor: state.isFocused
                        ? '#3f3f46'
                        : 'transparent',
                    color: 'white',
                    cursor: 'pointer',
                    borderRadius: '4px',
                    ':hover': {
                        backgroundColor: '#3f3f46',
                    },
                    whiteSpace: 'nowrap',
                    padding: '8px 12px',
                }),
            }}
            placeholder={props.placeholder}
            classNamePrefix="react-select"
            className={cx(
                css`
                    .react-select {
                        &__indicator-separator {
                            display: none;
                        }
                        &__dropdown-indicator {
                            color: rgba(255, 255, 255, 0.6);
                        }
                    }
                `,
                `text-sm !cursor-pointer`
            )}
        />
    );
};
