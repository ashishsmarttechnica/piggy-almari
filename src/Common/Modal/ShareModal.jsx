"use client";

import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { IoLogoWhatsapp } from "react-icons/io5";
import { IoChatbubblesOutline } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import { IoShareSocialOutline } from "react-icons/io5";

export default function ShareModal({ isOpen, onClose, shareText, shareUrl, shareTitle }) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      setIsMobile(mobileRegex.test(navigator.userAgent));
    }
  }, []);

  const handleWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, "_blank");
    onClose();
  };

//   const handleGoogleChat = () => {
//     // Google Chat web sharing URL
//     const googleChatUrl = `https://chat.google.com/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
//     window.open(googleChatUrl, "_blank");
//     onClose();
//   };

  const handleEmail = () => {
    const subject = encodeURIComponent(shareTitle || "Check out this product on Piggy Almari");
    const body = encodeURIComponent(shareText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    onClose();
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareText);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareText;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy link. Please try again.");
    }
  };

  const handleOtherApps = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        onClose();
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Share failed:", error);
        }
      }
    } else {
      // Fallback to copy if Web Share API not available
      handleCopyLink();
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
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
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 md:p-8 text-left align-middle shadow-xl transition-all">
                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <IoClose className="text-2xl" />
                </button>

                {/* Modal Header */}
                <div className="text-center mb-6">
                  <Dialog.Title as="h2" className="fs-2xl font-bold text-theme-black mb-2">
                    Share Product
                  </Dialog.Title>
                  <Dialog.Description as="p" className="fs-md text-gray-600">
                    Choose how you want to share this product
                  </Dialog.Description>
                </div>

                {/* Share Options */}
                <div className="space-y-3">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-green-500 hover:bg-green-50 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <IoLogoWhatsapp className="text-3xl text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="fs-lg font-semibold text-theme-black">WhatsApp</p>
                      <p className="fs-sm text-gray-600">Share via WhatsApp</p>
                    </div>
                  </button>

                  {/* Google Chat */}
                  {/* <button
                    type="button"
                    onClick={handleGoogleChat}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <IoChatbubblesOutline className="text-3xl text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="fs-lg font-semibold text-theme-black">Google Chat</p>
                      <p className="fs-sm text-gray-600">Share via Google Chat</p>
                    </div>
                  </button> */}

                  {/* Email */}
                  <button
                    type="button"
                    onClick={handleEmail}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <MdEmail className="text-3xl text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="fs-lg font-semibold text-theme-black">Email</p>
                      <p className="fs-sm text-gray-600">Share via Email</p>
                    </div>
                  </button>

                  {/* Copy Link */}
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                      <IoCopyOutline className="text-3xl text-purple-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="fs-lg font-semibold text-theme-black">
                        {copied ? "Copied!" : "Copy Link"}
                      </p>
                      <p className="fs-sm text-gray-600">
                        {copied ? "Link copied to clipboard" : "Copy link to clipboard"}
                      </p>
                    </div>
                  </button>

                  {/* Other Apps (Web Share API) - Show on mobile or if Web Share API is available */}
                  {(isMobile || navigator.share) && (
                    <button
                      type="button"
                      onClick={handleOtherApps}
                      className="w-full flex items-center gap-4 p-4 rounded-lg border-2 border-gray-200 hover:border-gray-500 hover:bg-gray-50 transition-all"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <IoShareSocialOutline className="text-3xl text-gray-600" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="fs-lg font-semibold text-theme-black">More Options</p>
                        <p className="fs-sm text-gray-600">Share via other apps</p>
                      </div>
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

