import { Link, useParams } from '@tanstack/react-router';
import Button from '../../button';

interface ProfileNavbar {
    name: string;
    preview: boolean;
}

const ProfileNavbar = ({ name, preview }: ProfileNavbar) => {
    const params = preview ? undefined : useParams({ strict: false });

    return (
        <header className="min-h-[6rem] py-8 sm:relative border-b border-white/10 w-full flex items-center justify-center bg-background">
            <div className="w-9/12 h-full flex items-center justify-between gap-x-16 gap-y-6 flex-wrap">
                <Link
                    disabled={preview}
                    to={preview ? `/` : `/profile/$id`}
                    className="no-underline text-white"
                    {...(!preview && { params: { id: params?.id! } })}>
                    <h1 className="text-4xl font-bold text-white">{name}</h1>
                </Link>
                <div className="flex gap-x-2 ">
                    <input
                        className="border-white/30 text-white focus-within:border-blue-500 text-xl focus-within:ring-blue-500 transition-colors duration-200 border-[0.1px] w-full rounded-md p-2  outline-none bg-inherit"
                        placeholder="Type your email"
                    />
                    <Button buttonName={'Submit'} />
                </div>
            </div>
        </header>
    );
};
export default ProfileNavbar;
