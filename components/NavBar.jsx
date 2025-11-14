import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    return (
        <header>
            <nav className="flex items-center justify-between">
                <Link href="/" className="logo flex items-center gap-2">
                    <Image src="/icons/logo.png" alt="logo" height={24} width={24} />
                    <p>DevEvent</p>
                </Link>

                <ul className="flex gap-6 list-none">
                    <li><Link href="/">Home</Link></li>
                    <li><Link href="/">Events</Link></li>
                    <li><Link href="/">Create Event</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
