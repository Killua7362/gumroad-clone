import { Link } from '@tanstack/react-router';
import _ from 'lodash';
import { GoLink } from 'react-icons/go';

interface CollabCard {
    children: React.ReactNode;
    productData: ProductType;
}

const CollabCard = ({ children, productData }: CollabCard) => {
    const collabApproved = () => {
        return !productData.collabs!.some((e) => e.approved === false);
    };

    return (
        <article className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <header className="mb-4">
                <Link
                    className="group inline-flex items-center gap-2 no-underline"
                    to="/profile/$id/product/$productid"
                    params={{
                        id: productData.user_id!,
                        productid: productData.product_id!,
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={!productData.live}>
                    <h2 className="text-2xl font-bold tracking-wider group-hover:text-sky-400  ">
                        {productData.title}
                    </h2>
                    {productData.live && (
                        <GoLink className="text-lg text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </Link>
            </header>

            <section className="mb-4">
                <div className="flex flex-wrap gap-2 mb-2">
                    {productData.tags !== '' &&
                        productData.tags.split(',').map((tag, i) => (
                            <span
                                key={`product_card_tags_${i}`}
                                className="text-xs px-2 py-1 bg-indigo-600 text-white rounded-full">
                                {tag.trim()}
                            </span>
                        ))}
                </div>
                <div className="flex gap-4 text-sm">
                    <span
                        className={`flex items-center gap-1 ${productData.live ? 'text-green-400' : 'text-red-400'}`}>
                        {productData.live ? 'Live' : 'Not Live'}
                    </span>
                    {productData.collab_active &&
                        productData.collabs?.length !== 0 && (
                            <span
                                className={`flex items-center gap-1 ${collabApproved() ? 'text-green-400' : 'text-red-400'}`}>
                                {collabApproved()
                                    ? 'Collab Approved'
                                    : 'Collab Pending'}
                            </span>
                        )}
                </div>
            </section>

            <section className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Shares</h3>
                <div className="overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="text-left py-2">#</th>
                                <th className="text-left py-2">Email</th>
                                <th className="text-right py-2">Share</th>
                                <th className="text-center py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productData.collabs!.map((collab, i) => (
                                <tr
                                    key={`collab_${productData.title}_${i}`}
                                    className="border-b border-white/5">
                                    <td className="py-2">{i + 1}</td>
                                    <td className="py-2">{collab.email}</td>
                                    <td className="text-right py-2">
                                        {collab.share}%
                                    </td>
                                    <td className="text-center py-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs ${collab.approved ? 'bg-green-600' : 'bg-red-600'}`}>
                                            {collab.approved
                                                ? 'Approved'
                                                : 'Pending'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="font-semibold">
                                <td colSpan={2} className="py-2">
                                    Total
                                </td>
                                <td className="text-right py-2">
                                    {_.sum(
                                        productData.collabs!.map((e) => e.share)
                                    )}
                                    %
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>

            {children}
        </article>
    );
};

export default CollabCard;
