import { cx, css } from '@emotion/css'
import Select from 'react-select';
import { GroupBase } from 'react-select';
import { Props } from 'react-select';

type SelectProps<Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>> = Props<
	Option,
	IsMulti,
	Group
> & {
	placeholder: string;
};

export const SelectComponent = <Option, IsMulti extends boolean = false, Group extends GroupBase<Option> = GroupBase<Option>>(props: SelectProps<Option, IsMulti, Group>) => {
	return (
		<Select
			{...props}
			styles={{
				control: (baseStyles, state) => ({
					...baseStyles,
					borderColor: state.isFocused ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0.3)',
					backgroundColor: '#09090B',
					cursor: 'pointer',
					minWidth: "170px",
				}),
			}}
			classNamePrefix="react-select"
			className={cx(css`
							.react-select{
								&__menu {
									background-color:#09090B;
									border:solid 0.1px rgba(255,255,255,0.3);
									width: max-content;
								}

								&__option--is-focused{
									background-color:white;
									color:black;
									cursor:pointer;
								}
							}
						`, `text-base !cursor-pointer`)}
		/>
	)
}

