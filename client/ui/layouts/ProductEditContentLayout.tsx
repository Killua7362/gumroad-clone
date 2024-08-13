import { useState } from 'react';
import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';
import Button from '../components/button';

interface Review {
    reviewEdit: boolean;
    reviewScore: number;
    tempReviewScore: number;
    tempSelectReviewScore: number;
    reviewDescription: string;
    tempReviewDescription: string;
}

const ReviewComponent = () => {
    const [reviewOptions, setReviewOptions] = useState<Review>({
        reviewEdit: false,
        reviewScore: 1,
        tempReviewScore: 1,
        tempSelectReviewScore: 1,
        reviewDescription: '',
        tempReviewDescription: '',
    });

    return (
        <section className="flex flex-col w-full max-w-[20rem] border-white/30 border-[0.1px] h-fit p-4 justify-center items-center gap-y-3">
            <h2 className="p-2 text-2xl">Review</h2>
            <section className="flex gap-x-4 px-1 justify-between w-full">
                Rating:
                <ul className="flex my-[0.1rem] list-none">
                    {new Array(5).fill(0).map((e, i) => {
                        return (
                            <li
                                key={`review_star_${i}`}
                                className="cursor-pointer"
                                onMouseEnter={() => {
                                    reviewOptions.reviewEdit &&
                                        setReviewOptions((prev) => {
                                            return {
                                                ...prev,
                                                tempReviewScore: i + 1,
                                            };
                                        });
                                }}
                                onMouseLeave={() => {
                                    reviewOptions.reviewEdit &&
                                        setReviewOptions((prev) => {
                                            return {
                                                ...prev,
                                                tempReviewScore:
                                                    reviewOptions.tempSelectReviewScore,
                                            };
                                        });
                                }}
                                onClick={() => {
                                    reviewOptions.reviewEdit &&
                                        setReviewOptions((prev) => {
                                            return {
                                                ...prev,
                                                tempSelectReviewScore: i + 1,
                                            };
                                        });
                                }}>
                                {i < reviewOptions.tempReviewScore ? (
                                    <FaStar />
                                ) : (
                                    <CiStar />
                                )}
                            </li>
                        );
                    })}
                </ul>
            </section>
            {reviewOptions.reviewEdit ? (
                <fieldset className="border-white/30 border-[0.1px] focus-within:border-white">
                    <textarea
                        style={{
                            fontFamily: 'inherit',
                        }}
                        className="bg-background text-white outline-none text-base resize-none h-[6rem]"
                        value={reviewOptions.tempReviewDescription}
                        onChange={(event) => {
                            event.preventDefault();
                            reviewOptions.reviewEdit &&
                                event.currentTarget?.value &&
                                setReviewOptions((prev) => {
                                    return {
                                        ...prev,
                                        tempReviewDescription:
                                            event.currentTarget.value,
                                    };
                                });
                        }}
                    />
                </fieldset>
            ) : (
                <p className="text-base w-full">
                    {reviewOptions.reviewDescription === ''
                        ? 'No Description'
                        : reviewOptions.reviewDescription}
                </p>
            )}
            {reviewOptions.reviewEdit && (
                <ul className="flex gap-x-2 w-full list-none">
                    <li className="w-full">
                        <Button
                            extraClasses={[`!w-full`]}
                            buttonName={'Save'}
                            onClickHandler={() => {
                                setReviewOptions((prev) => {
                                    return {
                                        ...prev,
                                        reviewEdit: false,
                                        reviewDescription:
                                            reviewOptions.tempReviewDescription,
                                        reviewScore:
                                            reviewOptions.tempSelectReviewScore,
                                    };
                                });
                            }}
                        />
                    </li>
                    <li className="w-full">
                        <Button
                            extraClasses={[`!w-full`]}
                            buttonName={'Cancel'}
                            onClickHandler={() => {
                                setReviewOptions((prev) => {
                                    return {
                                        ...prev,
                                        reviewEdit: false,
                                        tempReviewDescription:
                                            reviewOptions.reviewDescription,
                                        tempReviewScore:
                                            reviewOptions.reviewScore,
                                    };
                                });
                            }}
                        />
                    </li>
                </ul>
            )}
            {!reviewOptions.reviewEdit && (
                <Button
                    extraClasses={[`!w-full`]}
                    buttonName={'Edit Review'}
                    onClickHandler={() => {
                        setReviewOptions((prev) => {
                            return { ...prev, reviewEdit: true };
                        });
                    }}
                />
            )}
        </section>
    );
};

export { ReviewComponent };
