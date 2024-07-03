import { FaDotCircle } from 'react-icons/fa';
import { GoLink } from 'react-icons/go';

interface CollabCard {
    children: React.ReactNode;
    productData: ProductType;
}

const CollabCard = ({ children, productData }: CollabCard) => {
    const collabApproved = () => {
        return productData.collabs!.some((e) => e.approved === false);
    };

    return (
        <div className="flex justify-between h-full flex-wrap flex-row gap-4  border-white/30 border-[0.1px] rounded-xl p-8 h-fit w-full relative flex-wrap">
            <div className="flex flex-col gap-y-2 ">
                <div className="text-2xl tracking-wider flex gap-x-2 items-center">
                    <span>{productData.title}</span>
                    <span className="text-lg">
                        <GoLink />
                    </span>
                </div>
                <div className="flex gap-x-3 w-full">
                    <div className="text-xs px-3 py-[0.2rem] bg-white text-black w-fit h-fit rounded-xl">
                        Type
                    </div>
                    <div className="text-xs px-3 py-[0.2rem] bg-white text-black w-fit h-fit rounded-xl">
                        Type
                    </div>
                </div>
                <div className="flex gap-x-6 mt-1">
                    <div
                        className={`${collabApproved() ? 'text-red-400' : 'text-green-400 '} flex items-center gap-x-1`}>
                        <div className="text-sm relative top-[0.1rem]">
                            <FaDotCircle />
                        </div>
                        {collabApproved() ? 'Pending Approval' : 'Approved'}
                    </div>
                </div>
            </div>
            <div>
                <div className="mb-1">Shares</div>
                {productData.collabs!.map((e, i) => {
                    return (
                        <div
                            className={`gap-x-4 gap-y-2 grid grid-cols-5 mr-8 ${e.approved ? 'text-green-400' : 'text-red-400'}`}
                            key={`collab_${productData.title}_${i}`}>
                            <div className="col-span-4">{e.email}</div>
                            <div className="col-span-1">{e.share} %</div>
                        </div>
                    );
                })}
            </div>
            {children}
        </div>
    );
};
export default CollabCard;
