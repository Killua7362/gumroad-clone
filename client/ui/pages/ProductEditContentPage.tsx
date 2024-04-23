import { Fragment } from "react/jsx-runtime"
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

import { PlaceholderExtension } from 'remirror/extensions';
import { EditorComponent, Remirror, useRemirror } from '@remirror/react';
import { MarkdownToolbar } from '@remirror/react'
import { MarkdownEditor } from '@remirror/react-editors/markdown';
import { css } from '@emotion/css';

const ProductEditContentPage = () => {
	const [reviewScore, setReviewScore] = useState(1)
	const [tempReviewScore, setTempReviewScore] = useState(1)
	const [reviewEdit, setReviewEdit] = useState(false)

	const [tempReviewDescription, setTempReviewDescription] = useState('')
	const [reviewDescription, setReviewDescripition] = useState('')

	const [value, setValue] = useState('<p></p>')

	const { manager, state } = useRemirror({
		extensions: () => [new PlaceholderExtension({ placeholder: `Start Typing here` })],
		content: "",
		selection: "end",
		stringHandler: "html"
	});

	return (
		<Fragment>
			<div className="flex flex-col border-white/30 border-[0.1px] h-fit rounded-md min-w-[18rem] p-5 justify-center items-center gap-y-3">
				<div className="p-2 text-2xl">
					Review
				</div>
				<div className="flex gap-x-4 px-1 justify-between w-full">
					<div className="text-lg">
						Your Rating:
					</div>
					<div className="flex my-[0.1rem]">
						{
							new Array(5).fill(0).map((e, i) => {
								return (
									<div className="cursor-pointer"
										onMouseEnter={() => {
											reviewEdit && setTempReviewScore(i + 1)
										}}
										onMouseLeave={() => { reviewEdit && setTempReviewScore(reviewScore) }}
										onClick={() => { reviewEdit && setReviewScore(i + 1) }}>
										{
											i < tempReviewScore ?
												<FaStar />
												:
												<CiStar />

										}
									</div>
								)
							})
						}
					</div>
				</div>
				{
					reviewEdit ?
						<div>
							<fieldset className="border-white/30 border-[0.1px] rounded-md focus-within:border-white">
								<textarea className="bg-background text-white outline-none text-base resize-y" value={tempReviewDescription} onChange={(e) => {
									setTempReviewDescription(e.currentTarget.value)
								}} />
							</fieldset>
						</div> :
						<div className="text-base w-full">
							{
								reviewDescription === "" ? "No Review" : reviewDescription
							}
						</div>
				}
				<div className={`border-white/30 border-[0.1px] w-full text-center py-2 rounded-md text-lg bg-white text-black hover:bg-white/80 cursor-pointer`}
					onClick={() => {
						reviewEdit ? setReviewEdit(false) : setReviewEdit(true)
						if (reviewEdit) {
							setReviewDescripition(tempReviewDescription)
						}
					}}>
					{
						reviewEdit ? "Save Changes" : "Edit Review"
					}
				</div>
			</div>
			<div className="w-full h-full focus-within:outline-none">
				<Remirror manager={manager} initialContent={state} autoFocus autoRender="end" classNames={[
					css`
						&.ProseMirror {
							padding: 0;
							height:70vh;
							outline:0;

							.remirror-is-empty:first-of-type::before{
								  color: #aaa;
								  content: attr(data-placeholder);
								  font-style: italic;
								  height: 0;
								  pointer-events: none;
								  position: absolute;
							}

						}

					`
				]}>

				</Remirror>
			</div>
		</Fragment>
	)
}

export default ProductEditContentPage
