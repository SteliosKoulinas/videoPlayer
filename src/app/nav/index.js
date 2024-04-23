import Link from "next/link";

function NavBar() {
  return (
    <nav className="flex bg-black text-white justify-between">
      <div className="m-2 pl-2 text-lg font-bold">Super Duper Video Player</div>
     {/* 
      <ul className="flex">
        <li className="m-2 text-lg font-normal">
          <Link href="/about">About</Link>
        </li>
      </ul>
      */}
    </nav>
  );
}

export default NavBar;
