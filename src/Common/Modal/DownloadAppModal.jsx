"use client";

import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { IoClose } from "react-icons/io5";

export default function DownloadAppModal({ isOpen, onClose, title = "Download App", description = "Download our app to continue" }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </Transition.Child>

        {/* Modal Container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 md:p-8 transform transition-all">
              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
              >
                <IoClose className="text-2xl" />
              </button>

              {/* Modal Header */}
              <div className="text-center mb-6">
                <Dialog.Title as="h2" className="fs-2xl font-bold text-theme-black mb-2">
                  {title}
                </Dialog.Title>
                <Dialog.Description as="p" className="fs-md text-gray-600">
                  {description}
                </Dialog.Description>
              </div>

              {/* App Download Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="https://play.google.com/store/apps/details?id=my.piggy.almari.trendy.style.rental"
                  className="inline-block hover:opacity-90 transition-opacity"
                  aria-label="Get it on Google Play"
                  onClick={onClose}
                  target="_blank"
                >
                  <Image
                    src="/Google.png"
                    alt="Get it on Google Play"
                    width={162}
                    height={48}
                    className="h-12 w-auto"
                  />
                </Link>
                <Link
                  href="https://apps.apple.com/in/app/piggy-almari-trends-on-rent/id6742538964"
                  className="inline-block hover:opacity-90 transition-opacity"
                  aria-label="Download on the App Store"
                  onClick={onClose}
                  target="_blank"
                >
                  <Image
                    src="/AppStore.png"
                    alt="Download on the App Store"
                    width={162}
                    height={48}
                    className="h-12 w-auto"
                  />
                </Link>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

