import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-gray-300 bg-gray-900">
      <div className="container flex items-center justify-between px-4 mx-auto">
        <p className="text-sm">
          © {new Date().getFullYear()} Gokstad Padel, Sandefjord.
        </p>
        <div className="flex space-x-4 text-xl">
          <a
            href="https://www.instagram.com/gokstadakademiet/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaInstagram />
          </a>
          <a
            href="https://www.facebook.com/gokstadakademiet/?locale=nb_NO"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaFacebook />
          </a>
          <a
            href="https://www.linkedin.com/in/odd-grimholt-7b1954ab/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://github.com/oddzor"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400"
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
