import { Link } from '@tanstack/react-router';
import _ from 'lodash';
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
        <article className="flex flex-wrap gap-y-4 gap-x-6 border-white/30 border-[0.1px] rounded-xl p-6 relative justify-between max-w-[38rem] min-w-fit overflow-hidden">
            <section className="grid gap-y-2">
                <header>
                    <Link
                        className="group"
                        style={{
                            fontFamily: 'inherit',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}
                        to="/profile/$id/product/$productid"
                        params={{
                            id: productData.user_id!,
                            productid: productData.product_id!,
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        disabled={!productData.live}>
                        <h2 className="text-2xl tracking-wider flex gap-x-2 items-center group-hover:text-sky-400">
                            {productData.title}
                        </h2>
                        {productData.live && (
                            <GoLink className="text-lg text-sky-400 cursor-pointer opacity-0 group-hover:opacity-100" />
                        )}
                    </Link>
                </header>
                <footer className="grid gap-y-2">
                    <ul className="flex flex-wrap gap-x-3">
                        {productData.tags !== '' &&
                            productData.tags.split(',').map((e, i) => {
                                return (
                                    <li
                                        className="text-xs px-3 py-[0.2rem] bg-white text-black w-fit h-fit rounded-xl"
                                        key={`product_card_tags_${i}`}>
                                        {e}
                                    </li>
                                );
                            })}
                    </ul>
                    <ul className="flex gap-x-6 mt-1 text-sm">
                        <li
                            className={`${productData.live ? 'text-green-400' : 'text-red-400'}  flex items-center gap-x-1`}>
                            <FaDotCircle className="text-sm relative" />
                            Live
                        </li>
                        {productData.collab_active &&
                            productData.collabs?.length !== 0 && (
                                <li
                                    className={`${!collabApproved() ? 'text-green-400' : 'text-red-400'}  flex items-center gap-x-1 whitespace-nowrap`}>
                                    <FaDotCircle className="text-sm relative" />
                                    Collab Approved
                                </li>
                            )}
                    </ul>
                </footer>
            </section>
            <section className="w-full sm:w-auto text-lg">
                <h3 className="mb-1">Shares</h3>
                <table className="text-start border-spacing-2 text-base border-separate w-full sm:w-auto">
                    <thead>
                        <tr>
                            <th></th>
                            <th>
                                Email (approved{' '}
                                {
                                    productData.collabs?.filter(
                                        (e) => e.approved
                                    ).length
                                }{' '}
                                of {productData.collabs?.length})
                            </th>
                            <th>Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productData.collabs!.map((e, i) => {
                            return (
                                <tr
                                    className={`text-lg ${e.approved ? 'text-green-400' : 'text-red-400'}`}
                                    key={`collab_${productData.title}_${i}`}>
                                    <td className="text-white pr-4">{i + 1}</td>
                                    <td className="whitespace-nowrap">
                                        {e.email}
                                    </td>
                                    <td className="whitespace-nowrap">
                                        {e.share} %
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td>Total</td>
                            <td>
                                {_.sum(
                                    productData.collabs!.map((e) => e.share)
                                )}
                                %
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </section>
            {children}
        </article>
    );
};
export default CollabCard;
