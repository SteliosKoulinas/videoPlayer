import { HiOutlineMail } from "react-icons/hi";
import { IoLogoInstagram } from "react-icons/io5";

function Footer() {
  return (
    <div className="h-16 bg-pink-200 flex justify-between items-center">
      <div className="p-4 items-center">
        <p>© Super Duper Player 2024</p>
      </div>
      <div className="flex w-20 p-4 justify-between items-center">
       {/** <a href="https://www.instagram.com/ehohroma" target="_blank">
          <IoLogoInstagram />
        </a>
        */} 
        <a href="mailto:stelioskoulinas@gmail.com">
          <HiOutlineMail />
        </a>
      </div>
    </div>
  );
}

export default Footer;
